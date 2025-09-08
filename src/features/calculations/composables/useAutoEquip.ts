import type { Product } from "@shared/types/produtcs";
import { computed, ref, type Ref } from "vue";
import type { Room, Equipment, EquipmentItem } from "../types";
import { useEquipments } from "../api/equipments";

import regulatorSimpl from "../rules/regulatorSimpl";
import radiatorLowPrice from "../rules/radiatorLowPrice";


type InitRule = {
	equip: (room: Room, prevEquip: Equipment[]) => Equipment[]
}

type Rule = (equipments: EquipmentItem[]) => InitRule;

const rulse: Rule[] = [	
	radiatorLowPrice,
	regulatorSimpl,
];

let rulsePipeline: Ref<InitRule[]> = ref([]);

export const useAutoEquip = (product: Ref<Product>) => {
	const { data: equipments, loadData, refresh } = useEquipments(product);

	loadData();

	const refreshEquipments = (): void => {
		refresh();
	}

	const createRules = (equipments: EquipmentItem[]) => {
		const pipeline = [];

		for(const rule of rulse) {			
			pipeline.push(rule(equipments));
		}

		return pipeline;
	}

	rulsePipeline = computed(() => createRules(equipments.value?.data ?? []));

	const equipRoom = (room: Room): Equipment[] => {		
		return rulsePipeline.value
		.reduce((prevEquip, rule) => rule.equip(room, prevEquip), [] as Equipment[])
		.reduce((result, equip) => {
			if(result[equip.id]) {
				result[equip.id].quantity += equip.quantity;
			} else {
				result[equip.id] = equip;
			}
			return result;
		}, [] as Equipment[])
		.flat();
	};
	
	return {
		equipments,
		equipRoom,
		refreshEquipments,
	};
};