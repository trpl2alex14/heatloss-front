<template>
	<div class="pt-6 flex flex-col gap-4">
		<h2 class="text-xl bg-gray-200 px-2 py-1 rounded-md">Редактирование материалов</h2>
		<p v-if="errorMessage" class="text-md text-red-600">{{ errorMessage }}</p>
		<div v-if="entity" class="flex flex-row gap-2">
			<div class="flex flex-col gap-2 w-60">
				<BaseImageUpload
					class="bg-gray-100 p-4 rounded-lg"
					:src="entity.photo"
					@upload="uploadPhoto"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<BaseInputText
					v-model="entity.name"
					label="Название"
					class="min-w-150"
					:invalid="isInvalidField('name')"
				/>
				<div class="flex flex-wrap gap-2">
					<BaseSelect
						ref="categoryRef"
						v-model="entity.category"
						:options="categories"
						optionLabel="name"
						optionValue="name"
						label="Категория"
						placeholder="Выберите"
						class="flex-1"
						filter
						:loading="isLoadingCategories"
						autoFilterFocus
						@filter="filterValue = $event.value"
						resetFilterOnHide
					>
						<template #empty-filter>
							<BaseButton label="Добавить" @click="addCategory"/>
						</template>
					</BaseSelect>
					<BaseSelectButton
						:options="[
							{ label: 'Материал', value: 1 },
							{ label: 'Конструкция', value: 2 },
						]"
						v-model="entity.type"
						:invalid="isInvalidField('type')"
						:allow-empty="false"
					/>
				</div>
				<div class="flex flex-wrap gap-2 my-4">
					<BaseMultiSelect
						v-model="entity.surface"
						:options="surfaces"
						label="Применяется на поверхностях"
						option-label="label"
						option-value="value"
						placeholder="..."
						class="flex-1"
						filter
					/>
				</div>
				<div class="flex flex-wrap gap-2">
					<BaseInputNumber
						v-if="entity.type === 1"
						v-model="entity.a"
						label="Коэфф. А"
						suffix=""
						class="flex-1"
						:invalid="isInvalidField('a')"
					/>
					<BaseInputNumber
						v-if="entity.type === 1"
						v-model="entity.b"
						label="Коэфф. Б"
						suffix=""
						class="flex-1"
						:invalid="isInvalidField('b')"
					/>
					<BaseInputNumber
						v-if="entity.type === 2"
						v-model="entity.r"
						label="Сопротивление"
						suffix="(м²*С°)/Вт"
						class="flex-1"
						:invalid="isInvalidField('r')"
					/>
				</div>
			</div>
		</div>
		<div class="flex flex-row gap-2 justify-end w-full">
			<BaseButton v-if="entity" label="Сохранить" icon="save" @click="save"/>
			<BaseButton
				label="Закрыть"
				icon="times-circle"
				variant="outlined"
				severity="danger"
				@click="emit('close')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref, useTemplateRef, watch} from "vue";
import type {MaterialItem} from "../types";
import {BaseInputNumber, BaseInputText, BaseMultiSelect, BaseSelect, BaseSelectButton} from "@/shared/components";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import {useForm} from "@features/directories/composables/useForm.ts";
import {useMaterialCategoryData} from "@features/directories/composables/useMaterialCategoryData.ts";
import {useTypes} from "@shared/composables/useTypes.ts";
import BaseImageUpload from "@shared/components/ui/BaseImageUpload.vue";

type Props = {
	id?: number;
};

const emit = defineEmits<{
	(e: "save", entity: MaterialItem): void;
	(e: "close"): void;
}>();

const filterValue = ref('');
const categoryRef = useTemplateRef('categoryRef');

const props = defineProps<Props>();

const {typeSurfaces: surfaces} = useTypes();

const {categories, loadCategoriesData, isLoading: isLoadingCategories} = useMaterialCategoryData();

const {entity, errorMessage, fetchEntity, isInvalidField, save: saveEntity} = useForm<MaterialItem>({
	get: 'api-material',
	create: 'api-material-create',
	update: 'api-material',
})

watch(
	() => props.id,
	(id) => {
		id && fetchEntity(id);
	}
);

onMounted(() => {
	loadCategoriesData();

	if (props.id) {
		fetchEntity(props.id);
	} else {
		entity.value = {
			type: 1,
			surface: ['wall', 'roof', 'floor']
		};
	}
});

const uploadPhoto = (file: string) => {
	entity.value.photo = file;
}

const save = async () => {
	if (entity.value.type === 1) {
		entity.value.r = undefined;
	} else {
		entity.value.a = entity.value.b = undefined;
	}

	const result = await saveEntity(props.id)
	if (result) {
		emit("save", result);
	}
};

const addCategory = () => {
	categories.value.push({name: filterValue.value})
	entity.value.category = filterValue.value;
	if(categoryRef.value?.selectRef) {
		categoryRef.value.selectRef.hide();
	}
}
</script>
