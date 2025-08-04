<template>
	<Button
		v-bind="buttonAttrs"
		:icon="icon"
		:label="label"
		:loading="loading"
		:type="type"
		:variant="variant"
		:severity="severity"
	>
		<slot />
	</Button>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import Button from "primevue/button";

const props = defineProps({
	icon: {
		type: String,
		default: "",
	},
	label: {
		type: String,
		default: "",
	},
	loading: {
		type: Boolean,
		default: false,
	},
	outlined: {
		type: Boolean,
		default: false,
	},
	secondary: {
		type: Boolean,
		default: false,
	},
	text: {
		type: Boolean,
		default: false,
	},
	severity: {
		type: String as PropType<"primary" | "secondary" | "success" | "info" | "warning" | "danger" | undefined>,
		default: "primary",
	},
	variant: {
		type: String as PropType<"outlined" | "filled" | "text" | "link" | undefined>,
		default: "filled",
	},
	type: {
		type: String as PropType<"button" | "reset" | "submit" | undefined>,
		default: "button",
	},
});

const icon = computed(() => {
	if (props.icon) {
		return `pi pi-${props.icon}`;
	}
	return "";
});

const variant = computed(() => {
	if (props.variant === "outlined") {
		return "outlined";
	}
	if (props.text) {
		return "text";
	}
	return "filled";
});

const severity = computed(() => {
	if (props.secondary) {
		return "secondary";
	}
	return props.severity;
});

const buttonAttrs = computed(() => {
	const { label, loading, type, ...rest } = props;
	return rest;
});
</script>
