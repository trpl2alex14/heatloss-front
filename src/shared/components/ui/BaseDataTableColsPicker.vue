<template>
	<MultiSelect
		placeholder="Выбрать колонки"
		dropdown-icon="pi pi-cog"
		display="chip"
		v-model="selectedColumns"
		:options="hiddenColumns"
		option-label="label"
		@update:modelValue="toggleColumn"
		class="base-data-table-cols-picker"
		v-bind="$attrs"
	/>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref } from "vue";
import MultiSelect from "primevue/multiselect";
import type { ColumnDef } from "@/shared/composible/useTable";

const props = defineProps({
	modelValue: {
		type: Array as () => ColumnDef[],
		default: () => [],
	},
	options: {
		type: Array as () => ColumnDef[],
		required: true,
	},
});

const emit = defineEmits(["update:modelValue"]);

const selectedColumns = ref<ColumnDef[]>(
	props.options.filter((col) => col.hidden)
);

const hiddenColumns = computed(() => props.options.filter((col) => col.hidden));

const viewColumns = computed(() => {
	return [
		...props.options.filter((col) => !col.hidden),
		...selectedColumns.value,
	];
});

const toggleColumn = (value: ColumnDef[]) => {
	selectedColumns.value = value;
	emit("update:modelValue", viewColumns.value);
};
</script>

<style lang="scss">
.base-data-table-cols-picker {
	align-self: stretch;

	.p-multiselect-label,
	.p-multiselect-label-container {
		display: none;
	}
}
</style>
