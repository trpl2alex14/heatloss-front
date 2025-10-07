<template>
	<div class="p-0">
		<Head
			title="Кейсы"
			subtitle="Список подготовленных кейсов для публикации на сайте"
		>
			<template #actions>
				<RowCounter :value="caseData.length" />
				<BaseButton label="Создать кейс" icon="plus" />
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
		>
			<template #top-left>
				<BaseSelectButton
					v-model="filterValue"
					:options="filterOptions"
					@update:model-value="onFilterChange"
				/>
			</template>
			<template #top-right>
				<BaseSearch v-model="searchValue" />
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
				<TypeColumn :type="data.category" :types="categoryTypes" />
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
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseSearch from "@shared/components/ui/BaseSearch.vue";
import BaseDataTable from "@shared/components/ui/BaseDataTable.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import CalculationBtn from "@shared/components/CalculationBtn.vue";
import TypeColumn from "@shared/components/TypeColumn.vue";
import Head from "@shared/components/Head.vue";
import RowCounter from "@shared/components/RowCounter.vue";
import { dropdownActions } from "../composables/useDropdownMenu";
import { useCaseData } from "../composables/useCaseData";
import type { TypeImageDef, TypeLabelDef } from "@shared/types/table";
import type { CaseItem, CaseStatus } from "../types/case";
import { useTypes } from "@shared/composables/useTypes";
import { useLazyTable } from "@shared/composables/useLazyTable";
import BuildingIcon from "@assets/icons/building.svg";
import HouseIcon from "@assets/icons/house.svg";
import FactoryIcon from "@assets/icons/factory.svg";

const { productCategory } = useTypes();

const searchFields: (keyof CaseItem)[] = ["id", "city", "label"];

const statuses: TypeLabelDef[] & { key: CaseStatus }[] = [
	{ key: "published", label: "Опубликован", type: "success" },
	{ key: "hide", label: "Скрыт", type: "secondary" },
];

const categoryTypes: TypeImageDef[] = [
	{
		key: 3,
		label: "Коммерческие",
		image: FactoryIcon,
	},
	{
		key: 2,
		label: "Частные дома",
		image: HouseIcon,
	},
	{
		key: 1,
		label: "Квартиры, лоджии",
		image: BuildingIcon,
	},
];

const {
	caseData,
	isLoading,
	loadCaseData,
	columns,
	filterOptions,
	pagination,
} = useCaseData();

const { onPageChange, filterValue, onFilterChange, searchValue, onSortChange } =
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
</script>
