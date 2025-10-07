import type { ActionDef } from "@shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		name: 'edit',
	},
	{ separator: true },
	{
		label: "Удалить",
		icon: "pi pi-trash",
		name: 'delete'
	},
];
