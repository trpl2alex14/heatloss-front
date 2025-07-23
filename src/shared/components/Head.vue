<template>
	<div class="flex justify-between items-start gap-8 pb-2 w-full">
		<div>
			<h1 class="text-3xl font-normal leading-none">
				{{ title }}
			</h1>
			<p
				v-if="subtitle"
				class="text-base font-normal leading-5 text-(--my-color-gray) mt-2"
			>
				{{ subtitle }}
			</p>
		</div>
		<div class="flex items-center gap-5">
			<slot name="actions" />
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	title: string;
	subtitle?: string;
}

defineProps<Props>();
</script>
