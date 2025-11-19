<template>
	<div class="p-0">
		<Head title="Расчёты" subtitle="Список всех расчётов">
			<template #actions>
				<RowCounter :value="calculationData.length"/>
				<BaseButton label="Создать расчёт" icon="plus" @click="router.push({name: 'calculation-create'})"/>
			</template>
		</Head>

		<BaseDataTable
			:loading="isLoading"
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownMenu"
			:statuses="statuses"
			customizable
			expandable
			@update:pagination="onPageChange"
			@update:sort="onSortChange"
			@action="menuAction"
			@db-click="editByIndex"
		>
			<template #top-left>
				<BaseSelectButton v-model="filterValue" :options="filterOptions" @update:model-value="onFilterChange"/>
			</template>
			<template #top-right>
				<BaseSearch v-model="searchValue"/>
				<BaseDatePicker
					v-model="filterDates"
					selectionMode="range"
					:manualInput="false"
					placeholder="Период"
					@update:model-value="onDateChange"
				/>
			</template>
			<template #slot-rating="{ data }">
				<div class="flex items-center gap-3 w-full justify-center">
					<TypeColumn :type="data.rating || 1" :types="rating" short class="pt-1"/>
					<TypeColumn :type="data.product || 'all'" :types="productCategory" short/>
				</div>
			</template>
			<template #slot-tags="{ data }">
				<div class="flex flex-wrap gap-1">
					<BaseChip v-for="tag in data.tags" :key="tag" :label="tag"/>
				</div>
			</template>
			<template #expansion="{ data }">
				<CalculationExpansion :id="data.id" />
			</template>
		</BaseDataTable>
	</div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseSearch from "@shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@shared/components/ui/BaseDataTable.vue";
import BaseChip from "@shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import BaseDatePicker from "@shared/components/ui/BaseDatePicker.vue";
import TypeColumn from "@shared/components/TypeColumn.vue";
import Head from "@shared/components/Head.vue";
import RowCounter from "@shared/components/RowCounter.vue";
import {useDropdownMenu} from "../composables/useDropdownMenu.ts";
import {useCalculationData} from "../composables/useCalculationData.ts";
import type {TypeIconDef} from "@shared/types/table.ts";
import type {CalculationItem} from "../types";
import {useTypes} from "@shared/composables/useTypes.ts";
import {useLazyTable} from "@shared/composables/useLazyTable.ts";
import {statuses} from "../composables/useCalculationState.ts";
import type {ActionValue} from "@shared/types/menu.ts";
import {useRouter} from "vue-router";
import {useMessage} from "@shared/composables/useMessage.ts";
import {useCalculationActions} from "../composables/useCalculationActions.ts";
import {useCaseDialog} from "@features/cases";
import CalculationExpansion from "@features/calculations/components/CalculationExpansion.vue";

const {productCategory} = useTypes();
const {dropdownActions} = useDropdownMenu();
const router = useRouter();
const {info, warning} = useMessage();
const {changeStateCalculation, deleteCalculation, copyCalculation, calculationViewPath} = useCalculationActions();
const {openCaseDialog} = useCaseDialog();

const searchFields: (keyof CalculationItem)[] = ["id", "city"];

const rating: TypeIconDef[] = [
	{key: 1, icon: "pi pi-shop", color: "text-gray-300"},
	{key: 2, icon: "pi pi-shop", color: "text-orange-300"},
	{key: 3, icon: "pi pi-shop", color: "text-sky-300"},
	{key: 4, icon: "pi pi-shop", color: "text-lime-400"},
	{key: 5, icon: "pi pi-shop", color: "text-green-600"},
];

const {calculationData, isLoading, loadCalculationData, columns, filterOptions, pagination} = useCalculationData();

const {onPageChange, onDateChange, filterDates, filterValue, onFilterChange, searchValue, onSortChange, reload} =
	useLazyTable<CalculationItem>(loadCalculationData, true, {
		dateField: "date",
		filterField: "status",
		searchFields: searchFields,
		pageSize: 15,
	});

filterValue.value = "all";

const pagedDataTransformed = computed(() => {
	return calculationData.value.map((row: CalculationItem) => ({
		...row,
		cost: row.cost.toLocaleString("ru-RU"),
		date: new Date(row.date),
	}));
});

const dropdownMenu = (id: number) => {
	return dropdownActions
		.map((a) => ({
			...a,
			status: calculationData.value.find((v: CalculationItem) => v.id === id).status || "other",
		}))
		.filter((a) => {
			return !("name" in a) || a.name !== "public" || (a.status !== "published" && a.status !== "case");
		})
		.filter((a) => {
			return (
				!("name" in a) ||
				(a.name !== "view" && a.name !== "pdf" && a.name !== "link") ||
				a.status === "published" ||
				a.status === "case"
			);
		})
		.filter((a) => {
			return !("name" in a) || a.name !== "draft" || a.status !== "hidden";
		})
		.filter((a) => {
			return !("name" in a) || a.name !== "case" || a.status === "published";
		});
};

const openPath = (name: string, id: number) => {
	const path = router.resolve({name, params: {id}});
	window.open(path.href, "_blank");
};

const publicCalculation = async (id: number) => {
	changeStateCalculation(id, "published", `Расчёт ${id} опубликован`)
		.then(() => reload())
		.catch(() => warning(`Не удалось сменить статус расчёта ${id}`, 5000));
};

const draftCalculation = async (id: number) => {
	changeStateCalculation(id, "hidden", `Расчёт ${id} скрыт`)
		.then(() => reload())
		.catch(() => warning(`Не удалось сменить статус расчёта ${id}`, 5000));
};

const editByIndex = (index: number) => {
	const id = calculationData.value[index].id;
	void router.push({name: "calculation", params: {id}});
}

const menuAction = async ({id, action}: ActionValue) => {
	if (id === undefined) {
		return;
	}

	switch (action) {
		case "edit":
			void router.push({name: "calculation", params: {id}});
			break;
		case "view":
			openPath("calculation-view", id);
			break;
		case "pdf":
			openPath("calculation-pdf", id);
			break;
		case "link":
			const path = await calculationViewPath(id);
			if(!path){
				warning(`Ссылка на расчёт ${id} не доступна`, 5000);
				return;
			}
			if(window.isSecureContext){
				void navigator.clipboard.writeText(path);
			}else{
				console.log(path);
			}
			info("", 3000, "Ссылка скопирована");
			break;
		case "public":
			void publicCalculation(id);
			break;
		case "draft":
			void draftCalculation(id);
			break;
		case "case":
			openCaseDialog({
				calculation: id,
				onSave: () => router.push({name: 'cases'})
			});
			break;
		case "copy":
			copyCalculation(id)
				.then(() => reload())
				.catch(() => warning(`Не удалось скопировать расчёт ${id}`, 5000));
			break;
		case "delete":
			deleteCalculation(id)
				.then(() => reload())
				.catch(() => warning(`Не удалось удалить расчёт ${id}`, 5000));
			break;
	}
};
</script>
