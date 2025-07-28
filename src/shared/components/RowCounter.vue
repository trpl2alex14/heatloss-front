<template>
	<div class="border border-gray-300 rounded-md py-2 px-3">
		{{ value }} {{ label }}
	</div>
</template>

<script setup lang="ts">
interface Props {
	value: string | number;
	label?: string;
}

defineProps<Props>();
</script>
