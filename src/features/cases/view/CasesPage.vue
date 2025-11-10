<template>
	<div class="p-0">
		<Head
			title="Кейсы"
			subtitle="Список подготовленных кейсов для публикации на сайте"
		>
			<template #actions>
				<RowCounter :value="caseData.length"/>
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
			@update:pagination="onPageChange"
			@update:sort="onSortChange"
			@action="menuActions"
		>
			<template #top-left>
				<BaseSelectButton
					v-model="filterValue"
					:options="filterOptions"
					@update:model-value="onFilterChange"
				/>
			</template>
			<template #top-right>
				<BaseSearch v-model="searchValue"/>
			</template>
			<template #slot-image="{ data }">
				<img
					v-if="data.image"
					:src="data.image"
					alt="Фото"
					class="w-20 h-20 object-cover rounded"
				/>
			</template>
			<template #slot-product="{ data }">
				<TypeColumn
					:type="data.product || 'all'"
					:types="productCategory"
					short
				/>
			</template>
			<template #slot-category="{ data }">
				<TypeColumn :type="data.category" :types="categoryTypes"/>
			</template>
			<template #slot-calculation="{ data }">
				<CalculationBtn
					v-if="data?.calculation"
					:data="{
						url: `/calculations/${data.calculation}`,
						label: `${data.calculation}`,
					}"
				/>
			</template>
		</BaseDataTable>
		<ConfirmDialog/>
	</div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import BaseSearch from "@shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@shared/components/ui/BaseDataTable.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import CalculationBtn from "@shared/components/CalculationBtn.vue";
import TypeColumn from "@shared/components/TypeColumn.vue";
import Head from "@shared/components/Head.vue";
import RowCounter from "@shared/components/RowCounter.vue";
import {dropdownActions} from "../composables/useDropdownMenu.ts";
import {useCaseData} from "../composables/useCaseData.ts";
import type {TypeLabelDef} from "@shared/types/table.ts";
import {type CaseItem, type CaseStatus} from "../types/CaseTypes.ts";
import {useTypes} from "@shared/composables/useTypes.ts";
import {useLazyTable} from "@shared/composables/useLazyTable.ts";
import type {ActionValue} from "@shared/types/menu.ts";
import {useConfirm} from "@shared/composables/useConfirm.ts";
import {useMessage} from "@shared/composables/useMessage.ts";
import {useCaseAction} from "@features/cases/composables/useCaseAction.ts";
import ConfirmDialog from "primevue/confirmdialog";
import {useCaseDialog} from "@features/cases/composables/useCaseDialog.ts";

const {productCategory} = useTypes();
const {confirmDelete} = useConfirm();
const {warning} = useMessage();
const {changeStateCase, dropCase} = useCaseAction();

const {openCaseDialog} = useCaseDialog();

const searchFields: (keyof CaseItem)[] = ["id", "city", "label"];

const statuses: TypeLabelDef[] & { key: CaseStatus }[] = [
	{key: "published", label: "Опубликован", type: "success"},
	{key: "hidden", label: "Скрыт", type: "secondary"},
];

const {
	caseData,
	isLoading,
	loadCaseData,
	columns,
	filterOptions,
	pagination,
	categoryTypes
} = useCaseData();

const {onPageChange, filterValue, onFilterChange, searchValue, onSortChange, reload} =
	useLazyTable<CaseItem>(loadCaseData, true, {
		filterField: "status",
		searchFields: searchFields,
		pageSize: 15,
	});

filterValue.value = "all";

const pagedDataTransformed = computed(() => {
	return caseData.value.map((row: CaseItem) => ({
		...row,
		cost: row.cost.toLocaleString("ru-RU"),
	}));
});

const dropdownMenu = (id: number) => {
	return dropdownActions
		.map((a) => ({
			...a,
			status: caseData.value.find((v: CaseItem) => v.id === id).status || "hidden",
		}))
		.filter((a) => {
			return !("name" in a) || a.name !== "public" || a.status !== "published"
		})
		.filter((a) => {
			return !("name" in a) || a.name !== "hide" || a.status !== "hidden";
		});
};

const menuActions = ({id, action}: ActionValue) => {
	if (!id) {
		return;
	}

	switch (action) {
		case "edit":
			openCaseDialog({
				id,
				onSave: () => reload()
			});
			break;
		case 'public':
			changeStateCase(id, 'published')
				.then(() => reload())
				.catch(() => warning(`Не удалось опубликовать ${id}`, 5000));
			break;
		case 'hide':
			changeStateCase(id, 'hidden')
				.then(() => reload())
				.catch(() => warning(`Не удалось скрыть ${id}`, 5000));
			break;
		case "delete":
			confirmDelete(null).then(() => {
				dropCase(id)
					.then(() => reload())
					.catch(() => warning(`Не удалось удалить ${id}`, 5000));
			});
			break;
	}
};
</script>
