<template>
	<span class="inline-flex items-center gap-1" v-if="icon">
		<img :src="icon.icon" class="w-6 h-6" v-tooltip.bottom="icon.label"/>		
	</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MaterialIcon from "@/assets/icons/material.svg";
import ConstructIcon from "@/assets/icons/construct.svg";

const types = [
	{
		type: 1,
		label: "Материал",
		icon: MaterialIcon,
	},
	{
		type: 2,
		label: "Конструкция",
		icon: ConstructIcon,
	},
];

const props = defineProps<{
	type: number;
}>();

const icon = computed(() => {
	return types.find((t) => t.type === props.type);
});
</script>
