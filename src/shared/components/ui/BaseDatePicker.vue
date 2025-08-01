<template>
	<DatePicker
		v-bind="passThroughProps"
		v-model="modelValue"
		showIcon
		iconDisplay="input"
		showButtonBar
		dateFormat="dd/mm/yy"
		:placeholder="placeholder"
		@clear-click="onClear"
	/>
</template>

<script setup lang="ts">
import { useAttrs, computed } from "vue";
import DatePicker from "primevue/datepicker";

interface BaseDatePickerProps {
	modelValue: Date | Date[] | (Date | null)[] | null;
	placeholder?: string;
}

const props = defineProps<BaseDatePickerProps>();

const emit = defineEmits(["update:modelValue"]);
const attrs = useAttrs();

const modelValue = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
});

const passThroughProps = computed(() => ({
	...attrs,
}));

const onClear = () => {	
	emit("update:modelValue", null);
};
</script>
