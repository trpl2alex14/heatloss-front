export type CaseStatus = "published" | "hide";

export interface CaseItem {
	id: number;
	status: CaseStatus;
	category: number;
	label:string;
	calculation: number;
	product: string;
	area: number;
	city: string;
	cost: number;
	power: number;
	consumption: number;
	image?: string;
}
