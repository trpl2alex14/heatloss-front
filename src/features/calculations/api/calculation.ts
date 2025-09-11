import { useApi } from "@/shared/composables/useApi";
import type { CalculationDetails } from "../types";
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
