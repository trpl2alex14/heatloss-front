<template>
	<div class="flex items-center gap-2">
		<ToggleSwitch
			v-bind="toggleAttrs"
			v-model="modelValueProxy"
			:disabled="disabled"
			:readonly="readonly"
		/>
		<span v-if="label" class="bloc">{{ label }}</span>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import ToggleSwitch from "primevue/toggleswitch";

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: "",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	readonly: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue"]);

const modelValueProxy = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit("update:modelValue", value),
});

const attrs = useAttrs();

const toggleAttrs = computed(() => {
	const { modelValue, label, disabled, readonly, ...rest } = props;
	return { ...attrs, ...rest };
});
</script>

<style lang="scss">
.p-togglebutton {
	--p-togglebutton-disabled-background: var(--color-gray-200);
	--p-togglebutton-disabled-color: var(--color-gray-800);
}
</style>
