<template>
	<div class="space-y-4">
		<!-- Заголовок секции -->
		<div>
			<h3 class="text-xl font-normal text-gray-900">Климат</h3>
			<p class="text-sm text-gray-600 mt-1">
				Укажите населенный пункт или укажите температуру
			</p>
		</div>

		<!-- Регион размещения объекта -->
		<div>
			<BaseSelect
				v-model="localModel.city"
				:options="citiesOptions"
				optionLabel="label"
				optionValue="value"
				label="Регион размещения объекта"
				placeholder="Выберите регион"
				class="w-84"
				filter
				:loading="isLoadingClimate"
				autoFilterFocus
				@update:modelValue="onCityChange"
			/>
		</div>

		<!-- Тип проживания -->
		<div>
			<p class="text-sm font-medium text-gray-900 mb-2">
				Режим эксплуатации
			</p>
			<BaseSelectButton
				v-model="localModel.useSeason"
				:options="seasonOptiopns"
				optionLabel="label"
				optionValue="value"
				class="w-auto"
				@change="onCityChange(localModel.city)"
			/>
		</div>

		<!-- Температуры -->
		<div class="flex items-center gap-4">
			<!-- Холодная 5ти дневка -->
			<div>
				<BaseInputNumber
					v-model="climateProxy.minTemp"
					label="Холодная 5ти дневка"
					placeholder="-"
					:disabled="!isEditingClimate"
					:allowEmpty="false"
					class="w-36"
					:minFractionDigits="1"
					suffix=" °C"
					:min="-50"
					:max="50"
				/>
			</div>

			<!-- Средняя в сезон -->
			<div>
				<BaseInputNumber
					v-model="climateProxy.avgTemp"
					label="Средняя в сезон"
					placeholder="-"
					:disabled="!isEditingClimate"
					:allowEmpty="false"
					class="w-36"
					:minFractionDigits="1"
					suffix=" °C"
					:min="-50"
					:max="50"
				/>
			</div>

			<!-- Защита от промерзания -->
			<div>
				<BaseInputNumber
					v-model="localModel.freezeTemp"
					label="Защита от промерзания"
					placeholder="-"
					:disabled="!isEditingClimate"
					:allowEmpty="false"
					class="w-40"
					suffix=" °C"
					:min="0"
					:max="50"
				/>
			</div>

			<!-- Комфортная -->
			<div>
				<BaseInputNumber
					v-if="localModel.useSeason !== 'freeze'"
					v-model="localModel.requiredTemp"
					label="Комфортная"
					placeholder="-"
					:disabled="!isEditingClimate"
					:allowEmpty="false"
					class="w-36"
					suffix=" °C"
					:min="0"
					:max="50"
				/>
			</div>

			<!-- Переключатель редактирования -->
			<div class="flex items-center gap-2">
				<BaseToggleSwitch
					v-model="isEditingClimate"
					label="Редактировать"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
	BaseSelect,
	BaseSelectButton,
	BaseInputNumber,
	BaseToggleSwitch,
} from "@/shared/components";
import type {
	CalculationDetails,
	UseSeason,
} from "@/features/calculations/types/calculation";
import type { SelectButtonOption } from "@/shared/types/ui";
import { useClimateData } from "@/features/directories/composables/useClimateData";
import type { ClimateItem } from "@/features/directories/types/climate";
import { useSettings } from "@/features/settings/composables/useSettings";

interface Props {
	modelValue: CalculationDetails;
}

const props = defineProps<Props>();

const isEditingClimate = ref(false);

const { comfortTemp, freezeTemp } = useSettings();

const emit = defineEmits<{
	"update:modelValue": [value: CalculationDetails];
}>();

// Опции для типа климата
const seasonOptiopns: (SelectButtonOption & { value: UseSeason })[] = [
	{ label: "Постоянное проживание", value: "permanent" },
	{ label: "Весна / Осень", value: "seasonal" },
	{ label: "Защита от промерзания", value: "freeze" },
];

// Опции для выбора региона
const { climateData, isLoading: isLoadingClimate } = useClimateData(true);

const citiesOptions = computed(() => {
	return climateData.value.map((item: ClimateItem) => ({
		label: item.city,
		value: item.city,
	}));
});

const getRequiredTemp = (useSeason?: UseSeason) => {
	return useSeason === "freeze" ? freezeTemp : comfortTemp;
};

const getCurrentClimate = (city: string, useSeason?: UseSeason) => {
	const item = climateData.value.find((item: ClimateItem) => item.city === city);
	return useSeason === "seasonal" ? {
		...item,
		minTemp: item.avgTemp || 0,
		avgTemp: (props.modelValue.requiredTemp + item.avgTemp) / 2 || 0,
	} : item;
};

const localModel = computed({
	get: () => props.modelValue,
	set: (val) => {
		emit("update:modelValue", val);
	},
});

watch( () => props.modelValue, (val) => {
	if(!val.useSeason) {
		val.useSeason = "permanent";
	}
	if(val.freezeTemp === undefined || val.freezeTemp === null) {
		val.freezeTemp = freezeTemp;
	}
	if(val.requiredTemp === undefined || val.requiredTemp === null) {
		val.requiredTemp = getRequiredTemp(val.useSeason);
	}
	if(val.climate === undefined || val.climate === null) {
		val.climate = getCurrentClimate(val.city, val.useSeason);
	}

}, { immediate: true });

watch(climateData, () => {
	onCityChange(localModel.value.city);
}, { deep: true });

watch(isEditingClimate, (value) => {
	if (!value) {
		onCityChange(localModel.value.city);
	}
});

// Прокси для температур
const climateProxy = computed({
	get: () =>
		localModel.value.climate ||
		getCurrentClimate(localModel.value.city, localModel.value.useSeason) ||
		{},
	set: (val) => {
		localModel.value = {
			...localModel.value,
			climate: val,
		};
	},
});

const onCityChange = (value: string) => {
	isEditingClimate.value = false;
	localModel.value = {
		...localModel.value,
		city: value,
		requiredTemp: getRequiredTemp(localModel.value?.useSeason),
		freezeTemp: freezeTemp,
		climate: getCurrentClimate(value, localModel.value.useSeason) || {},
	};
};
</script>
