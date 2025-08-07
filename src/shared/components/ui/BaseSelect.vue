<template>
	<IftaLabel>
		<Select
			v-model="modelValueProxy"
			:options="options"
			:option-label="optionLabel"
			:option-value="optionValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:class="computedClass"
			class="w-full"
			v-bind="selectAttrs"
		>
			<template #value="slotProps">
				<div v-if="slotProps.value" class="flex items-center gap-2">
					<img
						v-if="getOption(slotProps.value)?.icon"
						:src="getOption(slotProps.value)?.icon"
						class="w-4 h-4 object-cover"
					/>
					<span>{{
						getOption(slotProps.value)?.[optionLabel] ||
						slotProps.value
					}}</span>
				</div>
				<span v-else class="text-gray-500">{{ placeholder }}</span>
			</template>
			<template #option="slotProps">
				<div class="flex items-center gap-2">
					<img
						v-if="slotProps.option.icon"
						:src="slotProps.option.icon"
						class="w-4 h-4 object-cover"
					/>
					<span>{{ slotProps.option[optionLabel] }}</span>
				</div>
			</template>
		</Select>
		<label class="block text-sm font-medium text-gray-700">{{
			label || placeholder || ""
		}}</label>
	</IftaLabel>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import Select from "primevue/select";
import type { SelectOption } from "@/shared/types/ui";

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: null,
	},
	options: {
		type: Array as () => SelectOption[],
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
	label: {
		type: String,
		default: "",
	},
	placeholder: {
		type: String,
		default: "Выберите значение",
	},
	disabled: {
		type: Boolean,
		default: false,
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

const getOption = (value: string | number) => {
	return props.options.find((option) => option.value === value);
};

const attrs = useAttrs();

const selectAttrs = computed(() => {
	const {
		modelValue,
		options,
		optionLabel,
		optionValue,
		label,
		placeholder,
		disabled,
		className,
		...rest
	} = props;
	return { ...attrs, ...rest };
});

const computedClass = computed(() =>
	[
		//styles
		props.className,
	].join(" ")
);
</script>

<style lang="scss">
.p-select {
	--p-select-disabled-background: var(--color-gray-200);
	--p-select-disabled-color: var(--color-gray-800);

	.p-select-trigger {
		color: #687377;
	}
}
</style>
