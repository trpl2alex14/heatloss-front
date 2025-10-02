import type {Product} from "@shared/types/produtcs.ts";

export type Status = "published" | "hidden";

export interface EquipmentItem {
	id: number;
	status: Status;
	photo: string;
	product: Product;
	category: string;
	name: string;
	article: string;
	price: number;
	characteristics: string;
	tags: string[];
}

export interface EquipmentProperty {
	key: string;
	label?: string;
	measure?: string;
	value: string | number;
}

export type Equipment = EquipmentItem & {
	properties?: EquipmentProperty[];
};
