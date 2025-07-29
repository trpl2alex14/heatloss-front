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
