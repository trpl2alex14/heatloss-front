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

	heatLoss: number;
	baseHeat?: number;

	roomConstructions: RoomConstruction[];
	equipment: Equipment[];
}
