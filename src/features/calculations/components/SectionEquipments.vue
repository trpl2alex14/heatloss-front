<template>
	<div class="flex flex-col gap-3.5">
		<!-- Заголовок секции -->
		<div class="flex flex-col gap-1.5">
			<h3 class="text-xl font-normal text-gray-900">
				Дополнительное оборудование
			</h3>
			<p class="text-sm font-normal text-gray-600">
				Перечень дополнительного оборудования для отопления помещений
			</p>
		</div>

		<!-- Список оборудования -->
		<div class="flex flex-col gap-4" v-if="equipmentList">
			<RoomEquipment
				v-for="(equipment, index) in equipmentList"
				:key="equipment.id"
				v-model="equipmentList[index]"
				:index="index"
				@remove="removeEquipment(index)"
			/>

			<EmptyBox
				v-if="equipmentList.length === 0"
				label="оборудование отсутствует"
			/>

			<!-- Кнопка добавления оборудования -->
			<BaseButton
				icon="plus"
				label="Добавить оборудование"
				severity="primary"
				@click="addEquipment"
				class="self-end"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RoomEquipment from "./RoomEquipment.vue";
import EmptyBox from "@/shared/components/EmptyBox.vue";
import type { CalculationDetails, Equipment } from "../types";

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Вычисляемое свойство для списка оборудования
const equipmentList = computed({
	get: () => {
		return props.modelValue.equipment;
	},
	set: (value: Equipment[]) => {
		emit("update:modelValue", {
			...props.modelValue,
			equipment: value,
		});
	},
});

// Методы для работы с оборудованием
const getNextEquipmentId = (): number => {
	if (!props.modelValue.equipment?.length) return 1;
	return (
		Math.max(
			...props.modelValue.equipment.map((equipment) => equipment.id)
		) + 1
	);
};

const addEquipment = () => {
	const newEquipment: Equipment = {
		id: getNextEquipmentId(),
		name: "",
		quantity: 1,
		price: 0,
		power: 0,
	};

	emit("update:modelValue", {
		...props.modelValue,
		equipment: [...(props.modelValue.equipment || []), newEquipment],
	});
};

const removeEquipment = (index: number) => {
	const newEquipment = [...(props.modelValue.equipment || [])];
	newEquipment.splice(index, 1);

	emit("update:modelValue", {
		...props.modelValue,
		equipment: newEquipment,
	});
};
</script>
