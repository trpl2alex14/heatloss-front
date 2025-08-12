<template>
	<div class="flex flex-col gap-3.5">
		<!-- Заголовок секции -->
		<div class="flex flex-col gap-1.5">
			<h3 class="text-xl font-normal text-gray-900">
				Ограждающие конструкции
			</h3>
			<p class="text-sm font-normal text-gray-600">
				Добавьте все ограждающие конструкции, которые есть на объекте и
				укажите их площади, для расчёта теплопотерь через них.
			</p>
		</div>

		<!-- Переключатель метода расчета -->
		<div class="flex">
			<BaseSelectButton
				v-model="calculateMethod"
				:options="calculateMethodOptions"
				option-label="label"
				option-value="value"
			/>
		</div>

		<!-- Список конструкций -->
		<div 
			v-if="calculateMethod === 'detailed'"
			class="flex flex-col gap-4" 
		>
			<Construction
				v-for="({}, index) in modelValue.constructions"
				:key="index"
				v-model="modelValue.constructions[index]"
				:materials="materialData"
				:climate="modelValue.climate"
				:surfaces="surfaces"
				@remove="removeConstruction(index)"
				@duplicate="duplicateConstruction(index)"
			/>

			<!-- Кнопка добавления конструкции -->
			<BaseButton
				icon="plus"
				label="Добавить поверхность"
				severity="primary"				
				@click="addConstruction"
				class="self-end"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import Construction from "./Construction.vue";
import { useMaterialData } from "@/features/directories/composables/useMaterialData";
import type {
	CalculationDetails,
	Construction as ConstructionType,
} from "../types/calculation";
import type { Surface } from "@/features/directories/types/materials";

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Загрузка материалов
const { materialData, loadMaterialData } = useMaterialData();

// Демо данные для поверхностей
const surfaces: Surface[] = [
	{ name: "Стена наружная", type: "wall" },
	{ name: "Крыша утепленная наклонная", type: "roof" },
	{ name: "Пол по грунту", type: "floor" },
	{ name: "Окно", type: "window" },
	{ name: "стены", type: "wall" },
];

// Опции для метода расчета
const calculateMethodOptions = [
	{ label: "Детальный расчёт", value: "detailed" },
	{ label: "Считать упрощенно", value: "simple" },
	{ label: "Указать теплопотери", value: "snip" },
];

// Вычисляемое свойство для метода расчета
const calculateMethod = computed({
	get: () => props.modelValue.calculateMethod,
	set: (value: "detailed" | "simple" | "snip") => {
		emit("update:modelValue", {
			...props.modelValue,
			calculateMethod: value,
		});
	},
});

// Методы для работы с конструкциями
const addConstruction = () => {
	const newConstruction: ConstructionType = {
		name: "",
		layers: [{
			enabled: true,
			name: "",
			materialId: 0,
			type: 1,
		}],
		snipResistance: 0,
	};

	emit("update:modelValue", {
		...props.modelValue,
		constructions: [...props.modelValue.constructions, newConstruction],
	});
};

const removeConstruction = (index: number) => {
	const newConstructions = [...props.modelValue.constructions];
	newConstructions.splice(index, 1);

	emit("update:modelValue", {
		...props.modelValue,
		constructions: newConstructions,
	});
};

const duplicateConstruction = (index: number) => {
	const constructionToDuplicate = props.modelValue.constructions[index];
	const duplicatedConstruction: ConstructionType = {
		...constructionToDuplicate,
		name: `${constructionToDuplicate.name} (копия)`,
	};

	emit("update:modelValue", {
		...props.modelValue,
		constructions: [
			...props.modelValue.constructions,
			duplicatedConstruction,
		],
	});
};

// Загрузка материалов при монтировании компонента
onMounted(() => {
	loadMaterialData();
});
</script>
