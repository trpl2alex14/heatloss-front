<template>
	<div class="w-full">
		<label
			v-if="label"
			:for="id"
			class="block text-sm font-medium text-gray-700 mb-2"
		>
			{{ label }}
		</label>
		<Listbox
			:model-value="modelValue"
			:options="options"
			:option-label="optionLabel"
			:option-value="optionValue"
			:option-group-label="optionGroupLabel"
			:option-group-children="optionGroupChildren"
			:placeholder="placeholder"
			:disabled="disabled"
			:filter="filter"
			:multiple="multiple"
			:filter-placeholder="filterPlaceholder"
			:filter-match-mode="filterMatchMode"
			:filter-options="filterOptions"
			:class="['w-full', $attrs.class]"
			:listStyle="listStyle"
			@update:model-value="$emit('update:modelValue', $event)"
		>
			<template #option="slotProps">
				<slot
					name="option"
					:option="slotProps.option"
					:index="slotProps.index"
				>
					<div class="flex items-center">
						<span>{{ getOptionLabel(slotProps.option) }}</span>
					</div>
				</slot>
			</template>
			<template #optiongroup="slotProps">
				<slot
					name="optiongroup"
					:option="slotProps.option"
					:index="slotProps.index"
				>
					<div class="flex items-center">
						<span class="font-medium">{{
							getOptionGroupLabel(slotProps.option)
						}}</span>
					</div>
				</slot>
			</template>
			<template #empty>
				<slot name="empty">
					<div class="p-3 text-center text-gray-500">Нет данных</div>
				</slot>
			</template>
			<template #emptyfilter>
				<slot name="emptyfilter">
					<div class="p-3 text-center text-gray-500">
						Ничего не найдено
					</div>
				</slot>
			</template>
		</Listbox>
	</div>
</template>

<script setup lang="ts">
import Listbox from "primevue/listbox";

interface Props {
	modelValue?: any;
	options?: any[];
	optionLabel?: string;
	optionValue?: string;
	optionGroupLabel?: string;
	optionGroupChildren?: string;
	placeholder?: string;
	disabled?: boolean;
	filter?: boolean;
	filterPlaceholder?: string;
	filterMatchMode?: string;
	filterOptions?: any;
	label?: string;
	id?: string;
	multiple?: boolean;
	listStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: "Выберите...",
	filterPlaceholder: "Поиск...",
	filterMatchMode: "contains",
});

defineEmits<{
	"update:modelValue": [value: any];
}>();

const getOptionLabel = (option: any) => {
	if (props.optionLabel) {
		return option[props.optionLabel];
	}
	return option;
};

const getOptionGroupLabel = (option: any) => {
	if (props.optionGroupLabel) {
		return option[props.optionGroupLabel];
	}
	return option;
};
</script>
