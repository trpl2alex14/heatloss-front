export const MaterialType = {
	Material: 1,
	Construction: 2,
} as const;

export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType];

export interface MaterialItem {
	id: number;
	name: string;
	category: string;
	photo?: string;
	type: MaterialType;
	a?: number;
	b?: number;
	r?: number;
	surface: SurfaceType[];
}

export type SurfaceType = 'wall' | 'roof' | 'floor' | 'window' | 'other';

export interface Surface {
	id: number;
	name: string;
	type: SurfaceType;
	baseResistance?: number;
	multiplier?: number;
}

export interface Category {
	id: number,
	name: string,
}
