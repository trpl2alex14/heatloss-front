export interface ColumnDef {
	key: string;
	label: string;
	type?: "text" | "date" | "number" | "slot" | "status" | "actions" | "icon";
	measure?: string;
	sortable?: boolean;
	hidden?: boolean;
	sort?: number;
	style?: string;
}

export interface ActionDef {
	label: string;
	icon?: string;
	command: (id: number) => void;
}

export interface StatusDef {
	key: string | number;
	label: string;
	type: "success" | "info" | "warn" | "secondary" | "danger" | "danger" | "contrast";
}