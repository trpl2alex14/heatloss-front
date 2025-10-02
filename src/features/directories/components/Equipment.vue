<template>
	<div class="pt-6 flex flex-col gap-4">
		<h2 class="text-xl bg-gray-200 px-2 py-1 rounded-md">Редактирование оборудования</h2>
		<p v-if="errorMessage" class="text-md text-red-600">{{ errorMessage }}</p>
		<div v-if="entity" class="flex flex-row gap-2">
			<div class="w-60">
				<BaseImageUpload
					class="bg-gray-100 p-4 rounded-lg"
					:src="entity.photo"
					@upload="uploadPhoto"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<BaseSelectButton
					:options="product"
					v-model="entity.product"
					:invalid="isInvalidField('product')"
					:allow-empty="false"
				/>

				<BaseInputText
					v-model="entity.name"
					label="Название"
					class="min-w-150"
					:invalid="isInvalidField('name')"
				/>
				<div class="flex flex-row gap-2">
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
					<BaseInputText
						v-model="entity.article"
						label="Артикул"
						class="w-1/2"
						:invalid="isInvalidField('article')"
					/>
				</div>

				<div class="flex flex-row gap-2 justify-end">
					<BaseInputNumber
						v-model="entity.price"
						label="Стоимость"
						suffix="₽"
						class="w-1/2"
						:invalid="isInvalidField('price')"
					/>
				</div>

				<div class="flex flex-wrap gap-2 my-4">
					<BaseMultiSelect
						v-model="entity.tags"
						:options="tagsOptions"
						label="Тэги"
						option-label="label"
						option-value="value"
						placeholder="..."
						class="flex-1"
						filter
					/>
				</div>

				<Properties
					v-model="entity.properties"
					class="bg-gray-100 p-4 rounded-lg"
					:errors="propertyErrors"
				/>
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
import {onMounted, ref, useTemplateRef, watch, computed} from "vue";
import type {Equipment} from "../types";
import {BaseInputNumber, BaseInputText, BaseMultiSelect, BaseSelect, BaseSelectButton} from "@/shared/components";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import {useForm} from "@features/directories/composables/useForm.ts";
import {useTypes} from "@shared/composables/useTypes.ts";
import BaseImageUpload from "@shared/components/ui/BaseImageUpload.vue";
import {useEquipmentCategoryData} from "@features/directories/composables/useEquipmentCategoryData.ts";
import {useTagsApi} from "@shared/api/tags.ts";
import type {SelectOption, Tag} from "@shared/types/ui.ts";
import Properties from "@features/directories/components/Properties.vue";
import {useSettings} from "@features/settings/composables/useSettings.ts";

type Props = {
	id?: number;
};

const emit = defineEmits<{
	(e: "save", entity: Equipment): void;
	(e: "close"): void;
}>();

const filterValue = ref('');
const categoryRef = useTemplateRef('categoryRef');

const props = defineProps<Props>();

const {productCategory} = useTypes();

const {categories, loadCategoriesData, isLoading: isLoadingCategories} = useEquipmentCategoryData();

const {radiatorCategory, regulatorCategory, powerProperty, maxPowerProperty} = useSettings();

const {data: tags, loadData: loadTags} = useTagsApi('equipment');

loadTags();

const {entity, errorMessage, fetchEntity, isInvalidField, getErrorFields, save: saveEntity}
	= useForm<Equipment>({
	get: 'api-equipment',
	create: 'api-equipment-create',
	update: 'api-equipment',
})

const propertyErrors = computed(() => {
	return getErrorFields('properties');
})

const product = computed(() =>
	productCategory.map((v) => ({
		value: v.key,
		label: v.label || v.key,
		image: v.image
	}))
);

const unknownTags = computed(() => {
	return entity.value.tags?.filter((tag: string) => !tags.value?.data.some((i: Tag) => i.label === tag)) || [];
})

const tagsOptions = computed<SelectOption[]>(() => {
	const list = tags.value?.data || [];
	const missing = unknownTags.value?.map((tag: string) => ({
		label: tag,
		value: tag,
		icon: 'hashtag',
	}));
	return [
		...list.map((t: Tag) => ({
			label: t.label,
			value: t.label,
			icon: t.icon,
		})),
		...missing
	];
});

watch(entity, (entity: Equipment) => {
	if (entity.properties && entity.properties.length > 0) {
		return;
	}

	if (radiatorCategory.includes(entity.category || '')) {
		entity.properties = [{
			label: 'Мощность',
			measure: 'Вт',
			key: powerProperty,
			value: 0
		}];
	}

	if (regulatorCategory.includes(entity.category || '')) {
		entity.properties = [{
			label: 'Макс. нагрузка',
			measure: 'Вт',
			key: maxPowerProperty,
			value: 0
		}];
	}

	if (!entity.properties) {
		entity.properties = [];
	}
}, {
	deep: true
});

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
			product: 'all',
			//def
		};
	}
});

const uploadPhoto = (file: string) => {
	entity.value.photo = file;
}

const save = async () => {
	const result = await saveEntity(props.id)
	if (result) {
		emit("save", result);
	}
};

const addCategory = () => {
	categories.value.push({name: filterValue.value})
	entity.value.category = filterValue.value;
	if (categoryRef.value?.selectRef) {
		categoryRef.value.selectRef.hide();
	}
}
</script>
