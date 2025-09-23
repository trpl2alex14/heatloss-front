<template>
	<div class="p-0">
		<Head title="Заявки" subtitle="Список входящих заявок на расчётов отопления">
			<template #actions>
				<RowCounter :value="requestData.length" />
				<BaseButton label="Создать заявку" icon="plus" />
			</template>
		</Head>

		<BaseDataTable
			:loading="isLoading"
			:columns="columns"
			:data="pagedDataTransformed"
			:pagination="pagination"
			:actions="dropdownActions"
			:statuses="statuses"
			customizable
			@update:pagination="onPageChange"
			@update:sort="onSortChange"
			@action="menuActions"
		>
			<template #top-left>
				<BaseSelectButton v-model="filterValue" :options="filterOptions" @update:model-value="onFilterChange" />
			</template>
			<template #top-right>
				<BaseSearch v-model="searchValue" />
				<BaseDatePicker
					v-model="filterDates"
					selectionMode="range"
					:manualInput="false"
					placeholder="Период"
					@update:model-value="onDateChange"
				/>
			</template>
			<template #slot-product="{ data }">
				<div class="flex items-center gap-3 w-full justify-center">
					<TypeColumn :type="data.product || 'all'" :types="productCategory" short />
				</div>
			</template>
			<template #slot-status="{ data }">
				<TypeColumn :type="data.status" :types="statuses" short />
			</template>
			<template #slot-progress="{ data }">
				<CalculationBtn v-if="typeof data?.progress === 'object'" :data="data?.progress" />
				<BaseProgressBar v-else :value="data?.progress" style="height: 1rem; max-width: 10rem">
					<template #compleat>
						<CalculationBtn :data="data?.progress" />
					</template>
				</BaseProgressBar>
			</template>
			<template #slot-area="{ data, col }">
				{{ data.area }}
				<span v-if="data[col.key] && col.measure" class="text-sm text-gray-300">{{ col.measure }}</span
				><br />
				<span class="text-gray-500 text-sm"
					>{{ data.floors }} {{ plural(data.floors, ["этаж", "этажа", "этажей"]) }}</span
				>
			</template>
			<template #slot-tags="{ data }">
				<div class="flex flex-wrap gap-1">
					<BaseChip v-for="tag in data.tags" :key="tag" :label="tag" />
				</div>
			</template>
		</BaseDataTable>		
		<ConfirmDialog />
	</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw } from "vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import BaseProgressBar from "@/shared/components/ui/BaseProgressBar.vue";
import CalculationBtn from "@/shared/components/CalculationBtn.vue";
import TypeColumn from "@/shared/components/TypeColumn.vue";
import Head from "@/shared/components/Head.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
import { dropdownActions } from "../composables/useDropdownMenu";
import { useRequestData } from "../composables/useRequestData";
import type { RequestItem } from "../types/request";
import { useTypes } from "@/shared/composables/useTypes";
import { useLazyTable } from "@/shared/composables/useLazyTable";
import { plural } from "@shared/utils/text";
import type { ActionValue } from "@/shared/types/menu.ts";
import { useRouter } from "vue-router";
import { useMessage } from "@/shared/composables/useMessage.ts";
import { useApiRequest } from "@/shared/composables/useApiRequest";
import { useDialog } from "primevue/usedialog";
import { useStatus } from "../composables/useStatus";
import { useConfirm } from "@/shared/composables/useConfirm";
import ConfirmDialog from 'primevue/confirmdialog';

const { confirmDelete } = useConfirm();

const dialog = useDialog();

const RequestDetails = defineAsyncComponent(() => import("./RequestDetails.vue"));
const RequestAction = defineAsyncComponent(() => import("./RequestActions.vue"));

const { info, warning } = useMessage();

const { productCategory } = useTypes();

const { drop } = useApiRequest();

const router = useRouter();

const searchFields: (keyof RequestItem)[] = ["id", "city", "client"];

const statuses = useStatus();

const { requestData, isLoading, loadRequestData, columns, filterOptions, pagination } = useRequestData();

const { onPageChange, onDateChange, filterDates, filterValue, onFilterChange, searchValue, onSortChange, reload } =
	useLazyTable<RequestItem>(loadRequestData, true, {
		dateField: "date",
		filterField: "status",
		searchFields: searchFields,
		pageSize: 15,
	});

filterValue.value = "all";

const pagedDataTransformed = computed(() => {
	return requestData.value.map((row: RequestItem) => ({
		...row,
		date: new Date(row.date),
		progress:
			row.progress === 100 && row.calculation
				? {
						url: `/calculations/${row.calculation}`,
						label: `${row.calculation}`,
				  }
				: row.progress,
	}));
});

const dropRequest = (id: number) => {
	drop("api-request", { id })
		.then((value) => {
			value && info("", 5000, `Заявка ${value.id} удалена`);
			reload();
		})
		.catch(() => warning(`Не удалось удалить заявку ${id}`, 5000));
};

const menuActions = ({ id, action }: ActionValue) => {
	switch (action) {
		case "view":
			dialog.open(RequestDetails, {
				props: {
					header: "Заявка на расчёт № " + id,
					style: {
						width: "65vw",
					},
					modal: true,
				},
				data: {
					id,
				},
				templates: {
					footer: markRaw(RequestAction),
				},
				emits: {
					onDelete: () => {
						dropRequest(id);
					},
					onCreate: () => {
						router.push({ name: "calculation-create", query: { request: id } });
					},
				},
			});
			break;
		case "create":
			router.push({ name: "calculation-create", query: { request: id } });
			break;
		case "delete":
			confirmDelete(null).then(()=> {
				dropRequest(id);
			});
			break;
	}
};
</script>
