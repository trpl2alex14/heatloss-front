<template>
	<IftaLabel class="space-y-1">
		<label v-if="label" class="block text-sm font-medium text-gray-700">{{
			label
		}}</label>
		<InputText
			v-bind="inputAttrs"
			v-model="modelValueProxy"
			:placeholder="placeholder"
			:type="type"
			variant="filled"
			class="w-full"
		/>
	</IftaLabel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import InputText from "primevue/inputtext";

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
	type: {
		type: String,
		default: "text",
	},
});
const emit = defineEmits(["update:modelValue"]);

const modelValueProxy = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const inputAttrs = computed(() => {
	const { modelValue, label, placeholder, type, ...rest } = props;
	return rest;
});
</script>
