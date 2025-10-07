export type {Equipment as EquipmentItem}
	from "@features/directories/types/equipment";

export interface Equipment {
	id: number;
	name: string;
	quantity: number;
	price: number;
	power?: number;
	article?: string;
}
