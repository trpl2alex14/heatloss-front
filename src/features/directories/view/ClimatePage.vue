<template>
	<div class="p-0">
		<Head
			title="Климатология"
			subtitle="Справочник населенный пунктов с данными по климату"
		>
			<template #actions>
				<RowCounter :value="pageData.length" />
				<BaseButton label="Добавить" icon="plus" />
			</template>
		</Head>

		<BaseDataTable
			:columns="columns"
			:data="tableDataTransformed"
			:pagination="pagination"
			:actions="dropdownActions"
			customizable
			@update:pagination="onPageChange"
		>
			<template #top-left></template>
			<template #top-right>
				<BaseSearch v-model="searchValue" />
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
import type { ColumnDef } from "@/shared/types/table";
import { dropdownActions } from "@/features/directories/composables/useDropdownMenu";
import { useTable } from "@/shared/composables/useTable";
import { plural } from "@/shared/utils/text";

const columns: ColumnDef[] = [
	{ key: "id", label: "ID", sortable: true, sort: 1, style: "width: 60px;" },
	{ key: "region", label: "Регион", sortable: true, sort: 3, hidden: true },
	{ key: "city", label: "Город", sortable: true, sort: 2 },
	{
		key: "humidity",
		label: "Зона влажности",
		sortable: true,
		style: "width: 100px; text-align: center",
		sort: 4,
		hidden: true,
	},
	{
		key: "minTemp",
		label: "Минимальная",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 5,
		measure: "C°",
	},
	{
		key: "avgTemp",
		label: "Средняя",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 6,
		measure: "C°",
	},
	{
		key: "heatingSeason",
		label: "Отоп. сезон",
		type: "text",
		style: "width: 100px; text-align: center",
		sort: 7,
	},
	{
		key: "roofNorm",
		label: "Нормы кровля",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 8,
		hidden: true,
	},
	{
		key: "wallNorm",
		label: "Нормы стен",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 9,
		hidden: true,
	},
	{
		key: "floorNorm",
		label: "Нормы пол",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 10,
		hidden: true,
	},
];

const pageData = ref([
	{
		id: 1,
		region: "Челябинская область",
		city: "Челябинск",
		humidity: "А",
		minTemp: -37,
		avgTemp: -7.3,
		heatingSeason: 217,
		roofNorm: 3.5,
		wallNorm: 4.6,
		floorNorm: 3.6,
	},
	{
		id: 2,
		region: "Свердловская область",
		city: "Екатеринбург",
		humidity: "А",
		minTemp: -39,
		avgTemp: -8.1,
		heatingSeason: 225,
		roofNorm: 3.8,
		wallNorm: 4.9,
		floorNorm: 3.9,
	},
	{
		id: 3,
		region: "Московская область",
		city: "Москва",
		humidity: "Б",
		minTemp: -30,
		avgTemp: -3.5,
		heatingSeason: 203,
		roofNorm: 3.2,
		wallNorm: 4.1,
		floorNorm: 3.1,
	},
	{
		id: 4,
		region: "Ленинградская область",
		city: "Санкт-Петербург",
		humidity: "Б",
		minTemp: -26,
		avgTemp: -1.8,
		heatingSeason: 198,
		roofNorm: 3.0,
		wallNorm: 3.9,
		floorNorm: 2.9,
	},
	{
		id: 5,
		region: "Краснодарский край",
		city: "Краснодар",
		humidity: "В",
		minTemp: -15,
		avgTemp: 2.1,
		heatingSeason: 145,
		roofNorm: 2.5,
		wallNorm: 3.2,
		floorNorm: 2.4,
	},
	{
		id: 6,
		region: "Ростовская область",
		city: "Ростов-на-Дону",
		humidity: "В",
		minTemp: -18,
		avgTemp: 1.2,
		heatingSeason: 156,
		roofNorm: 2.7,
		wallNorm: 3.4,
		floorNorm: 2.6,
	},
	{
		id: 7,
		region: "Новосибирская область",
		city: "Новосибирск",
		humidity: "А",
		minTemp: -42,
		avgTemp: -9.2,
		heatingSeason: 235,
		roofNorm: 4.1,
		wallNorm: 5.2,
		floorNorm: 4.0,
	},
	{
		id: 8,
		region: "Красноярский край",
		city: "Красноярск",
		humidity: "А",
		minTemp: -45,
		avgTemp: -10.1,
		heatingSeason: 242,
		roofNorm: 4.3,
		wallNorm: 5.4,
		floorNorm: 4.2,
	},
]);

const { searchValue, pagination, tableData, onPageChange } = useTable(
	pageData,
	{
		searchFields: ["region", "city"],
		pageSize: 10,
	}
);

const tableDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		heatingSeason: plural(row.heatingSeason, ["день", "дня", "дней"], true),
	}));
});
</script>
