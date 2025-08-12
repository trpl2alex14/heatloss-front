import type { ClimateItem, MaterialType } from "@/features/directories/types";
import type { Product } from "@/shared/types/produtcs";

export type CalculationStatus = "published" | "working" | "case" | "hide";
export type UseSeason = "permanent" | "seasonal" | "freeze";

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

	area: number;
	title?: string;
	
	// Общие данные
	product?: Product;
	tags?: string[];
	
	// Климатические данные
	city: string;
	useSeason?: UseSeason;

	climate: ClimateItem;
	requiredTemp: number;
	freezeTemp: number;

	// Конструкции
	calculateMethod: "detailed" | "simple" | "snip";
	constructions: Construction[];
}

export interface Equipment {
	name: string;
	quantity: number;
	price: number;
}

export interface ConstructionLayer {
	enabled: boolean;
	name: string;
	materialId: number;
	thickness?: number;
	type: MaterialType;
	resistance?: number;
}

export interface Construction {
	area?: number;
	layers: ConstructionLayer[];
	name: string;
	heatLoss?: number;
	snipResistance: number;
	calculatedResistance?: number;
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
