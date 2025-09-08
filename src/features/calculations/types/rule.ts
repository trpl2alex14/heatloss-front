import type { Room, Equipment, EquipmentItem } from "../types";

export type InitRule = {
	equip: (room: Room, prevEquip: Equipment[]) => Equipment[]
}

export type Rule = (equipments: EquipmentItem[]) => InitRule;