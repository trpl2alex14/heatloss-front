<template>
	<div class="p-0">
		<Head
			title="Огр. конструкции"
			subtitle="Справочник материалов и ограждающих конструкций"
		>
			<template #actions>
				<RowCounter :value="materialData.length"/>
				<BaseButton label="Добавить" icon="plus" @click="openMaterialDialog()"/>
			</template>
		</Head>

		<BaseDataTable
			:loading="isLoading"
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownActions"
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
					<BaseChip v-for="s in data.surface" :key="s" :label="getLabelSurface(s)"/>
				</div>
			</template>
			<template #slot-type="{ data }">
				<TypeIcon :type="data.type" :types="materialTypes" short/>
			</template>
		</BaseDataTable>
		<ConfirmDialog/>
	</div>
</template>

<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, ref} from "vue";
import Head from "@shared/components/SubHead.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import RowCounter from "@shared/components/RowCounter.vue";
import BaseSearch from "@shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@shared/components/ui/BaseDataTable.vue";
import BaseChip from "@shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import TypeIcon from "@shared/components/TypeColumn.vue";
import {dropdownActions} from "@features/directories/composables/useMaterialDropdownMenu";
import {useTable} from "@shared/composables/useTable";
import {useTypes} from "@shared/composables/useTypes";
import {useMaterialData} from "@features/directories/composables/useMaterialData";
import type {MaterialItem} from "@features/directories/types";
import {useDialog} from "primevue/usedialog";
import type {DynamicDialogInstance} from "primevue/dynamicdialogoptions";
import type {ActionValue} from "@shared/types/menu.ts";
import {useApiRequest} from "@shared/composables/useApiRequest.ts";
import {useConfirm} from "@shared/composables/useConfirm.ts";
import {useMessage} from "@shared/composables/useMessage.ts";
import ConfirmDialog from "primevue/confirmdialog";

const ProxyDialog = defineAsyncComponent(() => import("@shared/components/ProxyDialog.vue"));

const filterValue = ref("all");

let openDialog: DynamicDialogInstance;

const dialog = useDialog();
const {materialTypes, typeSurfaces} = useTypes();
const {info, warning} = useMessage();
const {drop} = useApiRequest();
const {confirmDelete} = useConfirm();
const onFilterChange = (value: string) => {
	filterValue.value = value;
	loadMaterialData(value);
};

const {materialData, isLoading, loadMaterialData, columns, filterOptions} =
	useMaterialData();

const {searchValue, pagination, tableData, onPageChange, onSortChange} =
	useTable<MaterialItem>(materialData, {
		searchFields: ["name", "category"],
		pageSize: 10,
	});

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		value: row.a || row.b ? `${row.a ?? "-"}/${row.b ?? "-"}` : "-",
	}));
});

onMounted(() => {
	loadMaterialData();
});

const getLabelSurface = (key: string) => {
	return typeSurfaces.find((v) => v.value === key)?.label || key;
}

const dropMaterial = (id: number) => {
	drop("api-material", {id})
		.then((value) => {
			value && info("", 5000, `Материал ${value.id} удален`);
			loadMaterialData();
		})
		.catch(() => warning(`Не удалось удалить ${id}`, 5000));
};

const openMaterialDialog = (id?: number) => {
	openDialog = dialog.open(ProxyDialog, {
		props: {
			header: "Материалы и конструкции",
			showHeader: false,
			style: {
				width: "40vw",
			},
			modal: true,
		},
		data: {
			component: defineAsyncComponent(() => import("../components/Material.vue")),
			props: {
				id,
			},
			actions: {
				close: () => {
					openDialog.close();
				},
				save: () => {
					openDialog.close();
					loadMaterialData();
				},
			},
		},
	});
};

const menuActions = ({id, action}: ActionValue) => {
	switch (action) {
		case "edit":
			openMaterialDialog(id);
			break;
		case "delete":
			confirmDelete(null).then(() => {
				dropMaterial(id);
			});
			break;
	}
};
</script>
