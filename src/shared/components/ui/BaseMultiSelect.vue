<template>
	<IftaLabel>
		<MultiSelect
			v-model="modelValueProxy"
			:options="options"
			:option-label="optionLabel"
			:option-value="optionValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:class="computedClass"
			:display="display"
			:filter="filter"
			class="w-full"
			v-bind="multiSelectAttrs"
		>
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
		</MultiSelect>
		<label class="block text-sm font-medium text-gray-700">{{
			label || placeholder || ""
		}}</label>
	</IftaLabel>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import MultiSelect from "primevue/multiselect";
import type { SelectOption } from "@/shared/types/ui";

const props = defineProps({
	modelValue: {
		type: Array as () => (string | number)[],
		default: () => [],
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
		default: "Выберите значения",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	className: {
		type: String,
		default: "",
	},
	display: {
		type: String,
		default: "chip",
	},
	filter: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue"]);

const modelValueProxy = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
});

const attrs = useAttrs();

const multiSelectAttrs = computed(() => {
	const {
		modelValue,
		options,
		optionLabel,
		optionValue,
		label,
		placeholder,
		disabled,
		className,
		display,
		filter,
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
.p-iftalabel .p-multiselect-label:has(.p-chip) {
	padding-block-start: calc(var(--p-iftalabel-input-padding-top) - 0.2rem);
	display: flex;
	flex-wrap: wrap;
}

.p-multiselect {
	--p-multiselect-disabled-background: var(--color-gray-200);
	--p-multiselect-disabled-color: var(--color-gray-800);

	.p-multiselect-trigger {
		color: #687377;
	}

	.p-multiselect-label {
		padding: 0.5rem 0.75rem;
	}

	.p-multiselect-chip {
		color: var(--color-primary-700);
		border-radius: 0.375rem;
		padding: 0.1rem 0.5rem;
		margin: 0.1rem;
		font-size: 0.8rem;
	}
}
</style>
