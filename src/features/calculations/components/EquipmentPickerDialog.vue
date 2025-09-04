<template>
	<EquipmentsPicker
		:product="product"
		:roomId="roomId"
		:roomName="roomName"
		:exclude="exclude"
		@add="handleAdd"
		@cancel="handleCancel"
		:show-title="true"
	/>
</template>

<script setup lang="ts">
import EquipmentsPicker from './EquipmentsPicker.vue';
import { inject, onMounted, ref, type Ref } from 'vue';
import type { Product } from '@/shared/types/produtcs';
import type { Equipment } from '../types';

interface Dialog {
	data: { product: Product, roomId: number, roomName: string, exclude?: number[] };	
	close: (equipments: Equipment[] | void) => void;
}

const dialogRef = inject('dialogRef') as Ref<Dialog>;

const product = ref<Product>("all");
const roomId = ref(0);
const roomName = ref("Помещение");
const exclude = ref<number[]>([]);

onMounted(() => {
	if (dialogRef && dialogRef.value?.data) {
		product.value = dialogRef.value.data.product;
		roomId.value = dialogRef.value.data.roomId;
		roomName.value = dialogRef.value.data.roomName;
		exclude.value = dialogRef.value.data.exclude || [];
	}
});

const handleAdd = (equipments: Equipment[]) => {	
	dialogRef.value.close(equipments);
};

const handleCancel = () => {
	dialogRef.value.close();
};
</script>