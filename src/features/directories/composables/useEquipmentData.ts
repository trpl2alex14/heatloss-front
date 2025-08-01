import type { EquipmentItem } from "@features/directories/types/equipment";
import { useFetchCollection, type RequestDataOptions } from "@/shared/composables/useFetchCollection";
import { route } from "@/shared/utils/router";
import type { ColumnDef } from "@/shared/types/table";

const columns: ColumnDef[] = [
	{
		key: "status",
		label: "",
		type: "slot",
		style: "width: 20px;",
		sort: 1,
	},
	{
		key: "photo",
		label: "Фото",
		type: "slot",
		style: "width: 80px;",
		hidden: true,
		sort: 2,
	},
	{
		key: "product",
		label: "Продукт",
		type: "slot",
		sortable: true,
		style: "width: 100px;",
		sort: 3,
	},
	{
		key: "category",
		label: "Категория",
		sortable: true,
		sort: 4,
		hidden: true,
	},
	{
		key: "name",
		label: "Название",
		sortable: true,
		sort: 5,
	},
	{
		key: "article",
		label: "Артикул",
		style: "width: 100px;",
		sort: 6,
		hidden: true,
	},
	{
		key: "price",
		label: "Стоимость",
		type: "number",
		sortable: true,
		style: "width: 90px; text-align: right",
		measure: "₽",
		sort: 7,
	},
	{
		key: "characteristics",
		label: "Характеристики",
		sort: 8,
		hidden: true,
	},
	{
		key: "tags",
		label: "Тэги",
		type: "slot",
		hidden: true,
		sort: 9,
	},
];

const filterOptions = [
	{ label: "Флэйт", value: "fleyt" },
	{ label: "Коузи", value: "kouzi" },
	{ label: "Все", value: "all" },
];

export const useEquipmentData = () => {
	const {
		data: equipmentData,
		isLoading,
		error,
		loadData,
		clearError,
	} = useFetchCollection<EquipmentItem>(route("directories.equipment"));

	const loadEquipmentData = (filterValue?: string) => {
		const params: RequestDataOptions<EquipmentItem> = {};
		if(filterValue && filterValue !== "all"){
			params.filter = {
				product: filterValue,
			};
		}		

		loadData(params);
	};

	return {
		columns,
		filterOptions,
		equipmentData,
		isLoading,
		error,
		loadEquipmentData,
		clearEquipmentError: clearError,
	};
};
