<template>
	<div class="p-0">
		<Head title="Расчёты" subtitle="Список всех расчётов">
			<template #actions>
				<RowCounter :value="calculationData.length" />
				<BaseButton label="Создать расчёт" icon="plus" />
			</template>
		</Head>

		<BaseDataTable
			:loading="isLoading"
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownActions"
			:statuses="statuses"
			customizable
			expandable
			@update:pagination="onPageChange"
			@update:sort="onSortChange"
		>
			<template #top-left>
				<BaseSelectButton
					v-model="filterValue"
					:options="filterOptions"
					@update:model-value="onFilterChange"
				/>
			</template>
			<template #top-right>
				<BaseSearch v-model="searchValue" />
				<BaseDatePicker
					v-model="filterDates"
					selectionMode="range"
					:manualInput="false"
					placeholder="Период"
					@update:model-value="onDateChange"
				/>
			</template>
			<template #slot-rating="{ data }">
				<div class="flex items-center gap-3 w-full justify-center">
					<TypeColumn
						:type="data.rating || 1"
						:types="rating"
						short
						class="pt-1"
					/>
					<TypeColumn
						:type="data.product || 'all'"
						:types="productCategory"
						short
					/>
				</div>
			</template>
			<template #slot-tags="{ data }">
				<div class="flex flex-wrap gap-1">
					<BaseChip
						v-for="tag in data.tags"
						:key="tag"
						:label="tag"
					/>
				</div>
			</template>
			<template #expansion="{ data }">
				<h5>Orders for {{ data }}</h5>
			</template>
		</BaseDataTable>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Head from "@/shared/components/SubHead.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import { dropdownActions } from "../composables/useDropdownMenu";
import { useTable } from "@/shared/composables/useTable";
import { useCalculationData } from "@features/calculations/composables/useCalculationData";
import type { TypeLabelDef, TypeIconDef } from "@/shared/types/table";
import type { CalculationStatus } from "@features/calculations/types/calculation";
import { useTypes } from "@features/directories/composables/useTypes";
import TypeColumn from "@features/directories/components/TypeColumn.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import type { CalculationItem } from "@features/calculations/types/calculation";
import type { PaginationOptions } from "@/shared/types/table";
import { useLazyRequest } from "@/shared/composables/useLazyRequest";

const { productCategory } = useTypes();

const searchFields: (keyof CalculationItem)[] = ["id", "city"];

const statuses: TypeLabelDef[] & { key: CalculationStatus }[] = [
	{ key: "published", label: "Опубликован", type: "success" },
	{ key: "working", label: "В работе", type: "info" },
	{ key: "case", label: "Кейс", type: "warn" },
	{ key: "hide", label: "Скрыт", type: "secondary" },
];

const rating: TypeIconDef[] = [
	{ key: 1, icon: "pi pi-shop", color: "text-gray-300" },
	{ key: 2, icon: "pi pi-shop", color: "text-orange-300" },
	{ key: 3, icon: "pi pi-shop", color: "text-sky-300" },
	{ key: 4, icon: "pi pi-shop", color: "text-lime-400" },
	{ key: 5, icon: "pi pi-shop", color: "text-green-600" },
];

const {
	calculationData,
	isLoading,
	loadCalculationData,
	columns,
	filterOptions,
	pagination,
} = useCalculationData();

const { onPageChange, onDateChange, filterDates, filterValue, onFilterChange, searchValue, onSortChange } =
	useLazyRequest<CalculationItem>(loadCalculationData, true, {
		dateField: "date",
		filterField: "status",
		searchFields: searchFields,
	});

filterValue.value = "all";

const { tableData } = useTable(calculationData, {	
	lazy: true,
});

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		cost: row.cost.toLocaleString("ru-RU"),
		date: new Date(row.date),
	}));
});
</script>
