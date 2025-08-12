<template>
	<div class="p-0">
		<Head
			title="Огр. конструкции"
			subtitle="Справочник материалов и ограждающих конструкций"
		>
			<template #actions>
				<RowCounter :value="materialData.length" />
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
			<template #slot-photo="{ data }">
				<img
					v-if="data.photo"
					:src="data.photo"
					alt="Фото"
					class="w-16 h-16 object-cover rounded"
				/>
			</template>
			<template #slot-surface="{ data }">
				<div class="flex flex-wrap gap-1">
					<BaseChip v-for="s in data.surface" :key="s" :label="s" />
				</div>
			</template>
			<template #slot-type="{ data }">
				<TypeIcon :type="data.type" :types="materialTypes" short />
			</template>
		</BaseDataTable>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Head from "@/shared/components/SubHead.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import TypeIcon from "@/shared/components/TypeColumn.vue";
import { dropdownActions } from "@/features/directories/composables/useMaterialDropdownMenu";
import { useTable } from "@/shared/composables/useTable";
import { useTypes } from "@/shared/composables/useTypes";
import { useMaterialData } from "@features/directories/composables/useMaterialData";
import type { MaterialItem } from "@/features/directories/types";

const filterValue = ref("all");

const { materialTypes } = useTypes();

const onFilterChange = (value: string) => {
	filterValue.value = value;
	loadMaterialData(value);
};

const { materialData, isLoading, loadMaterialData, columns, filterOptions } =
	useMaterialData();

const { searchValue, pagination, tableData, onPageChange, onSortChange } =
	useTable<MaterialItem>(materialData, {
		searchFields: ["name", "category"],
		pageSize: 10,
	});

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		value: row.a || row.b ? `${row.a ?? "-"}/${row.b ?? "-"}` : "-",
	}));
});

onMounted(() => {
	loadMaterialData();
});
</script>
