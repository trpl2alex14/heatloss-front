<template>
	<Button
		v-bind="buttonAttrs"
		:label="label"
		:loading="loading"
		:type="type"
		class="w-full"
	>
		<slot />
	</Button>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import Button from "primevue/button";

const props = defineProps({
	label: {
		type: String,
		default: "",
	},
	loading: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String as PropType<"button" | "reset" | "submit" | undefined>,
		default: "button",
	},
});

const buttonAttrs = computed(() => {
	const { label, loading, type, ...rest } = props;
	return rest;
});
</script>
