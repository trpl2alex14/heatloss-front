import type {CalculationStatus} from "../types";
import {useMessage} from "@shared/composables/useMessage.ts";
import {useApiRequest} from "@shared/composables/useApiRequest.ts"

export const useCalculationActions = () => {
	const {info} = useMessage();
	const {drop, post, get} = useApiRequest();

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
		return drop('api-calculation', {id})
			.then((value: any) => {
				if (typeof value === 'object' && 'id' in value) {
					const id = value.id;
					info("", 5000, `Расчёт ${id} удалён`);
					return id;
				}
			});
	};

	const copyCalculation = async (id: number) => {
		return post('api-calculation-copy', {id}, {action: "copy"})
			.then((value: any) => {
				if (typeof value === 'object' && 'id' in value) {
					const newId = value.id;
					info("", 5000, `Расчёт ${id} скопирован в ${newId}`);
					return id;
				}
			});
	};

	const calculationViewPath = async (id: number) => {
		return get('api-calculation-short', {id})
			.then((value: any) => {
				if (typeof value === 'object' && 'view' in value) {
					return value.view;
				}
			});
	};

	return {
		changeStateCalculation,
		deleteCalculation,
		copyCalculation,
		calculationViewPath
	};
};
