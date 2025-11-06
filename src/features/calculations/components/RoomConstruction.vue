<template>
	<div class="flex items-center gap-2 p-2 bg-gray-200 rounded-xl">
		<!-- Переключатель включения/выключения -->
		<div class="flex items-center gap-2.5">
			<BaseToggleSwitch v-model="enabledValue" :disabled="isAutoMode" />
		</div>

		<!-- Название конструкции (только для чтения) -->
		<div class="flex-1">
			<BaseInputText
				:model-value="(construction?.id || '') + ' ' + (construction?.name || '')"
				label="Конструкция"
				:disabled="true"
				:readonly="true"
			/>
		</div>

		<!-- Поле количества (только для окон) -->
		<div class="w-24" v-if="isWindowType">
			<BaseInputNumber
				v-model="countValue"
				label="Количество"
				placeholder="0"
				:disabled="!modelValue.enabled"
				:allowEmpty="false"
				:min="0"
			/>
		</div>

		<!-- Поле площади -->
		<div class="w-26">
			<BaseInputNumber
				v-model="areaValue"
				label="Площадь"
				placeholder="0"
				:disabled="
					!modelValue.enabled || (isAutoMode && !modelValue.unlocked)
				"
				:allowEmpty="false"
				:minFractionDigits="1"
				:min="0"
				:suffix="' м²'"
			/>
		</div>

		<!-- Теплопотери (только для чтения) -->
		<div class="w-36">
			<BaseInputNumber
				:model-value="calculatedHeatLoss"
				:label="`Теплопотери в ${minTemp}°C`"
				:disabled="true"
				:suffix="' Вт'"
				:readonly="true"
			/>
		</div>

		<!-- Кнопка удаления -->
		<BaseButton
			v-if="!isAutoMode"
			icon="trash"
			variant="text"
			severity="secondary"
			text
			@click="$emit('remove')"
		/>

		<BaseButton
			v-if="isAutoMode"
			:icon="!modelValue.unlocked ? 'lock' : 'unlock'"
			variant="text"
			severity="secondary"
			text
			@click="toggleUnlock"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import {
	BaseToggleSwitch,
	BaseInputNumber,
	BaseInputText,
	BaseButton,
} from "@shared/components";
import type { RoomConstruction, Construction } from "../types";
import { useCalculator } from "../composables/useCalculator";
import {useSettings} from "@features/settings/composables/useSettings.ts";

interface Props {
	modelValue: RoomConstruction;
	construction?: Construction;
	minTemp: number;
	requiredTemp: number;
	isAutoMode?: boolean;
}

interface Emits {
	(e: "update:modelValue", value: RoomConstruction): void;
	(e: "remove"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { windowMultiplayer } = useSettings();

// Проверяем, является ли конструкция окном
const isWindowType = computed(() => {
	return props.construction?.surface?.type === "window";
});

// Вычисляемое свойство для enabled состояния
const enabledValue = computed({
	get: () => props.modelValue.enabled,
	set: (value: boolean) => {
		emit("update:modelValue", {
			...props.modelValue,
			enabled: value,
		});
	},
});

// Вычисляемое свойство для площади
const areaValue = computed({
	get: () => props.modelValue.area,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			area: value,
		});
	},
});

// Вычисляемое свойство для количества
const countValue = computed({
	get: () => props.modelValue.count || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			count: value,
		});
	},
});

const { calculatedHeatLoss: getHeatLoss, computedTempDiff: tempDiff } = useCalculator();
// Рассчитываем теплопотери
const calculatedHeatLoss = computed(() => {
	if (
		!props.modelValue.enabled ||
		!props.construction?.calculatedResistance
	) {
		return 0;
	}

	const area = props.modelValue.area;
	const resistance = props.construction.calculatedResistance;
	const heatLoss = getHeatLoss(area, resistance, tempDiff.value);

	return heatLoss + (heatLoss * (props.modelValue.count || 0) * windowMultiplayer); //+% на каждое окно
});

// Синхронизируем теплопотери при изменении параметров
watch(
	[
		calculatedHeatLoss,
		() => props.modelValue.enabled,
		() => props.modelValue.heatLoss,
	],
	([heatLoss, enabled, value], [oldHeatLoss, oldEnabled, oldValue]) => {
		if (
			(oldHeatLoss === heatLoss &&
				oldEnabled === enabled &&
				oldValue === value) ||
			!enabled
		)
			return;

		emit("update:modelValue", {
			...props.modelValue,
			heatLoss: heatLoss,
		});
	},
	{ immediate: true, deep: true }
);

const toggleUnlock = () => {
	emit("update:modelValue", {
		...props.modelValue,
		unlocked: !props.modelValue.unlocked,
	});
};
</script>
