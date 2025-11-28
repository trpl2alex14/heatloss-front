import type { Equipment } from "./equipment";

export interface RoomConstruction {
	id: number;
	enabled: boolean;
	unlocked?: boolean;
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
	defaultWindows?: number;
	defaultWindowsArea?: number;

	heatLoss: number;
	baseHeat?: number;

	manualEquip?: boolean;
	roomConstructions: RoomConstruction[];
	equipment: Equipment[];
}

export interface RoomResult {
	id: number;
	name: string;
	floor: number;
	area: number;
	volume: number;
	heatLoss: number;
	baseHeat?: number;
	windows?: number;
	equipment: Equipment[];
}

export interface RoomFromRequest {
	name?: string,
	area: number,
	height? :number,
	minHeight?: number,
	isMansard?: boolean,
	floor: number,
	windows: number,
	windowsArea?: number
}
