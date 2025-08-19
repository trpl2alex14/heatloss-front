<template>
	<div class="flex justify-center items-center rounded-xl p-2 bg-gray-100">
		<p class="text-gray-400">{{ label }}</p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	label?: string;
}

withDefaults(defineProps<Props>(), {
	label: "нет данных",
});
</script>
