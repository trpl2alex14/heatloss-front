import type { ClimateItem } from "@features/directories/types/climate";
import { route } from "@/shared/utils/router";
import type { ColumnDef } from "@/shared/types/table";
import { useFetchCollection } from "@/shared/composables/useFetchCollection";

const columns: ColumnDef[] = [
	{ key: "id", label: "ID", sortable: true, sort: 1, style: "width: 60px;" },
	{ key: "region", label: "Регион", sortable: true, sort: 3, hidden: true },
	{ key: "city", label: "Город", sortable: true, sort: 2 },
	{
		key: "humidity",
		label: "Зона влажности",
		style: "width: 100px; text-align: center",
		sort: 4,
		hidden: true,
	},
	{
		key: "minTemp",
		label: "Минимальная",
		sortable: true,
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 5,
		measure: "C°",
	},
	{
		key: "avgTemp",
		label: "Средняя",
		sortable: true,
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 6,
		measure: "C°",
	},
	{
		key: "heatingSeason",
		label: "Отоп. сезон",
		sortable: true,
		type: "text",
		style: "width: 100px; text-align: center",
		sort: 7,
	},
	{
		key: "roofNorm",
		label: "Нормы кровля",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 8,
		hidden: true,
	},
	{
		key: "wallNorm",
		label: "Нормы стен",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 9,
		hidden: true,
	},
	{
		key: "floorNorm",
		label: "Нормы пол",
		type: "number",
		style: "width: 100px; text-align: center",
		sort: 10,
		hidden: true,
	},
];

export const useClimateData = () => {
	const {
		data: climateData,
		isLoading,
		error,
		loadData,
		clearError,
	} = useFetchCollection<ClimateItem>(route("directories.climate"));

	const loadClimateData = () => {
		loadData();
	};

	return {
		columns,
		climateData,
		isLoading,
		error,
		loadClimateData,
		clearClimateError: clearError,
	};
};
