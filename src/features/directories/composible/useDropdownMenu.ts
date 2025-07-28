import type { ActionDef } from "@/shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		command: (id: number) => alert(`Редактировать: ${id}`),
	},	
	{ separator: true },
	{
		label: "Удалить",
		icon: "pi pi-trash",
		command: (id: number) => alert(`Удалить: ${id}`),
	},
];