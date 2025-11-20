<template>
	<div class="flex items-center gap-2 p-2 bg-gray-200 rounded-xl">
		<!-- Номер позиции -->
		<div
			class="flex items-center justify-center w-6 h-6 text-sm font-normal text-black"
		>
			<img
				:src="HeaterIcon"
				alt="Оборудование"
				class="w-5 h-5 opacity-40"
			/>
		</div>

		<!-- Наименование оборудования -->
		<div class="flex-1">
			<BaseInputText
				:value="index + 1 + '. ' + nameValue"
				label="Наименование"
				placeholder="Введите наименование"
				class="w-full"
				disabled
			/>
		</div>

		<!-- Количество -->
		<div class="w-24">
			<BaseInputNumber
				v-model="quantityValue"
				label="Количество"
				placeholder="0"
				:min="1"
				:suffix="' шт.'"
				class="w-full"
				:disabled="disabled"
			/>
		</div>

		<!-- Разделитель -->
		<div
			class="flex items-center justify-center w-2 h-6 text-sm font-normal text-black"
		>
			х
		</div>

		<!-- Стоимость за единицу -->
		<div class="w-30">
			<BaseInputNumber
				v-model="priceValue"
				label="Стоимость"
				placeholder="0"
				:min="0"
				:minFractionDigits="2"
				:disabled="true"
				:readonly="true"
				:suffix="' ₽'"
				class="w-full"
			/>
		</div>

		<!-- Разделитель -->
		<div
			class="flex items-center justify-center w-2 h-6 text-sm font-normal text-black"
		>
			=
		</div>

		<!-- Общая сумма (только для чтения) -->
		<div class="w-34">
			<BaseInputNumber
				:model-value="totalCost"
				label="Сумма"
				:disabled="true"
				:suffix="' ₽'"
				:minFractionDigits="2"
				:readonly="true"
				class="w-full"
			/>
		</div>

		<!-- Кнопка удаления -->
		<BaseButton
			icon="trash"
			variant="text"
			severity="secondary"
			text
			:disabled="disabled"
			@click="$emit('remove')"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import type { Equipment } from "../types";
import HeaterIcon from "@assets/icons/heater.svg";

interface Props {
	modelValue: Equipment;
	index: number;
	disabled?: boolean;
}

interface Emits {
	(e: "update:modelValue", value: Equipment): void;
	(e: "remove"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Вычисляемое свойство для наименования
const nameValue = computed({
	get: () => props.modelValue.name,
	set: (value: string) => {
		emit("update:modelValue", {
			...props.modelValue,
			name: value,
		});
	},
});

// Вычисляемое свойство для количества
const quantityValue = computed({
	get: () => props.modelValue.quantity,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			quantity: value,
		});
	},
});

// Вычисляемое свойство для цены
const priceValue = computed({
	get: () => props.modelValue.price,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			price: value,
		});
	},
});

// Вычисляемое свойство для общей стоимости
const totalCost = computed(() => {
	return props.modelValue.quantity * props.modelValue.price;
});
</script>
