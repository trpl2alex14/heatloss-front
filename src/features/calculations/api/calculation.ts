import { useApi } from "@/shared/composables/useApi";
import type { CalculationDetails } from "@/features/calculations/types/calculation";
import { type Ref, watch } from "vue";
import { route } from "@/shared/utils/router";

export const useFetchCalculation = (id: number, calculationData: Ref<CalculationDetails>) => {
	const { data, isLoading, error, loadData } = useApi<{}, CalculationDetails>(route("calculations.index", id));

	watch(data, (newData) => {		
		if (newData && newData.data) {			
			calculationData.value = newData.data;
		}
	});

	return { isLoading, error, loadCalculationData: loadData };
};