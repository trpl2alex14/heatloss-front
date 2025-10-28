import {useApiResource} from "@shared/composables/useApiResource.ts";
import type {CalculationDetails, CalculationSaved} from "../types";
import {type Ref, watch} from "vue";
import {useMessage} from "@shared/composables/useMessage.ts";
import {useApiRequest} from "@shared/composables/useApiRequest.ts"

export const useCalculationResource = (calculationData: Ref<CalculationDetails>) => {
	const {data, isLoading, error, loadData}
		= useApiResource<{}, CalculationDetails>({name: "api-calculation"});
	const {post} = useApiRequest();
	const {info} = useMessage();

	watch(data, (newData) => {
		if (newData && newData.data) {
			calculationData.value = {
				...calculationData.value,
				...newData.data
			};
		}
	});

	const saveCalculation = async (id: number | string | CalculationSaved, params?: CalculationSaved): Promise<number | null> => {
		if (typeof id === "object") {
			params = id;
			id = 0;
		}

		const result = await post('api-calculation', id ? {id} : {}, params);

		if (typeof result === 'object' && 'id' in result) {
			const id = result.id;
			info("", 5000, `Расчёт ${id} сохранён`);
			return id;
		}

		return null;
	};

	return {
		isLoading,
		error,
		loadCalculationData: loadData,
		saveCalculation,
	};
};
