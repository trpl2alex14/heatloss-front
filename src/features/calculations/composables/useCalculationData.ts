import type { CalculationItem } from "@features/calculations/types/calculation";
import {
	useApiData,
	type RequestDataOptions,
} from "@/shared/composables/useApiData";
import { route } from "@/shared/utils/router";
import type { ColumnDef } from "@/shared/types/table";

const columns: ColumnDef[] = [
	{
		key: "rating",
		label: "Рейтинг",
		type: "slot",
		style: "width: 60px; text-align: center;",
		sort: 2,
	},
	{
		key: "id",
		label: "Номер",
		type: "text",
		sortable: true,
		style: "width: 80px;",
		sort: 3,
	},
	{
		key: "area",
		label: "Площадь",
		type: "number",
		sortable: true,
		style: "width: 80px; text-align: right",
		measure: "м²",
		sort: 5,
	},
	{
		key: "city",
		label: "Город",
		sortable: true,
		style: "",
		sort: 6,
	},
	{
		key: "cost",
		label: "Стоимость",
		type: "number",
		sortable: true,
		style: "width: 110px; text-align: right",
		measure: "₽",
		sort: 7,
		hidden: true,
	},
	{
		key: "power",
		label: "Мощность",
		type: "number",
		sortable: true,
		style: "width: 80px;text-align: right",
		measure: "кВт",
		sort: 8,
		hidden: true,
	},
	{
		key: "consumption",
		label: "Потребление",
		type: "number",
		sortable: true,
		style: "width: 110px;text-align: right;white-space: nowrap",
		measure: "кВт*Ч в мес.",
		sort: 8,
		hidden: true,
	},
	{
		key: "status",
		label: "Статус",
		type: "status",
		sortable: true,
		style: "width: 100px;white-space: nowrap",
		sort: 4,
	},
	{
		key: "tags",
		label: "Тэги",
		type: "slot",
		style: "",
		sort: 10,
		hidden: true,
	},
	{
		key: "date",
		label: "Дата",
		type: "date",
		sortable: true,
		style: "width: 100px;",
		sort: 11,
	},
];

const filterOptions = [
	{ label: "Все", value: "all" },
	{ label: "Опубликованы", value: "published" },
	{ label: "Черновики", value: "working" },
	{ label: "Кейсы", value: "case" },
];

export const useCalculationData = () => {
	const {
		data: calculationData,
		isLoading,
		error,
		loadData,
		clearError,
		pagination,
	} = useApiData<CalculationItem>(route("calculations"), false);

	const loadCalculationData = (params?: RequestDataOptions<CalculationItem>) => {
		loadData(params);
	};

	return {
		columns,
		filterOptions,
		calculationData,
		isLoading,
		error,
		loadCalculationData,
		clearCalculationError: clearError,
		pagination,
	};
};
