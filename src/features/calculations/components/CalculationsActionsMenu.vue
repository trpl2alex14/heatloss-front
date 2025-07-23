<template>
	<BaseDropdownMenu :actions="actions" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseDropdownMenu from "@/shared/components/ui/BaseDropdownMenu.vue";

defineProps<{ calculation: any }>();

const actions = computed(() => [
	{
		label: "Открыть",
		icon: "pi pi-eye",
		command: () => {
			/* ... */
		},
	},
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		command: () => {
			/* ... */
		},
	},
	{
		label: "Удалить",
		icon: "pi pi-trash",
		command: () => {
			/* ... */
		},
	},
]);
</script>
