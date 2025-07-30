<template>
	<div class="p-0">
		<Head
			title="Климатология"
			subtitle="Справочник населенный пунктов с данными по климату"
		>
			<template #actions>
				<RowCounter :value="climateData.length" />
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
			</template>
			<template #top-right>
				<BaseSearch v-model="searchValue" />
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
import { useTable } from "@/shared/composables/useTable";
import { useClimateData } from "@features/directories/composables/useClimateData";
import { plural } from "@/shared/utils/text";
import { dropdownActions } from "@/features/directories/composables/useDropdownMenu";

const { climateData, isLoading, columns } =
	useClimateData();

const { searchValue, pagination, tableData, onPageChange, onSortChange } =
	useTable(climateData, {
		searchFields: ["region", "city"],
		pageSize: 15,
	});

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		heatingSeason: plural(row.heatingSeason, ["день", "дня", "дней"], true),
	}));
});
</script>
