<template>
	<div class="p-0">
		<Head
			title="Оборудование"
			subtitle="Список доступного отопительного оборудования"
		>
			<template #actions>
				<RowCounter :value="equipmentData.length"/>
				<BaseButton label="Добавить" icon="plus" @click="openEquipmentDialog()"/>
			</template>
		</Head>

		<BaseDataTable
			:loading="isLoading"
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownMenu"
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
			<template #slot-status="{ data }">
				<TypeColumn :type="data.status" :types="statuses" short/>
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
			<template #slot-characteristics="{ value }">
				<template v-for="property in value.split(';')">
					<span class="block text-sm">{{property}}</span>
				</template>
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
		<ConfirmDialog/>
	</div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, defineAsyncComponent} from "vue";
import Head from "@shared/components/SubHead.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import RowCounter from "@shared/components/RowCounter.vue";
import BaseSearch from "@shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@shared/components/ui/BaseDataTable.vue";
import BaseChip from "@shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import TypeColumn from "@shared/components/TypeColumn.vue";
import type {TypeIconDef} from "@shared/types/table";
import {dropdownActions} from "@features/directories/composables/useProductDropdownMenu";
import {useTable} from "@shared/composables/useTable";
import {useTypes} from "@shared/composables/useTypes";
import {useEquipmentData} from "@features/directories/composables/useEquipmentData";
import type {EquipmentItem} from "@features/directories/types/equipment";
import {useConfirm} from "@shared/composables/useConfirm.ts";
import type {DynamicDialogInstance} from "primevue/dynamicdialogoptions";
import {useDialog} from "primevue";
import {useMessage} from "@shared/composables/useMessage.ts";
import ConfirmDialog from "primevue/confirmdialog";
import type {ActionValue} from "@shared/types/menu.ts";
import {useEquipmentAction} from "@features/directories/composables/useEquipmentAction.ts";

const ProxyDialog = defineAsyncComponent(() => import("@shared/components/ProxyDialog.vue"));

const filterValue = ref("all");

let openDialog: DynamicDialogInstance;

const dialog = useDialog();
const {warning} = useMessage();
const {confirmDelete} = useConfirm();

const {productCategory} = useTypes();

const onFilterChange = (value: string) => {
	filterValue.value = value;
	loadEquipmentData(value);
};

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

const {equipmentData, isLoading, loadEquipmentData, columns, filterOptions} =
	useEquipmentData();

const {searchValue, pagination, tableData, onPageChange, onSortChange} =
	useTable<EquipmentItem>(equipmentData, {
		searchFields: ["name", "category", "article"],
		pageSize: 10,
	});

const {dropEquipment, changeStateEquipment} = useEquipmentAction();

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		price: row.price.toLocaleString("ru-RU"),
	}));
});

onMounted(() => {
	loadEquipmentData();
});

const dropdownMenu = (id: number) => {
	return dropdownActions
		.map((a) => ({
			...a,
			status: equipmentData.value.find((v: EquipmentItem) => v.id === id).status || "hidden",
		}))
		.filter((a) => {
			return !("name" in a) || a.name !== "public" || a.status !== "published"
		})
		.filter((a) => {
			return !("name" in a) || a.name !== "hide" || a.status !== "hidden";
		});
};

const openEquipmentDialog = (id?: number) => {
	openDialog = dialog.open(ProxyDialog, {
		props: {
			header: "Оборудование",
			showHeader: false,
			style: {
				width: "40vw",
			},
			modal: true,
		},
		data: {
			component: defineAsyncComponent(() => import("../components/Equipment.vue")),
			props: {
				id,
			},
			actions: {
				close: () => {
					openDialog.close();
				},
				save: () => {
					openDialog.close();
					loadEquipmentData();
				},
			},
		},
	});
};

const menuActions = ({id, action}: ActionValue) => {
	switch (action) {
		case "edit":
			openEquipmentDialog(id);
			break;
		case 'public':
			changeStateEquipment(id, 'published')
				.then(() => {
					loadEquipmentData();
				})
				.catch(() => warning(`Не удалось опубликовать ${id}`, 5000));
			break;
		case 'hide':
			changeStateEquipment(id, 'hidden')
				.then(() => {
					loadEquipmentData();
				})
				.catch(() => warning(`Не удалось скрыть ${id}`, 5000));
			break;
		case "delete":
			confirmDelete(null).then(() => {
				dropEquipment(id)
					.then(() => {
						loadEquipmentData();
					})
					.catch(() => warning(`Не удалось удалить ${id}`, 5000));
			});
			break;
	}
};
</script>
