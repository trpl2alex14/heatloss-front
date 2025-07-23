<template>
	<DataTable
		:value="data"
		:paginator="!!pagination"
		:rows="pagination?.pageSize"
		:totalRecords="pagination?.total"
		:loading="loading"
		:first="(pagination?.page - 1) * (pagination?.pageSize || 0)"
		@page="onPageChange"
		:sortField="sortField"
		:sortOrder="sortOrder"
		@sort="onSortChange"
		responsiveLayout="scroll"
		class="w-full"
	>
		<template v-for="col in columns" :key="col.key">
			<Column
				:field="col.key"
				:header="col.label"
				:sortable="col.sortable"
			/>
		</template>
		<slot />
	</DataTable>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

interface ColumnDef {
	key: string;
	label: string;
	sortable?: boolean;
}

defineProps<{
	columns: ColumnDef[];
	data: any[];
	pagination?: { page: number; pageSize: number; total: number };
	loading?: boolean;
	sortField?: string;
	sortOrder?: 1 | -1;
}>();

defineEmits(["update:pagination", "update:sortField", "update:sortOrder"]);

const onPageChange = (e: any) => {
	// emit pagination update
	emit("update:pagination", {
		page: e.page + 1,
		pageSize: e.rows,
		total: e.totalRecords,
	});
};
const onSortChange = (e: any) => {
	emit("update:sortField", e.sortField);
	emit("update:sortOrder", e.sortOrder);
};
</script>
