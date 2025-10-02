import { useApi } from "@/shared/composables/useApi";
import type { CalculationDetails, CalculationSaved, CalculationStatus } from "../types";
import { type Ref, watch } from "vue";
import { useMessage } from "@/shared/composables/useMessage.ts";
import { useApiRequest } from "@/shared/composables/useApiRequest"

export const useFetchCalculation = (calculationData: Ref<CalculationDetails>) => {
	const { data, isLoading, error, loadData } = useApi<{}, CalculationDetails>({ name: "api-calculation" });

	watch(data, (newData) => {
		if (newData && newData.data) {
			calculationData.value = newData.data;
		}
	});

	return { isLoading, error, loadCalculationData: (id: number | string) => loadData(id) };
};

export const useSaveCalculation = () => {
	const { saveData, error } = useApi<CalculationSaved, number>({ name: "api-calculation" });

	const saveCalculation = async (id: number | string | CalculationSaved, params?: CalculationSaved) => {
		if (typeof id === "object") {
			params = id;
			id = "";
		}

		const result = await saveData(id ? `${id}` : "", params as CalculationSaved);

		return result?.data?.id || 0;
	};

	return {
		saveCalculation,
		error,
	};
};

export const useCalculationAction = () => {
	const { info } = useMessage();
	const { drop, post } = useApiRequest();

	const changeStateCalculation = async (id: number, status: CalculationStatus, successMsg?: string) => {
		return post('api-calculation-status', { id },{ status })
		.then((value: any) => {
			if(typeof value === 'object' && 'id' in value){
				const id = value.id;
				info("", 5000, successMsg || `Статус расчёта ${id} изменён`);
				return id;
			}
		});
	};

	const deleteCalculation = async (id: number) => {
		return drop('calculation', { id })
		.then((value: any) => {
			if(typeof value === 'object' && 'id' in value){
				const id = value.id;
				info("", 5000, `Расчёт ${id} удалён`);
				return id;
			}
		});
	};

	const copyCalculation = async (id: number) => {
		return post('calculation', { id }, { action: "copy" })
		.then((value: any) => {
			if(typeof value === 'object' && 'id' in value){
				const id = value.newId;
				info("", 5000, `Расчёт ${id} скопирован в ${id}`);
				return id;
			}
		});
	};

	return {
		changeStateCalculation,
		deleteCalculation,
		copyCalculation,
	};
};
