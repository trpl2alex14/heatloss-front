<template>
	<Menu :model="actions" popup ref="menu" />
	<Button icon="pi pi-ellipsis-v" @click="toggleMenu" class="p-button-text" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menu from "primevue/menu";
import Button from "primevue/button";

defineProps<{
	actions: Array<{ label: string; icon?: string; command: () => void }>;
}>();

const menu = ref();
const toggleMenu = (event: Event) => {
	menu.value.toggle(event);
};
</script>
