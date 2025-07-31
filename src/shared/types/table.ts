export interface ColumnDef {
	id?: number;
	key: string;
	label: string;
	type?: "text" | "date" | "number" | "slot" | "status" | "actions" | "icon";
	measure?: string;
	sortable?: boolean;
	hidden?: boolean;
	sort?: number;
	style?: string;
}

export interface TypeLabelDef {
	key: number | string;
	label: string;
	type:
		| "success"
		| "info"
		| "warn"
		| "secondary"
		| "danger"
		| "danger"
		| "contrast";
}

export interface TypeImageDef {
	key: number | string;
	label?: string;
	image: string;
}

export interface TypeIconDef {
	key: number | string;
	label?: string;
	icon: string;
	color?: string;
}

export type PaginationOptions = {
	page: number;
	pageSize: number;
	total: number;
};

export type SortOptions<T> = {
	sortField?: keyof T;
	sortOrder?: 1 | -1;
};

export type SearchOptions<T> = {
	searchFields: (keyof T)[];
	searchValue: string;
};

export type FilterOptions<T> = {
	[key in keyof T]?: string | number | boolean | Date[];
};
