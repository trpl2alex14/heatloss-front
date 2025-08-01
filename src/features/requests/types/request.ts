import type { Product } from "@/shared/types/produtcs";

export type RequestStatus = "working" | "completed" | "pending" | "cancelled";

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
