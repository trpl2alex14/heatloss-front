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
		<div v-if="calculateMethod === 'detailed'" class="flex flex-col gap-4">
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

			<EmptyBox
				v-if="modelValue.constructions.length === 0"
				label="конструкции отсутствуют"
			/>

			<!-- Кнопка добавления конструкции -->
			<BaseButton
				icon="hammer"
				label="Добавить поверхность"
				severity="primary"
				@click="addConstruction"
				class="self-end"
			/>
		</div>

		<!-- Список конструкций для SNIP режима -->
		<div v-if="calculateMethod === 'snip'" class="flex flex-col gap-4">
			<ConstructionSnip
				v-for="({}, index) in modelValue.constructions"
				:key="index"
				v-model="modelValue.constructions[index]"
				@remove="removeConstruction(index)"
			/>
		</div>

		<div v-if="calculateMethod === 'simple'" class="flex flex-col gap-4">
			<BaseInputNumber
				class="w-45"
				v-model="modelValue.baseHeatLoss"
				label="Теплопотери"
				placeholder="0"
				:allowEmpty="false"
				:min="0"
				:suffix="' кВт*ч'"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseInputNumber from "@/shared/components/ui/BaseInputNumber.vue";
import EmptyBox from "@/shared/components/EmptyBox.vue";
import Construction from "./Construction.vue";
import ConstructionSnip from "./ConstructionSnip.vue";
import { useMaterialData } from "@/features/directories/composables/useMaterialData";
import { useSurfaceData } from "@/features/directories/composables/useSurfaceData";
import type {
	CalculationDetails,
	Construction as ConstructionType,
} from "../types/calculation";

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

// Загрузка поверхностей
const { surfaces, loadSurfaceData } = useSurfaceData();

// Опции для метода расчета
const calculateMethodOptions = [
	{ label: "Детальный расчёт", value: "detailed" },
	{ label: "Считать упрощенно", value: "snip" },
	{ label: "Указать теплопотери", value: "simple" },
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
let constructionId = 0;

const addConstruction = () => {
	const newConstruction: ConstructionType = {
		id: constructionId++,
		name: "",
		layers: [
			{
				enabled: true,
				name: "",
				materialId: 0,
				type: 1,
			},
		],
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

// Загрузка данных при монтировании компонента
onMounted(() => {
	loadMaterialData();
	loadSurfaceData();
});

const oldConstructions = ref();

watch(
	() => calculateMethod.value,
	(value, oldValue) => {
		if (value === null) {
			calculateMethod.value = "detailed";
		}

		if (
			oldValue === "detailed" &&
			props.modelValue.constructions.length > 0
		) {
			oldConstructions.value = props.modelValue.constructions;
		}

		if (value === "snip") {
			props.modelValue.constructions = [
				{
					id: 1,
					layers: [],
					name: "Стены",
					snipResistance: props.modelValue.climate.wallNorm,
					calculatedResistance: props.modelValue.climate.wallNorm,
					area: 0,
					surface: {
						name: "Стены",
						type: "wall",
					},
				},
				{
					id: 2,
					layers: [],
					name: "Кровля",
					snipResistance: props.modelValue.climate.roofNorm,
					calculatedResistance: props.modelValue.climate.roofNorm,
					area: 0,
					surface: {
						name: "Кровля",
						type: "roof",
					},
				},
				{
					id: 3,
					layers: [],
					name: "Пол",
					snipResistance: props.modelValue.climate.floorNorm,
					calculatedResistance: props.modelValue.climate.floorNorm,
					area: 0,
					surface: {
						name: "Пол",
						type: "floor",
					},
				},
			];
		} else {
			props.modelValue.constructions = oldConstructions.value || [];
		}
	}
);
</script>
