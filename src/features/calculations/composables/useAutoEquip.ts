import type { Product } from "@shared/types/produtcs";
import { computed, ref, type Ref } from "vue";
import type { Room, Equipment, EquipmentItem, InitRule, Rule } from "../types";
import { useEquipmentResources } from "@features/directories";

import regulatorSimple from "../rules/regulatorSimpl";
import radiatorLowPrice from "../rules/radiatorLowPrice";

const defaultRules: Rule[] = [
	radiatorLowPrice,
	regulatorSimple,
];

let rulesPipeline: Ref<InitRule[]> = ref([]);

export const useAutoEquip = (product: Ref<Product>, rules?: Ref<Rule[]>) => {
	const { data: equipments, loadData, refresh } = useEquipmentResources(product);

	loadData();

	const refreshEquipments = (): void => {
		refresh();
	}

	const createRules = (equipments: EquipmentItem[], rules: Rule[] = defaultRules) => {
		const pipeline = [];

		for(const rule of rules) {
			pipeline.push(rule(equipments));
		}

		return pipeline;
	}

	rulesPipeline = computed(() => createRules(equipments.value?.data ?? [], rules?.value));

	const equipRoom = (room: Room): Equipment[] => {
		return rulesPipeline.value
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
