<template>
	<div v-if="totalPages > 1" class="flex items-center gap-2">
		<Button
			icon="pi pi-chevron-left"
			variant="outlined"
			severity="secondary"
			:disabled="currentPage <= 1"
			@click="goToPrev"
		/>
		<Button
			:label="`${currentPage} из ${totalPages}`"
			class="!whitespace-nowrap"
			variant="outlined"
			severity="secondary"
			disabled
		/>
		<Button
			icon="pi pi-chevron-right"
			variant="outlined"
			severity="secondary"
			:disabled="currentPage >= totalPages"
			@click="goToNext"
		/>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from "vue";
import Button from "primevue/button";

const props = defineProps<{
	currentPage: number;
	totalPages: number;
}>();

const emit = defineEmits(["update:page"]);

watch(props, () => {
	if(props.currentPage > props.totalPages) {
		emit("update:page", props.totalPages);
	} 
});

const goToPrev = () => {
	if (props.currentPage > 1) emit("update:page", props.currentPage - 1);
};

const goToNext = () => {
	if (props.currentPage < props.totalPages) emit("update:page", props.currentPage + 1);
};
</script> 