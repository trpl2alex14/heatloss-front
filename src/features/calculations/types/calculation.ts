import type { Product } from "@/shared/types/produtcs";

export type CalculationStatus = "published" | "working" | "case" | "hide";

export interface CalculationItem {
	id: number;
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

export interface CalculationDetails {
	id?: number;
	date: string;
	status: CalculationStatus;

	requestId?: number;
	
	city: string;
	area: number;
	title?: string;
}

export interface Equipment {
	name: string;
	quantity: number;
	price: number;
}

export interface Construction {
	name: string;
	heatLoss: number;
	snipResistance: number;
	calculatedResistance: number;
}

export interface CalculationResult {
	id?: number;

	power: number;
	equipmentCost: number;

	averagePower: number;
	averageExpenses: number;	

	equipment?: Equipment[];

	totalEquipmentCost?: number;
	deliveryCost?: number;

	city: string;
	humidity: string;

	area: number;
	volume: number;

	minTemp: number;
	avgTemp: number;
	requiredTemp: number;
	heatingSeason: number;

	totalHeatLoss: number;

	constructions?: Construction[];
}
