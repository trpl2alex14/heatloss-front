<template>
	<SelectButton
		v-model="modelValueProxy"
		:options="options"
		:option-label="optionLabel"
		:option-value="optionValue"
		:multiple="multiple"
		:disabled="disabled"
		:aria-labelledby="ariaLabelledby"
		:class="computedClass"
		v-bind="$attrs"
	>
		<template #option="slotProps">
			<div v-if="slotProps.option.image" class="flex items-center gap-2">
				<img
					:src="slotProps.option.image"
					class="w-4 h-4 object-cover"
					alt=""
				/>
				<span>{{ slotProps.option[optionLabel] }}</span>
			</div>
		</template>
	</SelectButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SelectButton from "primevue/selectbutton";
import type { SelectButtonOption } from "@shared/types/ui";

const props = defineProps({
	modelValue: {
		type: [String, Number, Array, Object],
		default: undefined,
	},
	options: {
		type: Array as () => SelectButtonOption[],
		required: true,
	},
	optionLabel: {
		type: String,
		default: "label",
	},
	optionValue: {
		type: String,
		default: "value",
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	ariaLabelledby: {
		type: String,
		default: undefined,
	},
	className: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["update:modelValue"]);

const modelValueProxy = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
});

const computedClass = computed(() =>
	[
		//styles
		props.className,
	].join(" ")
);
</script>

<style lang="scss">
.p-selectbutton {
	.p-togglebutton {
		--p-togglebutton-background: var(--color-gray-100);
		--p-togglebutton-checked-background: var(--color-gray-100);
	}
}
</style>
