import type { CaseItem } from "@features/cases/types/case";
import {
	useFetchCollection,
	type RequestDataOptions,
} from "@shared/composables/useFetchCollection";
import type { ColumnDef } from "@shared/types/table";

const columns: ColumnDef[] = [
	{
		key: "product",
		label: "",
		type: "slot",
		style: "width: 50px; text-align: center;",
		sort: 1,
	},
	{
		key: "status",
		label: "Статус",
		type: "status",
		sortable: true,
		style: "width: 100px; white-space: nowrap",
		sort: 2,
	},
	{
		key: "calculation",
		label: "Расчёт",
		sortable: true,
		type: "slot",
		style: "width: 100px;",
		sort: 3,
	},
	{
		key: "category",
		label: "Категория",
		sortable: true,
		type: "slot",
		style: "width: 190px;",
		sort: 4,
		hidden: true,
	},
	{
		key: "image",
		label: "Фото",
		type: "slot",
		style: "width: 150px; height: 84px;",
		sort: 5,
		hidden: true,
	},
	{
		key: "area",
		label: "Площадь",
		type: "number",
		sortable: true,
		style: "width: 90px; text-align: right",
		measure: "м²",
		sort: 7,
	},
	{
		key: "label",
		label: "Заголовок",
		style: "max-width: 150px;",
		sort: 6,
		hidden: true,
	},
	{
		key: "city",
		label: "Город",
		sortable: true,
		style: "max-width: 150px;",
		sort: 11,
	},
	{
		key: "cost",
		label: "Стоимость",
		type: "number",
		sortable: true,
		style: "width: 90px; text-align: right",
		measure: "₽",
		sort: 8,
	},
	{
		key: "power",
		label: "Мощность",
		type: "number",
		sortable: true,
		style: "width: 90px; text-align: right",
		measure: "кВт",
		sort: 9,
	},
	{
		key: "consumption",
		label: "Расходы",
		type: "number",
		sortable: true,
		style: "width: 90px; text-align: right",
		measure: "₽",
		sort: 10,
	},
];

const filterOptions = [
	{ label: "Все", value: "all" },
	{ label: "Опубликованы", value: "published" },
	{ label: "Скрытые", value: "hide" },
];

export const useCaseData = () => {
	const {
		data: caseData,
		isLoading,
		error,
		loadData,
		clearError,
		pagination,
	} = useFetchCollection<CaseItem>({ name: 'api-cases' }, false);

	const loadCaseData = (params?: RequestDataOptions<CaseItem>) => {
		loadData(params);
	};

	return {
		columns,
		filterOptions,
		caseData,
		isLoading,
		error,
		loadCaseData,
		clearCaseError: clearError,
		pagination,
	};
};
