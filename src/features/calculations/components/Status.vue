<template>
	<div v-if="statusLabel" class="border border-gray-300 rounded-md py-2 px-3">
		<BaseStatusTag :statuses="statuses" :status="calculation.status" class="w-30"/>
	</div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {CalculationDetails} from "@features/calculations/types/calculation.ts";
import BaseStatusTag from "@shared/components/ui/BaseStatusTag.vue";
import { statuses } from "@features/calculations/composables/useCalculationState.ts";

interface Props {
	calculation: CalculationDetails,
}

const props = defineProps<Props>();

const statusLabel = computed(() => {
	return statuses.find((s) => s.key === props.calculation.status)?.label;
});
</script>
