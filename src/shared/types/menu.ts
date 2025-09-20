export type ActionSeparator = {
	separator: true;
}

export type ActionItem = {
	label: string;
	icon?: string;	
}

export type ActionValue = {
	id: number,
	action: string
}

export type ActionDef = ActionSeparator	| ( ActionItem & ({ command: (id: number) => void; } | { name: string }));
