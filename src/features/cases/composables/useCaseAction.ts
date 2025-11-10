import {useMessage} from "@shared/composables/useMessage.ts";
import {useApiRequest} from "@shared/composables/useApiRequest.ts";
import type { CaseStatus } from "../types/caseTypes.ts";

export const useCaseAction = () => {
	const { info } = useMessage();
	const { drop, post } = useApiRequest();

	const changeStateCase = async (id: number, status: CaseStatus, successMsg?: string) => {
		return post('api-case-status', { id },{ status })
			.then((value: any) => {
				if(typeof value === 'object' && 'id' in value){
					const id = value.id;
					info("", 5000, successMsg || `Статус ${id} изменён`);
					return id;
				}
			});
	};

	const dropCase = async (id: number) => {
		return drop('api-case', { id })
			.then((value: any) => {
				if(typeof value === 'object' && 'id' in value){
					const id = value.id;
					info("", 5000, `Кейс ${id} удален`);
					return id;
				}
			});
	};

	return {
		changeStateCase,
		dropCase,
	};
};
