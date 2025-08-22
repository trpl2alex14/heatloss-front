import type { MaterialItem } from "@features/directories/types/materials";
import { useFetchCollection, type RequestDataOptions } from "@/shared/composables/useFetchCollection";
import { route } from "@/shared/utils/router";
import type { ColumnDef } from "@/shared/types/table";
import { MaterialType } from "@features/directories/types/materials";
import { computed } from "vue";

const columns: ColumnDef[] = [
	{ key: "name", label: "Название", sortable: true, sort: 2 },
	{ key: "category", label: "Категория", sortable: true, sort: 4 },
	{
		key: "photo",
		label: "Фото",
		type: "slot",
		style: "width: 80px;",
		hidden: true,
		sort: 1,
	},
	{
		key: "type",
		label: "Тип",
		type: "slot",
		sortable: true,
		style: "width: 60px; text-align: center",
		sort: 3,
	},
	{
		key: "value",
		label: "Коэфф. (А/Б)",
		type: "text",
		style: "width: 110px; text-align: right; white-space: nowrap;",
		sort: 5,
	},
	{
		key: "r",
		label: "Сопротивление",
		type: "number",
		style: "width: 120px; text-align: right",
		measure: "м²*С/Вт",
		sort: 6,
	},
	{
		key: "surface",
		label: "Поверхность",
		type: "slot",
		hidden: true,
		sort: 10,
	},
];

const filterOptions = [
	{ label: "Все", value: "all" },
	{ label: "Конструкции", value: MaterialType.Construction },
	{ label: "Материалы", value: MaterialType.Material },
];

export const useMaterialData = () => {
	const {
		data: materialData,
		isLoading,
		error,
		loadData,
		clearError,
	} = useFetchCollection<MaterialItem>(route("directories.materials"), false);

	const loadMaterialData = (filterValue?: string) => {
		const params: RequestDataOptions<MaterialItem> = {};
		if(filterValue && filterValue !== "all"){
			params.filter = {
				category: filterValue,
			};
		}

		loadData(params);
	};

	return {
		columns,
		filterOptions,
		materialData,
		isLoading: computed(() => isLoading.value || materialData.value.length === 0),
		error,
		loadMaterialData,
		clearMaterialError: clearError,
	};
};
