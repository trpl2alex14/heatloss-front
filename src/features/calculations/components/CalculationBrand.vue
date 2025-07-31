<template>
	<div class="flex items-center gap-1">
		<div
			class="w-4 h-4 rounded bg-gray-200 flex items-center justify-center"
		>
			<span class="text-xs font-bold text-gray-600">{{ brandText }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CalculationItem } from "@features/calculations/types/calculation";

interface Props {
	brand: CalculationItem["brand"];
}

const props = defineProps<Props>();

const brandText = computed(() => {
	switch (props.brand) {
		case "fl":
			return "FL";
		case "kz":
			return "KZ";
		case "gr":
			return "GR";
		default:
			return props.brand.toUpperCase();
	}
});
</script>
