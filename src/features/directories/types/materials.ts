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
	surface: string[];
}
