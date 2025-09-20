<template>
	<div class="flex items-center justify-between mb-3">
		<div class="flex items-center gap-2">
			<slot name="top-left" />
			<BasePagination
				v-if="pagination"
				:currentPage="pagination.page ?? 1"
				:totalPages="
					Math.ceil(
						(pagination.total || 0) / (pagination.pageSize || 1)
					)
				"
				@update:page="onPaginationPageChange"
			/>
		</div>
		<div class="flex items-center gap-2 ml-auto">
			<slot name="top-right" />
			<BaseDataTableColsPicker
				v-if="customizable && columns.length > 1"
				v-model="viewColumns"
				:options="columns"
			/>
		</div>
	</div>

	<div class="flex-1 rounded-lg border border-gray-300 w-full overflow-auto">
		<DataTable
			v-model:expandedRows="expandedRows"
			dataKey="id"
			:value="data"
			:loading="loading"
			:sortField="sortField"
			:sortOrder="sortOrder"
			removableSort
			@sort="onSortChange"
			responsiveLayout="scroll"
			class="w-full data-table-fix"
		>
			<Column v-if="expandable" expander style="width: 1rem" />
			<template v-for="col in sortedColumns" :key="col.key">
				<Column
					:field="col.key"
					:header="col.label"
					:sortable="col?.sortable"
					:headerStyle="getColumnStyle(col)"
					:style="getColumnStyle(col)"
				>
					<template v-if="col.type === 'date'" #body="{ data }">
						<span>{{ data[col.key].toLocaleDateString() }}</span>
					</template>
					<template v-else-if="col.type === 'icon'" #body="{ data }">
						<span
							v-if="data[col.key]"
							v-bind="getIconColumn(data[col.key])"
						></span>
					</template>
					<template
						v-else-if="col.type === 'number'"
						#body="{ data }"
					>
						<span>{{ data[col.key] ?? "-" }}</span>
						<span
							v-if="data[col.key] && col.measure"
							class="text-sm text-gray-300 ml-1"
							>{{ col.measure }}</span
						>
					</template>
					<template v-else-if="col.type === 'slot'" #body="{ data }">
						<slot :name="`slot-${col.key}`" :data="data" :col="col" />
					</template>
					<template
						v-else-if="statuses && col.type === 'status'"
						#body="{ data }"
					>
						<BaseStatusTag v-if="statuses" :statuses="statuses" :status="data[col.key]"/>
					</template>
					<template
						v-else-if="actions && col.type === 'actions'"
						#body="{ data }"
					>
						<div class="flex justify-end w-full">
							<BaseDropdownMenu
								:actions="computedActions(data.id)"
								:id="data.id"
								@action="(e: any)=>emit('action', e)"
							/>
						</div>
					</template>
					<template v-else #body="{ data }">
						<template v-if="Array.isArray(data[col.key])">
							<div v-for="item in data[col.key]" :key="item">
								{{ item }}
							</div>
						</template>
						<template v-else>
							{{ data[col.key] }}
						</template>
					</template>
				</Column>
			</template>
			<template v-if="expandable" #expansion="slotProps">
				<div class="p-4">
					<slot name="expansion" :data="slotProps.data" />
				</div>
			</template>
		</DataTable>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DataTable from "primevue/datatable";
import BasePagination from "./BasePagination.vue";
import BaseDataTableColsPicker from "./BaseDataTableColumnsPicker.vue";
import BaseDropdownMenu from "./BaseDropdownMenu.vue";
import Column from "primevue/column";
import type { ColumnDef, TypeLabelDef } from "@/shared/types/table";
import type { ActionDef } from "@/shared/types/menu";
import BaseStatusTag from "@shared/components/ui/BaseStatusTag.vue";

const props = defineProps<{
	columns: ColumnDef[];
	data: any[];
	pagination?: { page: number; pageSize: number; total: number };
	loading?: boolean;
	sortField?: string;
	sortOrder?: 1 | -1;
	customizable?: boolean;
	actions?: ((id: number) => ActionDef[]) | ActionDef[];
	statuses?: TypeLabelDef[];
	expandable?: boolean;
}>();

const expandedRows = ref({});

const viewColumns = ref<ColumnDef[]>(props.columns);

const computedActions = (id: number)=>{
	if(typeof  props.actions === 'function'){
		return props.actions(id) || [];
	}

	return props.actions || [];
};

const sortedColumns = computed(() => {
	const colums = viewColumns.value.sort(
		(a, b) => (a?.sort || 90) - (b?.sort || 90)
	);

	return props.actions
		? [
				...colums,
				{
					key: "table-actions",
					label: "",
					type: "actions",
				} as ColumnDef,
		  ]
		: colums;
});

const getColumnStyle = (col: ColumnDef) => {
	return (
		col?.style ||
		(col.type === "icon" ? "width: 4rem;text-align: center" : "")
	);
};

const getIconColumn = (value: string | { icon: string; color: string }) => {
	const icon = typeof value === "string" ? value : value.icon;
	return {
		class: ["text-lg!", "pi", "pi-" + icon],
		style: {
			color:
				typeof value === "string" ? "var(--color-black)" : value.color,
		},
	};
};

const emit = defineEmits([
	"update:pagination",
	"update:sort",
	"action",
]);

const onSortChange = (e: any) => {
	emit("update:sort", {
		sortField: e.sortField,
		sortOrder: e.sortOrder,
	});
};

const onPaginationPageChange = (page: number) => {
	emit("update:pagination", {
		...props.pagination,
		page,
	});
};
</script>

<style lang="scss">
.data-table-fix {
	th {
		border-bottom-width: 2px;
	}
	.p-datatable-tbody > tr:last-child > td {
		border-bottom: none;
	}
}
</style>
