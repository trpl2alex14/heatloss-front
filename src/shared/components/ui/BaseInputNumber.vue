<template>
	<div>
		<IftaLabel class="relative align-bottom">
			<InputNumber
				v-bind="inputAttrs"
				v-model="modelValueProxy"
				:placeholder="placeholder"
				class="w-full"			
				:pt="{ pcInputText: { root: { style: 'width: 100%' } } }"
				variant="filled"
				:disabled="disabled"
			/>
			<label v-if="label" class="block text-sm font-medium text-gray-700">{{
				label
			}}</label>
			<span v-if="suffix" class="text-gray-500 absolute right-3 bottom-2">{{ suffix }}</span>
		</IftaLabel>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import InputNumber from "primevue/inputnumber";

const props = defineProps({
	modelValue: {
		type: Number,
		default: 0,
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
	const { modelValue, label, placeholder, suffix, ...rest } = props;
	return { ...attrs, ...rest };
});
</script>

<style lang="scss">
.p-inputnumber {
	--p-inputtext-disabled-background: var(--color-gray-100);
	--p-inputtext-disabled-color: var(--color-gray-800);
}
</style>
