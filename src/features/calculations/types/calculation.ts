import type { Product } from "@/shared/types/produtcs";

export interface CalculationItem {
	id: string;
	rating: number;
	area: number;
	city: string;
	cost: number;
	power: number;
	consumption: number;
	status: CalculationStatus;
	tags: string[];
	date: string;
	product: Product;
}

export type CalculationStatus = "published" | "working" | "case" | "hide";
