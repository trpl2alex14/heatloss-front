<template>
	<div class="p-0">
		<Head title="Климатология" subtitle="Справочник населенный пунктов с данными по климату">
			<template #actions>
				<RowCounter :value="climateData.length" />
				<BaseButton label="Добавить" icon="plus" @click="openClimateDialog()"/>
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
			<template #top-left> </template>
			<template #top-right>
				<BaseSearch v-model="searchValue" />
			</template>
		</BaseDataTable>
		<ConfirmDialog />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from "vue";
import Head from "@/shared/components/SubHead.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import { useTable } from "@/shared/composables/useTable";
import { useClimateData } from "@features/directories/composables/useClimateData";
import { plural } from "@/shared/utils/text";
import { dropdownActions } from "@/features/directories/composables/useClimateDropdownMenu";
import type { ClimateItem } from "@/features/directories/types/climate";
import type { ActionValue } from "@/shared/types/menu";
import { useConfirm } from "@/shared/composables/useConfirm";
import ConfirmDialog from "primevue/confirmdialog";
import { useMessage } from "@/shared/composables/useMessage";
import { useApiRequest } from "@/shared/composables/useApiRequest";
import { useDialog } from "primevue/usedialog";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const ProxyDialog = defineAsyncComponent(() => import("@/shared/components/ProxyDialog.vue"));

const dialog = useDialog();

const { info, warning } = useMessage();
const { drop } = useApiRequest();
const { confirmDelete } = useConfirm();

const { climateData, isLoading, columns, loadClimateData } = useClimateData();

const { searchValue, pagination, tableData, onPageChange, onSortChange } = useTable<ClimateItem>(climateData, {
	searchFields: ["region", "city"],
	pageSize: 15,
});

const pagedDataTransformed = computed(() => {
	return tableData.value.map((row) => ({
		...row,
		heatingSeason: plural(row.heatingSeason, ["день", "дня", "дней"], true),
	}));
});

let openDialog: DynamicDialogInstance;

onMounted(() => {
	loadClimateData();
});

const dropClimate = (id: number) => {
	drop("api-climate", { id })
		.then((value) => {
			value && info("", 5000, `Город/регион ${value.id} удален`);
			loadClimateData();
		})
		.catch(() => warning(`Не удалось удалить ${id}`, 5000));
};

const openClimateDialog = (id?: number) => {
	openDialog = dialog.open(ProxyDialog, {
		props: {
			header: "Климат зоны",
			showHeader: false,
			style: {
				width: "40vw",
			},
			modal: true,
		},
		data: {
			component: defineAsyncComponent(() => import("../components/Climate.vue")),
			props: {
				id,
			},
			actions: {
				close: () => {
					openDialog.close();
				},
				save: () => {
					openDialog.close();
					loadClimateData();
				},
			},
		},
	});
};

const menuActions = ({ id, action }: ActionValue) => {
	switch (action) {
		case "edit":
			openClimateDialog(id);
			break;
		case "delete":
			confirmDelete(null).then(() => {
				dropClimate(id);
			});
			break;
	}
};
</script>
