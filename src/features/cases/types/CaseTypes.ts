export type CaseStatus = "published" | "hidden";

export const CategoryType = {
	House: 1,
	Home: 2,
	Business: 3
} as const;

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

export type Case = CaseItem;
