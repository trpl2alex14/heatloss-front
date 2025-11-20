<template>
	<div
		v-if="!isLoadingMaterial && !isLoadingSurface"
		class="flex flex-col gap-3.5 bg-neutral-800 rounded-xl p-4 -mx-4"
	>
		<!-- Заголовок секции -->
		<div class="flex flex-col gap-1.5">
			<h3 class="text-2xl font-normal text-white">Ограждающие конструкции</h3>
			<p class="text-md font-normal text-gray-400">
				Добавьте все ограждающие конструкции, которые есть на объекте и укажите их площади,<br> для расчёта
				теплопотерь через них.
			</p>
		</div>

		<!-- Переключатель метода расчета -->
		<div class="flex mb-4">
			<BaseSelectButton
				class="shadow-md shadow-gray-950"
				v-model="calculateMethod"
				:options="calculateMethodOptions"
				option-label="label"
				option-value="value"
				:allow-empty="false"
			/>
		</div>

		<!-- Список конструкций -->
		<div v-if="calculateMethod === 'detailed' && modelValue.climate" class="flex flex-col gap-6">
			<Construction
				class="shadow-md shadow-gray-950"
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
				class="min-h-20 bg-gray-800 text-gray-50"
			/>

			<!-- Кнопка добавления конструкции -->
			<BaseButton
				icon="hammer"
				label="Добавить поверхность"
				severity="primary"
				@click="newConstruction"
				class="self-start shadow-md shadow-gray-950"
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

		<div v-if="calculateMethod === 'simple'" class="flex gap-4">
			<BaseInputNumber
				class="w-45"
				v-model="modelValue.baseHeatLoss"
				label="Теплопотери"
				placeholder="0"
				:allowEmpty="false"
				:min="0"
				:suffix="' кВт*ч'"
			/>
			<BaseInputNumber
				class="w-45"
				v-model="area"
				label="Площадь объекта"
				placeholder="0"
				:allowEmpty="false"
				:min="1"
				:suffix="' м²'"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import EmptyBox from "@shared/components/EmptyBox.vue";
import Construction from "./Construction.vue";
import ConstructionSnip from "./ConstructionSnip.vue";
import { useMaterialData } from "@features/directories/composables/useMaterialData";
import { useSurfaceData } from "@features/directories/composables/useSurfaceData";
import type { CalculationDetails, Construction as ConstructionType, ConstructionLayer } from "../types";
import type { Construction as ConstructionFromRequest } from "@features/requests/types/request";
import type { MaterialItem, Surface } from "@features/directories/types/materials";
import { useCalculator } from "../composables/useCalculator";
import { useMessage } from "@shared/composables/useMessage";

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const area = ref(1);
const oldConstructions = ref();

const { warning } = useMessage();
// Загрузка материалов
const { materialData, loadMaterialData, isLoading: isLoadingMaterial } = useMaterialData();

// Загрузка поверхностей
const { surfaces, loadSurfaceData, isLoading: isLoadingSurface } = useSurfaceData();

const { computedTempDiff, getSnipResistance } = useCalculator();
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
			constructions: makeConstructionsForMethod(value),
		});
	},
});

// Методы для работы с конструкциями
let constructionId =
	props.modelValue.constructions.reduce((max, construction) => Math.max(max, construction.id), 0) + 1;

const newConstruction = () => {
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
		id: constructionId++,
		name: `${constructionToDuplicate.name} (копия)`,
	};

	emit("update:modelValue", {
		...props.modelValue,
		constructions: [...props.modelValue.constructions, duplicatedConstruction],
	});
};

// Загрузка данных при монтировании компонента
onMounted(() => {
	loadMaterialData();
	loadSurfaceData();
});

const makeConstructionsForMethod = (method: "detailed" | "snip" | "simple") => {
	let constructions = [];

	if (method === "snip") {
		constructions = [
			{
				id: 1,
				layers: [],
				name: "Стены",
				snipResistance: getSnipResistance("wall"),
				calculatedResistance: getSnipResistance("wall"),
				area: 0,
				surface: {
					id: 1,
					name: "Стены",
					type: "wall",
				},
			},
			{
				id: 2,
				layers: [],
				name: "Кровля",
				snipResistance: getSnipResistance("roof"),
				calculatedResistance: getSnipResistance("roof"),
				area: 0,
				surface: {
					id: 2,
					name: "Кровля",
					type: "roof",
				},
			},
			{
				id: 3,
				layers: [],
				name: "Пол",
				snipResistance: getSnipResistance("floor"),
				calculatedResistance: getSnipResistance("floor"),
				area: 0,
				surface: {
					id: 3,
					name: "Пол",
					type: "floor",
				},
			},
		];
	} else if (method == "simple") {
		constructions = [
			{
				id: 0,
				layers: [],
				name: "Ограждающие конструкции",
				snipResistance: 0,
				calculatedResistance: 0,
				area: 0,
				surface: {
					id: 0,
					name: "Ограждающие конструкции",
					type: "wall",
				},
				heatLoss: props.modelValue.baseHeatLoss,
			},
		];
	} else if (oldConstructions.value) {
		constructions = oldConstructions.value;
	}

	return constructions;
};

watch(
	() => calculateMethod.value,
	(value, oldValue) => {
		if (value === null) {
			calculateMethod.value = "detailed";
		}

		if (oldValue === "detailed" && props.modelValue.constructions.length > 0) {
			oldConstructions.value = props.modelValue.constructions;
		}
	}
);

watch(
	[() => props.modelValue.baseHeatLoss, () => area.value, () => computedTempDiff.value],
	([baseHeatLoss = 0, volume = 1, tempDiff = 0]) => {
		if (calculateMethod.value !== "simple") {
			return;
		}

		if (props.modelValue.constructions.length > 0 && baseHeatLoss > 0) {
			props.modelValue.constructions[0].heatLoss = baseHeatLoss;
			props.modelValue.constructions[0].area = volume;
			props.modelValue.constructions[0].calculatedResistance = (volume * tempDiff) / baseHeatLoss;
		}
	}
);

const addConstructions = (constructions: ConstructionFromRequest[]) => {
	let id = 0;
	const newConstructions: ConstructionType[] = constructions.map((construction) => {
		let surface = surfaces.value.find((item: Surface) => item.id === construction.surfaceId);
		if(!surface) {
			surface = surfaces.value.find((item: Surface) => item.name === construction.label);
		}

		if(!surface) {
			warning("Отсутствует поверхность: " + construction.label, 20000);
		}

		return {
			id: ++id,
			name: surface?.name || construction.label,
			surface: surface,
			area: construction.area,
			layers: construction.materials.map((material) => {
				const layer = materialData.value.find((m: MaterialItem) => m.id === material.id);
				if(!layer) {
					warning("Материал отсутствует: " + material.name, 20000);
					return null;
				}
				return {
					enabled: true,
					name: layer.name,
					materialId: layer.id,
					thickness: material.width,
					type: layer.type,
				};
			}).filter((v)=>v) as ConstructionLayer[],
			snipResistance: getSnipResistance(surface?.type || "other"),
		};
	});

	emit("update:modelValue", {
		...props.modelValue,
		constructions: [...newConstructions],
	});
};

defineExpose({
	addConstructions,
});
</script>
