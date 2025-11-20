<template>
	<div
		class="flex flex-col gap-3 rounded-xl relative bg-gray-50 border border-gray-300"
	>
		<div class="p-4">
			<!-- Заголовок с основными полями -->
			<div class="flex items-center gap-3.5">
				<!-- Выбор типа поверхности -->
				<div class="w-110">
					<BaseSelect
						v-model="selectedSurface"
						:options="surfaceOptions"
						option-label="label"
						option-value="value"
						placeholder="Выберите тип поверхности"
						label="Тип поверхности"
						filter
					/>
				</div>

				<!-- Поле площади -->
				<div class="w-40" v-if="showArea">
					<BaseInputNumber
						v-model="areaValue"
						label="Площадь поверхности"
						placeholder="0"
						:allowEmpty="false"
						:min="0"
						:minFractionDigits="1"
						:suffix="' м²'"
					/>
				</div>

				<!-- Переключатель показа площади -->
				<div class="flex items-center gap-2.5">
					<BaseToggleSwitch
						v-model="showArea"
						label="Указать площадь"
					/>
				</div>
			</div>

			<div v-if="selectedSurface">
				<div class="flex gap-4 items-center mt-6 mb-2">
					<!-- Заголовок секции слоев -->
					<h3 class="text-lg">Слои ограждающей конструкции</h3>
					<!-- Кнопка добавления слоя -->
					<BaseButton
						icon="bars"
						label="Добавить слой"
						text
						severity="primary"
						@click="addLayer"
						class="self-start"
					/>
				</div>

				<!-- Список слоев -->
				<div class="flex flex-col gap-2">
					<ConstructionLayer
						v-for="({}, index) in modelValue.layers"
						:key="index"
						v-model="modelValue.layers[index]"
						:materials="filteredMaterials"
						:humidity="climate.humidity || 'А'"
						@remove="removeLayer(index)"
					/>

					<EmptyBox
						v-if="modelValue.layers.length === 0"
						label="слои отсутствуют"
					/>


				</div>
			</div>

			<!-- Кнопки действий -->
			<div class="absolute top-0 right-0 flex gap-1">
				<BaseButton
					icon="copy"
					text
					severity="secondary"
					@click="$emit('duplicate')"
				/>
				<BaseButton
					icon="trash"
					text
					severity="secondary"
					@click="$emit('remove')"
				/>
			</div>
		</div>

		<!-- Результаты расчета -->
		<div
			class="flex justify-end items-center gap-3.5 p-4 bg-gray-200 rounded-xl"
		>
			<!-- Разделитель -->
			<div class="flex-1"></div>

			<!-- Нормативное сопротивление -->
			<div class="w-50">
				<BaseInputText
					v-model="snipResistanceText"
					label="Нормативное сопротивление"
					:disabled="true"
					:readonly="true"
				/>
			</div>

			<!-- Расчетное сопротивление -->
			<div class="w-50">
				<BaseInputText
					v-model="calculatedResistanceText"
					label="Расчетное сопротивление"
					:disabled="true"
					:readonly="true"
					:style="getStyleResistance()"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseSelect from "@shared/components/ui/BaseSelect.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseToggleSwitch from "@shared/components/ui/BaseToggleSwitch.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import EmptyBox from "@shared/components/EmptyBox.vue";
import ConstructionLayer from "./ConstructionLayer.vue";
import type {
	Construction,
	ConstructionLayer as ConstructionLayerType,
} from "../types";
import type {
	MaterialItem,
	Surface,
} from "@features/directories/types/materials";
import type { ClimateItem } from "@features/directories/types/climate";
import { useCalculator } from "../composables/useCalculator";

interface Props {
	modelValue: Construction;
	materials: MaterialItem[];
	climate: ClimateItem;
	surfaces: Surface[];
}

interface Emits {
	(e: "update:modelValue", value: Construction): void;
	(e: "remove"): void;
	(e: "duplicate"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Состояние показа площади
const showArea = ref(!!props.modelValue.area);

// Вычисляемое свойство для выбранной поверхности
const selectedSurface = computed({
	get: () => props.modelValue.surface?.id || 0,
	set: (value: number) => {
		const selectedSurfaceData = getSurface(value);
		const materials = getFilteredMaterials(value);

		const exsistingLayers =
			props.modelValue?.layers?.filter((layer) =>
				materials.find((m) => m.id === layer.materialId)
			) || [];

		emit("update:modelValue", {
			...props.modelValue,
			name: selectedSurfaceData?.name || "",
			surface: selectedSurfaceData,
			snipResistance: getSnipResistance(
				selectedSurfaceData?.type || "other"
			),
			layers: [...exsistingLayers],
		});
	},
});

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

// Преобразуем Surface в формат для BaseSelect
const surfaceOptions = computed(() =>
	props.surfaces.map((surface) => ({
		value: surface.id,
		label: surface.name,
	}))
);

// Отфильтрованные материалы по выбранному типу поверхности
const filteredMaterials = computed(() => {
	return getFilteredMaterials(selectedSurface.value);
});

const selectedSurfaceData = computed(() => {
	return getSurface(selectedSurface.value);
});

const getSurface = (id: number) => {
	return props.surfaces.find((surface) => surface.id === id);
};

const getFilteredMaterials = (surfaceId: number) => {
	if (!surfaceId || surfaceOptions.value.length === 0) {
		return props.materials;
	}

	const surfaceType = getSurface(surfaceId)?.type || "other";

	return props.materials.filter((m) => m.surface.includes(surfaceType));
};

// Нормативное сопротивление на основе типа поверхности
const { getSnipResistance } = useCalculator();

const snipResistance = computed(() => {
	const surfaceType = getSurface(selectedSurface.value)?.type || "other";

	return getSnipResistance(surfaceType);
});

const snipResistanceText = computed(() => {
	return `${snipResistance.value} (м²*С°)/Вт`;
});

// Расчетное сопротивление как сумма resistance всех слоев
const calculatedResistance = computed(() => {
	const baseResistance =
		selectedSurfaceData.value?.baseResistance ||
		props.modelValue.surface?.baseResistance ||
		0;
	const multiplier =
		selectedSurfaceData.value?.multiplier ||
		props.modelValue.surface?.multiplier ||
		1;

	return (
		+props.modelValue.layers
			.filter((layer) => layer.enabled)
			.reduce(
				(sum, layer) => sum + (layer.resistance || 0),
				baseResistance
			)
			.toFixed(3) * multiplier
	);
});

const calculatedResistanceText = computed(() => {
	return `${calculatedResistance.value.toFixed(3)} (м²*С°)/Вт`;
});

// Методы для работы со слоями
const addLayer = () => {
	const newLayer: ConstructionLayerType = {
		enabled: true,
		name: "",
		materialId: 0,
		type: 1,
	};

	emit("update:modelValue", {
		...props.modelValue,
		layers: [...props.modelValue.layers, newLayer],
	});
};

const removeLayer = (index: number) => {
	const newLayers = [...props.modelValue.layers];
	newLayers.splice(index, 1);

	emit("update:modelValue", {
		...props.modelValue,
		layers: newLayers,
	});
};

// Синхронизация площади при изменении showArea
const syncArea = () => {
	if (!showArea.value && props.modelValue.area) {
		emit("update:modelValue", {
			...props.modelValue,
			area: undefined,
		});
	}
};

// Наблюдение за изменением showArea
watch(showArea, syncArea);

// Синхронизация surface при изменении props.modelValue.surface
watch(
	() => props.modelValue.surface,
	(newSurface) => {
		if (newSurface && newSurface.id !== selectedSurface.value) {
			selectedSurface.value = newSurface.id;
		}
	},
	{ immediate: true }
);

// Автоматическое обновление calculatedResistance при изменении слоев
watch(calculatedResistance, (newValue) => {
	emit("update:modelValue", {
		...props.modelValue,
		calculatedResistance: newValue,
	});
});

// Автоматическое обновление snipResistance при изменении выбранной поверхности
watch(snipResistance, (newValue) => {
	emit("update:modelValue", {
		...props.modelValue,
		snipResistance: newValue,
	});
});

watch(
	selectedSurface,
	(newSurface, oldSurface) => {
		if (newSurface !== oldSurface) {
			const selectedSurfaceData = getSurface(newSurface);
			emit("update:modelValue", {
				...props.modelValue,
				snipResistance: getSnipResistance(
					selectedSurfaceData?.type || "other"
				),
			});
		}
	},
	{ immediate: true }
);

// Функция для стилизации поля расчетного сопротивления
const getStyleResistance = () => {
	return {
		"--p-inputtext-border-color":
			snipResistance.value - calculatedResistance.value < 0.3
				? calculatedResistance.value - snipResistance.value < 0.3
					? "var(--p-surface-300)"
					: "var(--color-green-500)"
				: "var(--color-red-500)",
	};
};
</script>
