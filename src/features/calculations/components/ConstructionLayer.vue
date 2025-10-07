<template>
	<div class="flex items-center gap-2 p-2 bg-gray-200 rounded-xl">
		<!-- Переключатель включения/выключения -->
		<div class="flex items-center gap-2.5">
			<BaseToggleSwitch v-model="enabledValue" :disabled="false" />
		</div>

		<!-- Выбор материала -->
		<div class="flex-1">
			<BaseSelect
				v-model="selectedMaterialId"
				:options="materialOptions"
				option-label="name"
				option-value="id"
				placeholder="Выберите материал"
				label="Материал"
				filter
				:disabled="!modelValue.enabled"
				:pt="{
					label: {
						class: 'whitespace-normal!',
					},
				}"
			/>
		</div>

		<!-- Поле толщины -->
		<div class="w-28" v-if="modelValue.type === MaterialType.Material">
			<BaseInputNumber
				v-model="thicknessValue"
				label="Толщина"
				placeholder="0"
				:disabled="!modelValue.enabled"
				:allowEmpty="false"
				:min="0"
				:suffix="' мм'"
			/>
		</div>

		<!-- Иконка типа материала -->
		<div class="w-6 h-6 flex items-center justify-center">
			<TypeIcon :type="modelValue.type" :types="materialTypes" short />
		</div>

		<!-- Коэффициент теплопроводности (только для чтения) -->
		<div class="w-40">
			<BaseInputNumber
				v-if="modelValue.type === MaterialType.Material"
				v-model="thermalConductivityValue"
				label="Коэф. теплопроводности"
				:disabled="true"
				:suffix="' Вт/(м*°С)'"
				:readonly="true"
			/>
			<BaseInputNumber
				v-else
				:model-value="resistanceValue"
				label="Терм. сопротивление"
				:disabled="true"
				:suffix="' (м²*°С)/Вт'"
				:readonly="true"
			/>
		</div>

		<!-- Кнопка удаления -->
		<BaseButton
			icon="trash"
			variant="text"
			severity="secondary"
			text
			@click="$emit('remove')"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import BaseSelect from "@shared/components/ui/BaseSelect.vue";
import BaseToggleSwitch from "@shared/components/ui/BaseToggleSwitch.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import TypeIcon from "@shared/components/TypeColumn.vue";
import { useTypes } from "@shared/composables/useTypes";
import type { ConstructionLayer } from "../types";
import type { MaterialItem } from "@features/directories/types/materials";
import { MaterialType } from "@features/directories/types/materials";

interface Props {
	modelValue: ConstructionLayer;
	materials: MaterialItem[];
	humidity: string;
}

interface Emits {
	(e: "update:modelValue", value: ConstructionLayer): void;
	(e: "remove"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { materialTypes } = useTypes();

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

// Вычисляемое свойство для выбранного материала
const selectedMaterialId = computed({
	get: () => props.modelValue.materialId,
	set: (value: number) => {
		const material = props.materials.find((m) => m.id === value);
		if (material) {
			emit("update:modelValue", {
				...props.modelValue,
				materialId: value,
				type: material.type,
				name: material.name,
			});
		}
	},
});

// Вычисляемое свойство для толщины
const thicknessValue = computed({
	get: () => props.modelValue.thickness || 0,
	set: (value: number) => {
		const thickness = value || undefined;
		emit("update:modelValue", {
			...props.modelValue,
			thickness,
		});
	},
});

// Опции для селекта материалов
const materialOptions = computed(() => {
	return props.materials.map((material) => ({
		value: material.id,
		label: material.name,
		id: material.id,
		name: material.name,
		category: material.category,
		type: material.type,
	}));
});

// Текущий выбранный материал
const selectedMaterial = computed(() => {
	return props.materials.find((m) => m.id === props.modelValue.materialId);
});

// Значение коэффициента теплопроводности
const thermalConductivityValue = computed(() => {
	if (!selectedMaterial.value) return 0;

	const { a = 0, b = 0 } = selectedMaterial.value;

	return props.humidity === "А" ? a : b;
});

const resistanceValue = computed(() => {
	if (!selectedMaterial.value) return 0;

	const { r = 0, type } = selectedMaterial.value;

	return type === MaterialType.Construction
		? r
		: +(
				thicknessValue.value /
				thermalConductivityValue.value /
				1000
		  ).toFixed(3);
});

// Синхронизация имени слоя при изменении материала
watch(
	selectedMaterial,
	(material) => {
		if (material && material.name !== props.modelValue.name) {
			emit("update:modelValue", {
				...props.modelValue,
				name: material.name,
			});
		}
	},
	{ immediate: true }
);

watch(
	resistanceValue,
	(value) => {
		emit("update:modelValue", {
			...props.modelValue,
			resistance: value,
		});
	},
	{ immediate: true }
);

defineExpose({
	resistanceValue,
});
</script>
