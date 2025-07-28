<template>
	<Menu :model="menuItems" popup ref="menu" />
	<Button
		icon="pi pi-ellipsis-v"
		@click="toggleMenu"
		class="p-0!"
		variant="link"
	/>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "primevue/menu";
import Button from "primevue/button";
import type { ActionDef } from "@/shared/types/table";

const props = defineProps<{
	actions: ActionDef[];
	id: number;
}>();

const menuItems = computed(() =>
	props.actions.map((action) => ({
		...action,
		command: () => action.command(props.id),
	}))
);

const menu = ref();

const toggleMenu = (event: Event) => {
	menu.value.toggle(event);
};
</script>
