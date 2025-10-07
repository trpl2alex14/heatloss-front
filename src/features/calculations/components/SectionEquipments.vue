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
import { computed, defineAsyncComponent } from "vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import RoomEquipment from "./RoomEquipment.vue";
import EmptyBox from "@shared/components/EmptyBox.vue";
import type { CalculationDetails, Equipment } from "../types";
import { useDialog } from 'primevue/usedialog';

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
}

const equipmentsPicker = defineAsyncComponent(() => import('./EquipmentPickerDialog.vue'));

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialog = useDialog();

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
const addEquipment = () => {
	dialog.open(equipmentsPicker, {
        props: {
			showHeader: false,
            style: {
                width: '45vw',
            },
            modal: true
        },
		data: {
			product: props.modelValue.product,
			roomId: 0,
			roomName: 'Дополнительное',
			exclude: props.modelValue.equipment?.map((equipment) => equipment.id) || [],
		},
		onClose: (value) => {
			if (!value?.data || !Array.isArray(value.data) || value.data.length === 0) {
				return;
			}

			emit("update:modelValue", {
				...props.modelValue,
				equipment: [...(props.modelValue.equipment || []), ...value.data],
			});
		}
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
