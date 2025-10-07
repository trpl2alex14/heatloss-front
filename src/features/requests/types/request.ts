import type { Product } from "@shared/types/produtcs";
import type { ClientRequest, Attach } from "@shared/types/client";
import type { SurfaceType } from "@features/directories/types";

export type RequestStatus = "working" | "completed" | "pending" | "cancelled";

export type ConstructionType = SurfaceType;

export type TagShort = string;

export interface RequestItem {
	id: number;
	status: RequestStatus;
	progress: number;
	date: string;
	area: number;
	floors: number;
	city: string;
	client: string;
	contacts: string[];
	tags: string[];
	product: Product;
	calculation?: number;
}

export interface Window {
	typeId: number;
	count: number;
	area?: number;
}

export interface Room {
	name?: string;
	windows?: Window[];
	area: number;
	height?: number;
	minHeight?: number;
	tags?: TagShort[];
}

export interface Material {
	id: number;
	name: string;
	width?: number;
}

export interface Construction {
	id: number;
	label?: string;
	surfaceId: number;
	type: ConstructionType;
	area?: number;
	materials: Material[];
}

export interface Floor {
	height?: number;
	tags?: TagShort[];
	rooms: Room[];
}

export interface RequestDetails {
	id: number;
	status: RequestStatus;
	progress: number;
	date: string;
	product: Product;

	tags?: TagShort[];

	client: ClientRequest;
	attachments?: Attach[];

	area?: number;
	width?: number;
	length?: number;
	wallHeight?: number;
	ridgeHeight?: number;

	city?: string;

	constructions?: Construction[];

	floors?: Floor[];

	electricity?: {
		power?: string;
		price?: number;
	};
}
