<template>
	<div class="p-0">
		<Head
			title="Оборудование"
			subtitle="Список доступного отопительного оборудования"
		>
			<template #actions>
				<RowCounter :value="pageData.length" />
				<BaseButton label="Добавить" icon="plus" />
			</template>
		</Head>

		<BaseDataTable
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownActions"
			customizable
			@update:pagination="onPageChange"
		>
			<template #top-left>
				<BaseSelectButton
					v-model="filterValue"
					:options="filterOptions"
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
				<TypeColumn :type="data.product" :types="productCategory"/>
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
import TypeColumn from "@features/directories/components/TypeColumn.vue";
import type {
	ColumnDef,
	TypeIconDef
} from "@/shared/types/table";
import { dropdownActions } from "@/features/directories/composables/useProductDropdownMenu";
import { useTable } from "@/shared/composables/useTable";
import { useTypes } from "@features/directories/composables/useTypes";

const columns: ColumnDef[] = [
	{
		key: "status",
		label: "",
		type: "slot",
		style: "width: 20px;",
		sort: 1,
	},
	{
		key: "photo",
		label: "Фото",
		type: "slot",
		style: "width: 80px;",
		hidden: true,
		sort: 2,		
	},
	{
		key: "product",
		label: "Продукт",
		type: "slot",
		sortable: true,
		style: "width: 100px;",
		sort: 3,
	},
	{
		key: "category",
		label: "Категория",
		sortable: true,
		sort: 4,
		hidden: true,
	},
	{
		key: "name",
		label: "Название",
		sortable: true,
		sort: 5,
	},
	{
		key: "article",
		label: "Артикул",
		style: "width: 100px;",
		sort: 6,
		hidden: true,
	},
	{
		key: "price",
		label: "Стоимость",
		type: "number",
		sortable: true,
		style: "width: 90px; text-align: right",
		measure: "₽",
		sort: 7,
	},
	{
		key: "characteristics",
		label: "Характеристики",		
		sort: 8,
		hidden: true,
	},
	{
		key: "tags",
		label: "Тэги",
		type: "slot",
		hidden: true,
		sort: 9,
	},
];

const filterOptions = [
	{ label: "Флэйт", value: "fleyt" },
	{ label: "Коузи", value: "kouzi" },
	{ label: "Все", value: "all" },
];

const { productCategory } = useTypes();

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

const filterValue = ref("fleyt");

const pageData = ref([
	{
		id: 1,
		status: "published",
		photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
		product: "fleyt",
		category: "Радиаторы",
		name: "Флэйт 500В - 50 Белый",
		article: "46747337722",
		price: 127012,
		characteristics: "Мощность - 500Вт",
		tags: ["под окно", "белый", "каркасник"],
	},
	{
		id: 2,
		status: "hidden",
		photo: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
		product: "fleyt",
		category: "Терморегулятор",
		name: "Welrok Ls",
		article: "46747332722",
		price: 12012,
		characteristics: "Мощность - 500Вт",
		tags: ["wi-Fi", "каркасник"],
	},
	{
		id: 3,
		status: "published",
		photo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
		product: "kouzi",
		category: "Радиаторы",
		name: "Флэйт 500В - 50 Белый",
		article: "46747337722",
		price: 127012,
		characteristics: "Мощность - 500Вт",
		tags: ["каркасник"],
	},
	{
		id: 4,
		status: "hidden",
		photo: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=80&q=80",
		product: "fleyt",
		category: "Терморегулятор",
		name: "Welrok Ls",
		article: "46747332722",
		price: 12012,
		characteristics: "Мощность - 500Вт",
		tags: ["каркасник"],
	},
	{
		id: 5,
		status: "published",
		photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
		product: "fleyt",
		category: "Радиаторы",
		name: "Флэйт 500В - 50 Белый",
		article: "46747337722",
		price: 127012,
		characteristics: "Мощность - 500Вт",
		tags: ["каркасник"],
	},
	{
		id: 6,
		status: "published",
		photo: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
		product: "all",
		category: "Терморегулятор",
		name: "Welrok Ls",
		article: "46747332722",
		price: 12012,
		characteristics: "Мощность - 500Вт",
		tags: ["каркасник"],
	},
]);



const { searchValue, pagination, tableData, onPageChange } = useTable(
	pageData,
	{
		searchFields: ["name", "category", "article"],
		pageSize: 10,
	}
);

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		price: row.price.toLocaleString("ru-RU"),
	}));
});
</script>
