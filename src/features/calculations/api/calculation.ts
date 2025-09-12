import { useApi } from "@/shared/composables/useApi";
import type { CalculationDetails, CalculationSaved } from "../types";
import { type Ref, watch } from "vue";
import { route } from "@/shared/utils/router";

export const useFetchCalculation = (
	calculationData: Ref<CalculationDetails>
) => {
	const { data, isLoading, error, loadData } = useApi<{}, CalculationDetails>(
		route("calculations.index")
	);
	
	watch(data, (newData) => {
		if (newData && newData.data) {
			calculationData.value = newData.data;
		}
	});
	
	return { isLoading, error, loadCalculationData: (id: number | string) => loadData(id) };
};

export const useSaveCalculation = () => {
	const { saveData, error } = useApi<CalculationSaved, number>(
		route("calculations.save")
	);

	const saveCalculation = async (id: number | string | CalculationSaved, params?: CalculationSaved) => {
		if (typeof id === "object") {
			params = id;
			id = "";
		}

		const result = await saveData(id ? `${id}` : "", params as CalculationSaved);
		
		return result.data;
	};

	return { 
		saveCalculation,
		error
	};
};