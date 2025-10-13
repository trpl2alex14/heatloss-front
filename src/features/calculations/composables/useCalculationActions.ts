import type {CalculationStatus} from "../types";
import {useMessage} from "@shared/composables/useMessage.ts";
import {useApiRequest} from "@shared/composables/useApiRequest.ts"

export const useCalculationActions = () => {
	const {info} = useMessage();
	const {drop, post} = useApiRequest();

	const changeStateCalculation = async (id: number, status: CalculationStatus, successMsg?: string) => {
		return post('api-calculation-status', {id}, {status})
			.then((value: any) => {
				if (typeof value === 'object' && 'id' in value) {
					const id = value.id;
					info("", 5000, successMsg || `Статус расчёта ${id} изменён`);
					return id;
				}
			});
	};

	const deleteCalculation = async (id: number) => {
		return drop('calculation', {id})
			.then((value: any) => {
				if (typeof value === 'object' && 'id' in value) {
					const id = value.id;
					info("", 5000, `Расчёт ${id} удалён`);
					return id;
				}
			});
	};

	const copyCalculation = async (id: number) => {
		return post('calculation', {id}, {action: "copy"})
			.then((value: any) => {
				if (typeof value === 'object' && 'id' in value) {
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
