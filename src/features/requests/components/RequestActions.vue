<template>
	<div class="flex gap-3 pt-4 mt-6 justify-between w-full">
		<BaseButton label="Удалить" icon="trash" variant="outlined" severity="danger" @click="drop()" />
		<div class="flex justify-end gap-3">
			<BaseButton label="Создать расчёт" icon="external-link" variant="outlined" severity="danger" @click="create" />
			<BaseButton label="Закрыть" icon="times-circle" severity="danger" @click="close" />
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton from "@shared/components/ui/BaseButton.vue";
import { inject, onMounted, type Ref, ref } from "vue";
import { useConfirm } from "@/shared/composables/useConfirm";

interface Dialog {
	data: { id: number };
	close: () => void;
}

const { confirmDelete } = useConfirm();

const dialogRef = inject("dialogRef") as Ref<Dialog>;

let id = ref();

onMounted(() => {
	if (dialogRef && dialogRef.value?.data) {		
		id.value = dialogRef.value?.data.id;
	}
});

const emit = defineEmits(["delete", "create"]);

const close = () => {
	dialogRef.value.close();
}

function create() {
	emit('create', id.value);
	setTimeout( () => close(), 0);	
}

function drop() {
	confirmDelete().then(()=>{
		emit('delete', id.value);
		setTimeout( () => close(), 0);	
	});
}
</script>
