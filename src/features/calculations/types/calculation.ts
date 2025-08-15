import type { ClimateItem, MaterialType, Surface } from "@/features/directories/types";
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

	rooms: Room[];
	equipment?: Equipment[];
}

export interface Equipment {
	id: number;
	name: string;
	quantity: number;
	price: number;
	power?: number;
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
	id: number;
	area?: number;
	layers: ConstructionLayer[];
	name: string;
	surface?: Surface;
	heatLoss?: number;
	snipResistance: number;
	calculatedResistance?: number;
}

export interface RoomConstruction {
	id: number;
	enabled: boolean;
	area: number;
	count?: number;
	heatLoss: number;
}

export interface Room {
	id: number;
	name: string;
	area: number;
	floor: number;
	width?: number;
	length?: number;
	height?: number;
	minHeight?: number;
	isMansard?: boolean;

	heatLoss: number;
	baseHeat?: number;

	roomConstructions: RoomConstruction[];
	equipment: Equipment[];
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
