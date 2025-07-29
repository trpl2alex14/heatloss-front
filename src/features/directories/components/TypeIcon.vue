<template>
	<span class="inline-flex items-center gap-1" v-if="icon">
		<img :src="icon.icon" class="w-6 h-6" v-tooltip.bottom="icon.label"/>		
	</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MaterialIcon from "@/assets/icons/material.svg";
import ConstructIcon from "@/assets/icons/construct.svg";
import type { Category } from "@/shared/types/category";

const types : Category[] = [
	{
		id: 1,
		label: "Материал",
		icon: MaterialIcon,
	},
	{
		id: 2,
		label: "Конструкция",
		icon: ConstructIcon,
	},
];

const props = defineProps<{
	type: number;
}>();

const icon = computed(() => {
	return types.find((t) => t.id === props.type);
});
</script>
