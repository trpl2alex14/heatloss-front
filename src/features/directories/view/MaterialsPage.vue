<template>
	<div class="p-0">
		<Head
			title="Огр. конструкции"
			subtitle="Справочник материалов и ограждающих конструкций"
		>
			<template #actions>
				<RowCounter :value="tableData.length" label="Записей" />
				<BaseButton label="Добавить" icon="plus" />
			</template>
		</Head>

		<BaseDataTable
			:columns="columns"
			:data="pagedData"
			:pagination="pagination"
			:actions="dropdownActions"
			customizable
			@update:pagination="onPageChange"
		>
			<template #top-left></template>
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
				<TypeIcon :type="data.type" />
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
import TypeIcon from "@/features/directories/components/TypeIcon.vue";
import type { ColumnDef } from "@/shared/types/table";
import { dropdownActions } from "@/features/directories/composible/useDropdownMenu";

const columns: ColumnDef[] = [
	{ key: "name", label: "Название", sortable: true, sort: 2 },
	{ key: "category", label: "Категория", sortable: true, sort: 4 },
	{
		key: "photo",
		label: "Фото",
		type: "slot",
		style: "width: 80px;",
		hidden: true,
		sort: 1
	},
	{
		key: "type",
		label: "Тип",
		type: "slot",
		sortable: true,
		style: "width: 60px; text-align: center",
		sort: 3
	},
	{
		key: "value",
		label: "Коэфф. (А/Б)",
		type: "text",
		style: "width: 110px; text-align: right; white-space: nowrap;",
		sort: 5
	},
	{
		key: "r",
		label: "Сопротивление",
		type: "number",
		style: "width: 120px; text-align: right",
		measure: "м²*С/Вт",
		sort: 6
	},
	{ key: "surface", label: "Поверхность", type: "slot", hidden: true, sort: 10 },
];

const tableData = ref([
	{
		id: 1,
		name: "Минеральная (каменная) вата, плотностью 25-45 кг/м3",
		category: "Утеплители",
		photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
		type: 1,
		a: 0.045,
		b: 0.045,
		r: null,
		surface: ["кровля", "стены", "перекрытие"],
	},
	{
		id: 2,
		name: "Дерево: сосна, ель поперек волокон 500",
		category: "Дерево",
		photo: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
		type: 1,
		a: 0.045,
		b: 0.045,
		r: null,
		surface: ["кровля", "стены", "перекрытие"],
	},
	{
		id: 3,
		name: "Двухкамерный стеклопакет",
		category: "Окна",
		photo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
		type: 2,
		a: null,
		b: null,
		r: 0.71,
		surface: ["витраж"],
	},
	{
		id: 4,
		name: "Газоблок Д500",
		category: "Блоки",
		photo: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=80&q=80",
		type: 1,
		a: 0.2,
		b: 0.23,
		r: null,
		surface: ["стены"],
	},
]);

const searchValue = ref("");

const pagination = ref({
	page: 1,
	pageSize: 10,
	total: tableData.value.length,
});

const pagedData = computed(() => {
	let filtered = tableData.value;
	if (searchValue.value) {
		filtered = filtered.filter(
			(row) =>
				row.name
					.toLowerCase()
					.includes(searchValue.value.toLowerCase()) ||
				row.category
					.toLowerCase()
					.includes(searchValue.value.toLowerCase())
		);
	}
	pagination.value.total = filtered.length;
	return filtered
		.slice(
			(pagination.value.page - 1) * pagination.value.pageSize,
			pagination.value.page * pagination.value.pageSize
		)
		.map((row) => ({
			...row,
			value: row.a || row.b ? `${row.a ?? "-"}/${row.b ?? "-"}` : "-",
		}));
});

function onPageChange(page: number) {
	pagination.value.page = page;
}
</script>
