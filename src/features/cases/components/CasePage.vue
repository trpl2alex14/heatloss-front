<template>
	<div class="pt-6 flex flex-col gap-4 max-w-[40wv]">
		<h2 class="text-xl bg-gray-200 px-2 py-1 rounded-md">Редактирование кейса - расчёт
			№{{ entity.calculation }}</h2>
		<p v-if="errorMessage" class="text-md text-red-600">{{ errorMessage }}</p>
		<div v-if="entity" class="flex flex-row gap-2 w-full">
			<div class="w-60">
				<BaseImageUpload
					class="bg-gray-100 p-4 rounded-lg"
					:src="entity.image"
					@upload="uploadPhoto"
				/>
			</div>
			<div class="flex flex-col gap-2 w-full">
				<BaseSelectButton
					:options="product"
					v-model="entity.product"
					:invalid="isInvalidField('product')"
					:allow-empty="false"
				/>

				<BaseSelectButton
					:options="categories"
					v-model="entity.category"
					:invalid="isInvalidField('category')"
					:allow-empty="false"
				/>

				<div class="flex flex-row gap-2">
					<BaseInputText
						v-model="entity.label"
						label="Название"
						class="flex-1"
						:invalid="isInvalidField('label')"
					/>
					<BaseInputText
						v-model="entity.city"
						label="Город"
						class="flex-1"
						:invalid="isInvalidField('city')"
					/>
				</div>

				<div class="flex flex-row gap-2 justify-end">
					<BaseInputNumber
						v-model="entity.area"
						label="Площадь"
						suffix="м&sup2;"
						class="flex-1"
						:min="0"
						:minFractionDigits="1"
						:invalid="isInvalidField('area')"
					/>
					<BaseInputNumber
						v-model="entity.power"
						label="Мощность"
						suffix="кВт"
						class="flex-1"
						:min="0"
						:minFractionDigits="1"
						:invalid="isInvalidField('power')"
					/>
				</div>

				<div class="flex flex-row gap-2 justify-end">
					<BaseInputNumber
						v-model="entity.cost"
						label="Стоимость"
						suffix="₽"
						class="flex-1"
						:min="0"
						:minFractionDigits="1"
						:invalid="isInvalidField('cost')"
					/>
					<BaseInputNumber
						v-model="entity.consumption"
						label="Среднемесячные расходы"
						suffix="₽"
						class="flex-1"
						:min="0"
						:minFractionDigits="0"
						:invalid="isInvalidField('consumption')"
					/>
				</div>

				<div class="flex flex-wrap gap-2 my-4">

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
import {computed, onMounted, watch} from "vue";
import {type Case, CategoryType} from "../types/CaseTypes.ts";
import {BaseButton, BaseImageUpload, BaseInputNumber, BaseInputText, BaseSelectButton} from "@shared/components";
import {useForm} from "@shared/composables/useForm.ts";
import {useTypes} from "@shared/composables/useTypes.ts";
import {useSettings} from "@features/settings/composables/useSettings.ts";
import {useCaseData} from "@features/cases/composables/useCaseData.ts";
import type {SelectButtonOption} from "@shared/types/ui.ts";
import {useApiResource} from "@shared/composables/useApiResource.ts";

type Props = {
	id?: number;
	calculation?: number;
};

const emit = defineEmits<{
	(e: "save", entity: Case): void;
	(e: "close"): void;
}>();

const props = defineProps<Props>();

const {productCategory} = useTypes();
const {categoryTypes} = useCaseData();

const {} = useSettings();

const defCase = {
	product: 'all',
	category: CategoryType.House,
	calculation: props.calculation || 0
}

const {data, error, loadData} = useApiResource<{}, Case>({name: 'api-calculation-short'});

const {entity, errorMessage, fetchEntity, isInvalidField, save: saveEntity}
	= useForm<Case>({
	get: 'api-case',
	create: 'api-case-create',
	update: 'api-case',
}, defCase as Case)

const categories = categoryTypes.map((v) => ({
	value: v.key,
	label: v.label || v.key,
	image: v.image
})) as SelectButtonOption[];

const product = computed(() =>
	productCategory.map((v) => ({
		value: v.key,
		label: v.label || v.key,
		image: v.image
	}))
);

watch(
	() => props.id,
	(id) => {
		id && fetchEntity(id);
	}
);

onMounted(async () => {
	if (props.id) {
		void fetchEntity(props.id);
	} else {
		entity.value = defCase as Case;
		if (!props.calculation) {
			return;
		}

		await loadData(+props.calculation);
		if (error.value) {
			return;
		}

		entity.value = {...data.value.data};
	}
});

const uploadPhoto = (file: string) => {
	entity.value.image = file;
}

const save = async () => {
	const result = await saveEntity(props.id)
	if (result) {
		emit("save", result);
	}
};
</script>
