import {computed, type Ref} from "vue";
import type {CalculationDetails, Equipment, EquipmentItem, Room} from "../types";
import {useEquipmentResources} from "@features/directories";

export const useActualPriceEquipments = (calculationData: Ref<CalculationDetails>) => {

	const product = computed(() => calculationData.value.product || 'all');
	const {data: equipments, loadData} = useEquipmentResources(product);

	const getEquipmentById = (id: number): EquipmentItem | null =>
		equipments && equipments.value?.data?.find((e: EquipmentItem) => e.id === id) || null;

	const updatePrice = async (): Promise<boolean> => {
		await loadData();

		let updated = false;
		const fixPrice = (item: Equipment) => {
			const equip = getEquipmentById(item.id);
			if(equip && item.price !== equip.price) {
				item.price = equip.price;
				updated = true;
			}
		}

		calculationData.value.equipment?.forEach(fixPrice);
		calculationData.value.rooms.forEach((room: Room) => room.equipment.forEach(fixPrice));

		return updated;
	}

	return {
		updatePrice
	}
}
