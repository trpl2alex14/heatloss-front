import type { EquipmentItem as EquipmentItemDirectory } from "@/features/directories/types/equipment";

export interface Equipment {
	id: number;
	name: string;
	quantity: number;
	price: number;
	power?: number;
	article?: string;
}

export interface EquipmentProperty {
	key: string;
	value: string | number;
}

export type EquipmentItem = EquipmentItemDirectory & {
	properties?: EquipmentProperty[];
};