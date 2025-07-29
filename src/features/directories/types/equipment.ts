export interface EquipmentItem {
	id: number;
	status: "published" | "hidden";
	photo: string;
	product: string;
	category: string;
	name: string;
	article: string;
	price: number;
	characteristics: string;
	tags: string[];
}
