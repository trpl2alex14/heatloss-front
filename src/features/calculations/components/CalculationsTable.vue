<template>
	<BaseDataTable
		:columns="columns"
		:data="calculations"
		:pagination="pagination"
		:loading="isLoading"
		@update:pagination="onPaginationUpdate"
		@update:sortField="onSortFieldUpdate"
		@update:sortOrder="onSortOrderUpdate"
	>
		<template #body="{ data }">
			<!-- Кастомные ячейки, например, действия -->
			<tr>
				<td v-for="col in columns" :key="col.key">
					{{ data[col.key] }}
				</td>
				<td>
					<CalculationsActionsMenu :calculation="data" />
				</td>
			</tr>
		</template>
	</BaseDataTable>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import CalculationsActionsMenu from "./CalculationsActionsMenu.vue";

const columns = [
	{ key: "name", label: "Название", sortable: true },
	{ key: "date", label: "Дата", sortable: true },
	{ key: "status", label: "Статус", sortable: true },
	// ...другие колонки
];

const calculations = ref([]); // данные
const pagination = ref({ page: 1, pageSize: 10, total: 0 });
const isLoading = ref(false);

const onPaginationUpdate = (val: any) => {
	pagination.value = val;
};
const onSortFieldUpdate = (val: string) => {};
const onSortOrderUpdate = (val: 1 | -1) => {};
</script>
