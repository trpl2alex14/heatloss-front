<template>
	<div class="p-0">
		<Head title="Расчёты" subtitle="Список всех расчётов">
			<template #actions>
				<RowCounter :value="calculationData.length"/>
				<BaseButton label="Создать расчёт" icon="plus"/>
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
				<BaseSearch v-model="searchValue"/>
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
				<div class="p-4 bg-gray-50">
					<h5 class="font-semibold mb-2">
						Детали расчёта {{ data.id }}
					</h5>
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div><strong>Клиент:</strong> {{ data.client }}</div>
						<div><strong>Город:</strong> {{ data.city }}</div>
						<div><strong>Площадь:</strong> {{ data.area }} м²</div>
						<div><strong>Этажи:</strong> {{ data.floors }}</div>
					</div>
				</div>
			</template>
		</BaseDataTable>
	</div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseSearch from "@shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@shared/components/ui/BaseDataTable.vue";
import BaseChip from "@shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import BaseDatePicker from "@shared/components/ui/BaseDatePicker.vue";
import TypeColumn from "@shared/components/TypeColumn.vue";
import Head from "@shared/components/Head.vue";
import RowCounter from "@shared/components/RowCounter.vue";
import {dropdownActions} from "../composables/useDropdownMenu.ts";
import {useCalculationData} from "../composables/useCalculationData.ts";
import type {TypeIconDef} from "@shared/types/table.ts";
import type {CalculationItem} from "../types/calculation.ts";
import {useTypes} from "@shared/composables/useTypes.ts";
import {useLazyTable} from "@shared/composables/useLazyTable.ts";
import {statuses} from "@features/calculations/composables/useCalculationState.ts";

const {productCategory} = useTypes();

const searchFields: (keyof CalculationItem)[] = ["id", "city"];

const rating: TypeIconDef[] = [
	{key: 1, icon: "pi pi-shop", color: "text-gray-300"},
	{key: 2, icon: "pi pi-shop", color: "text-orange-300"},
	{key: 3, icon: "pi pi-shop", color: "text-sky-300"},
	{key: 4, icon: "pi pi-shop", color: "text-lime-400"},
	{key: 5, icon: "pi pi-shop", color: "text-green-600"},
];

const {
	calculationData,
	isLoading,
	loadCalculationData,
	columns,
	filterOptions,
	pagination,
} = useCalculationData();

const {
	onPageChange,
	onDateChange,
	filterDates,
	filterValue,
	onFilterChange,
	searchValue,
	onSortChange,
} = useLazyTable<CalculationItem>(loadCalculationData, true, {
	dateField: "date",
	filterField: "status",
	searchFields: searchFields,
	pageSize: 15,
});

filterValue.value = "all";

const pagedDataTransformed = computed(() => {
	return calculationData.value.map((row: CalculationItem) => ({
		...row,
		cost: row.cost.toLocaleString("ru-RU"),
		date: new Date(row.date),
	}));
});
</script>
