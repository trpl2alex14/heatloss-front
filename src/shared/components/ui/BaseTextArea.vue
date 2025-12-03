<template>
	<IftaLabel class="">
		<label v-if="label" class="block text-sm font-medium text-gray-700" v-html="label"></label>
		<Textarea
			v-bind="inputAttrs"
			v-model="modelValueProxy"
			:placeholder="placeholder"
			class="w-full"
			variant="filled"
			:disabled="disabled"
			:rows="rows"
		/>
		<span v-if="suffix" class="text-gray-500 absolute right-3 bottom-2">{{ suffix }}</span>
	</IftaLabel>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import Textarea from "primevue/textarea";

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	label: {
		type: String,
		default: "",
	},
	placeholder: {
		type: String,
		default: "",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	rows: {
		type: String,
		default: 3,
	},
	suffix: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["update:modelValue"]);

const modelValueProxy = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const attrs = useAttrs();

const inputAttrs = computed(() => {
	const { modelValue, label, placeholder, ...rest } = props;
	return { ...attrs, ...rest };
});
</script>

<style lang="scss">
.p-textarea {
	--p-textarea-disabled-background: var(--color-gray-200);
	--p-textarea-disabled-color: var(--color-gray-800);
}
</style>
