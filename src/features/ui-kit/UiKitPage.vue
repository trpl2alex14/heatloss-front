<template>
	<div class="p-0">
		<Head title="Head" subtitle="Общий компонент заголовка раздела">
			<template #actions>
				<BaseButton label="Действие" />
			</template>
		</Head>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">BaseSelectButton ({{ selectValue as string }})</h2>			
			<BaseSelectButton
				v-model="selectValue"
				:options="selectOptions"
			/>
		</section>

		<div class="flex items-center gap-2">
			<Button label="1 of 15" class="!whitespace-nowrap" variant="outlined" severity="secondary" />
			<Button icon="pi pi-chevron-left" variant="outlined" severity="secondary" />
			<Button icon="pi pi-chevron-right" variant="outlined" severity="secondary" />
		</div>


		<section class="mb-8">
			<h2 class="text-xl font-semibold mb-2">BaseDataTable</h2>
			<BaseDataTable
				:columns="columns"
				:data="tableData"
				:pagination="pagination"
				:loading="false"
				@update:pagination="(val) => (pagination = val)"
			/>
		</section>
		<section class="mb-8">
			<h2 class="text-xl font-semibold mb-2">BaseTableFilters</h2>
			<BaseTableFilters>
				<input class="p-inputtext p-component" placeholder="Поиск..." />
			</BaseTableFilters>
		</section>
		<section>
			<h2 class="text-xl font-semibold mb-2">BaseDropdownMenu</h2>
			<BaseDropdownMenu :actions="dropdownActions" />
		</section>

	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Head from "@/shared/components/Head.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseTableFilters from "@/shared/components/ui/BaseTableFilters.vue";
import BaseDropdownMenu from "@/shared/components/ui/BaseDropdownMenu.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";

const columns = [
	{ key: "name", label: "Название", sortable: true },
	{ key: "value", label: "Значение", sortable: false },
];
const tableData = ref([
	{ name: "Пример 1", value: 123 },
	{ name: "Пример 2", value: 456 },
]);
const pagination = ref({ page: 1, pageSize: 10, total: 2 });

const dropdownActions = [
	{
		label: "Действие 1",
		icon: "pi pi-check",
		command: () => alert("Действие 1"),
	},
	{
		label: "Действие 2",
		icon: "pi pi-times",
		command: () => alert("Действие 2"),
	},
];

const selectOptions = [
	{ label: "Все", value: "all" },
	{ label: "Опубликованы", value: "published" },
	{ label: "Черновики", value: "drafts" },
	{ label: "Кейсы", value: "cases" },
];
const selectValue = ref("all");
</script>
