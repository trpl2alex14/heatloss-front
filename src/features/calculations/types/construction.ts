import type { MaterialType, Surface } from "@features/directories/types";

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
