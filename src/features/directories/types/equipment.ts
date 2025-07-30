export type Status = "published" | "hidden";

export type Type = "fleyt" | "kouzi" | "all";

export interface EquipmentItem {
	id: number;
	status: Status;
	photo: string;
	product: Type;
	category: string;
	name: string;
	article: string;
	price: number;
	characteristics: string;
	tags: string[];
}
