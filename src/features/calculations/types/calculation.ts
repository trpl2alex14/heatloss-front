import type { Product } from "@/shared/types/produtcs";
import type { ClimateItem } from "@/features/directories/types";
import type { Construction } from "./construction";
import type { Room, RoomResult } from "./room";
import type { Equipment } from "./equipment";

export type CalculationStatus = "published" | "working" | "case" | "hide";
export type UseSeason = "permanent" | "seasonal" | "freeze";
export type RoomConstructionMethod = "auto" | "windows" | "manual";

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

	title?: string;

	// Общие данные
	product?: Product;
	tags?: string[];

	// Климатические данные
	city: string;
	useSeason?: UseSeason;

	climate?: ClimateItem;
	requiredTemp: number;
	freezeTemp: number;

	// Конструкции
	calculateMethod: "detailed" | "simple" | "snip";
	constructions: Construction[];
	baseHeatLoss?: number;

	rooms: Room[];
	roomConstructionMethod: RoomConstructionMethod;
	equipment?: Equipment[];

	powerPrice?: number;
	comment?: string;
	promoCode?: string;
	deliveryCost?: number;
	diliveryInfo?: string;
	needDelivery?: boolean;
}

export interface CalculationResult {
	id?: number;

	averagePower: number;
	averageExpenses: number;

	equipment?: Equipment[];
	power: number;
	equipmentCost: number;
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

	powerPrice?: number;

	diliveryInfo?: string;
	comment?: string;

	rooms?: RoomResult[];
}

export interface CalculationSaved {
	key?: string;
	calculation: CalculationDetails;
	result: CalculationResult;
}