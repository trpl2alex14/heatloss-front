import {useMessage} from "@shared/composables/useMessage.ts";
import {useApiRequest} from "@shared/composables/useApiRequest.ts";
import type { Status } from "../types";

export const useEquipmentAction = () => {
	const { info } = useMessage();
	const { drop, post } = useApiRequest();

	const changeStateEquipment = async (id: number, status: Status, successMsg?: string) => {
		return post('api-equipment-status', { id },{ status })
			.then((value: any) => {
				if(typeof value === 'object' && 'id' in value){
					const id = value.id;
					info("", 5000, successMsg || `Статус ${id} изменён`);
					return id;
				}
			});
	};

	const dropEquipment = async (id: number) => {
		return drop('api-equipment', { id })
			.then((value: any) => {
				if(typeof value === 'object' && 'id' in value){
					const id = value.id;
					info("", 5000, `Оборудование ${id} удалено`);
					return id;
				}
			});
	};

	return {
		changeStateEquipment,
		dropEquipment,
	};
};
