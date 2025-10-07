import type { RequestItem } from "../types/request";
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
		sortable: false,
		style: "width: 50px; text-align: center;",
		sort: 1,
	},
	{
		key: "status",
		label: "Статус",
		type: "status",
		sortable: true,
		style: "width: 130px",
		sort: 2,
	},
	{
		key: "progress",
		label: "Прогресс",
		type: "slot",
		style: "width: 120px",
		sort: 3,
	},
	{
		key: "id",
		label: "Номер",
		type: "text",
		sortable: true,
		style: "width: 60px",
		sort: 4,
	},
	{
		key: "date",
		label: "Дата",
		type: "date",
		sortable: true,
		style: "width: 130px",
		sort: 5,
	},
	{
		key: "area",
		label: "Площадь",
		type: "slot",
		sortable: true,
		style: "width: 80px",
		measure: "м²",
		sort: 6,
	},
	{
		key: "city",
		label: "Город",
		type: "text",
		sortable: true,
		sort: 7,
	},
	{
		key: "client",
		label: "Клиент",
		type: "text",
		sort: 8,
	},
	{
		key: "contacts",
		label: "Контакты",
		type: "text",
		sortable: false,
		style: "white-space: nowrap;",
		sort: 9,
	},
	{
		key: "tags",
		label: "Тэги",
		type: "slot",
		sortable: false,
		sort: 10,
	},
];

const filterOptions = [
	{ label: "Все", value: "all" },
	{ label: "Заполняются", value: "pending" },
	{ label: "В работе", value: "working" },
	{ label: "Обработаны", value: "completed" },
];

export const useRequestData = () => {
	const {
		data: requestData,
		isLoading,
		error,
		loadData,
		clearError,
		pagination,
	} = useFetchCollection<RequestItem>({ name: 'api-requests' }, false);

	const loadRequestData = (params?: RequestDataOptions<RequestItem>) => {
		loadData(params);
	};

	return {
		columns,
		filterOptions,
		requestData,
		isLoading,
		error,
		loadRequestData,
		clearRequestError: clearError,
		pagination,
	};
};
