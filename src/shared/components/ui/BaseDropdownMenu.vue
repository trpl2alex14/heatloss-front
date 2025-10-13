<template>
	<Menu :model="menuItems" popup ref="menu">
		<template #start>
			<slot name="start" />
		</template>
		<template #end>
			<slot name="end" />
		</template>
	</Menu>
	<slot name="default" :open="toggleMenu">
		<Button
			icon="pi pi-ellipsis-v"
			@click="toggleMenu"
			class="p-0!"
			variant="link"
		/>
	</slot>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "primevue/menu";
import Button from "primevue/button";
import type {ActionDef, ActionValue} from "@shared/types/menu";

interface Props {
	actions: ActionDef[];
	id?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: "action", value: ActionValue): void;
}>();

const menuItems = computed(() =>
	props.actions.map((action) => ({
		...action,
		command: 'command' in action
			? () => action.command(props.id || 0)
			: () => 'name' in action && emit("action", { id: props.id, action: action.name }),
	}))
);

const menu = ref();

const toggleMenu = (event: Event) => {
	menu.value.toggle(event);
};
</script>
