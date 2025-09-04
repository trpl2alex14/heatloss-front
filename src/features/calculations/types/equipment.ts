import type { EquipmentItem as EquipmentItemDirectory } from "@/features/directories/types/equipment";

export interface Equipment {
	id: number;
	name: string;
	quantity: number;
	price: number;
	power?: number;
}

export interface EquipmentProperty {
	key: string;
	value: string;
}

export type EquipmentItem = EquipmentItemDirectory & {
	properties?: EquipmentProperty[];
};