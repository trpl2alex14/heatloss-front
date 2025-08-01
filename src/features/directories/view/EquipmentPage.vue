<template>
	<div class="p-0">
		<Head
			title="Оборудование"
			subtitle="Список доступного отопительного оборудования"
		>
			<template #actions>
				<RowCounter :value="equipmentData.length" />
				<BaseButton label="Добавить" icon="plus" />
			</template>
		</Head>

		<BaseDataTable
			:loading="isLoading"
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownActions"
			customizable
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
			</template>
			<template #slot-status="{ data }">
				<TypeColumn :type="data.status" :types="statuses" short />
			</template>
			<template #slot-photo="{ data }">
				<img
					v-if="data.photo"
					:src="data.photo"
					alt="Фото"
					class="w-15 h-15 object-cover rounded"
				/>
			</template>
			<template #slot-product="{ data }">
				<TypeColumn :type="data.product" :types="productCategory" />
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
		</BaseDataTable>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Head from "@/shared/components/SubHead.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import TypeColumn from "@/shared/components/TypeColumn.vue";
import type { TypeIconDef } from "@/shared/types/table";
import { dropdownActions } from "@/features/directories/composables/useProductDropdownMenu";
import { useTable } from "@/shared/composables/useTable";
import { useTypes } from "@/shared/composables/useTypes";
import { useEquipmentData } from "@features/directories/composables/useEquipmentData";
import type { EquipmentItem } from "@/features/directories/types/equipment";

const filterValue = ref("all");

const { productCategory } = useTypes();

const onFilterChange = (value: string) => {
	filterValue.value = value;
	loadEquipmentData(value);
};

const statuses: TypeIconDef[] = [
	{
		key: "published",
		icon: "pi pi-check-circle",
		color: "text-green-600",
	},
	{
		key: "hidden",
		icon: "pi pi-times-circle",
		color: "text-gray-400",
	},
];

const { equipmentData, isLoading, loadEquipmentData, columns, filterOptions } =
	useEquipmentData();

const { searchValue, pagination, tableData, onPageChange, onSortChange } =
	useTable<EquipmentItem>(equipmentData, {
		searchFields: ["name", "category", "article"],
		pageSize: 10,
	});

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		price: row.price.toLocaleString("ru-RU"),
	}));
});
</script>
