import type { EquipmentItem } from "@features/directories/types/equipment";
import { useApiData } from "./useApiData";
import { route } from "@/shared/utils/router";

export const useEquipmentData = () => {
	const {
		data: equipmentData,
		isLoading,
		error,
		loadData,
		clearError,
	} = useApiData<EquipmentItem>(route("directories.equipment"));

	const loadEquipmentData = (filterValue?: string) => {
		const params =
			filterValue && filterValue !== "all"
				? { product: filterValue }
				: {};
		loadData(params);
	};

	return {
		equipmentData,
		isLoading,
		error,
		loadEquipmentData,
		clearEquipmentError: clearError,
	};
};
