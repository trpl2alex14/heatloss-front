<template>
	<div class="flex items-center gap-2 p-2 rounded-xl bg-gray-100">
		<!-- Название конструкции (disabled) -->
		<div class="flex-1">
			<BaseInputText
				v-model="constructionName"
				label="Конструкция"
				:disabled="true"
			/>
		</div>

		<!-- Сопротивление (editable) -->
		<div class="w-36">
			<BaseInputNumber
				v-model="calculatedResistanceValue"
				label="Сопротивление"
				placeholder="0"
				:allowEmpty="false"
				:min="0"
				:minFractionDigits="2"
				:suffix="' (м²*С°)/Вт'"
			/>
		</div>

		<!-- Площадь (editable) -->
		<div class="w-32">
			<BaseInputNumber
				v-model="areaValue"
				label="Площадь"
				placeholder="0"
				:allowEmpty="false"
				:min="0"
				:minFractionDigits="1"
				:suffix="' м²'"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseInputText from "@/shared/components/ui/BaseInputText.vue";
import BaseInputNumber from "@/shared/components/ui/BaseInputNumber.vue";
import type { Construction } from "../types";

interface Props {
	modelValue: Construction;
}

interface Emits {
	(e: "update:modelValue", value: Construction): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Вычисляемое свойство для названия конструкции
const constructionName = computed(() => props.modelValue.name);

// Вычисляемое свойство для площади
const areaValue = computed({
	get: () => props.modelValue.area || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			area: value || undefined,
		});
	},
});

// Вычисляемое свойство для расчетного сопротивления
const calculatedResistanceValue = computed({
	get: () => props.modelValue.calculatedResistance || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			calculatedResistance: value || undefined,
		});
	},
});
</script>
