import type { ActionDef } from "@shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		name: 'edit',
	},
	{
		label: "Опубликовать",
		icon: "pi pi-check-circle",
		name: 'public',
	},
	{
		label: "Скрыть",
		icon: "pi pi-eye-slash",
		name: 'hide',
	},
	{ separator: true },
	{
		label: "Удалить",
		icon: "pi pi-trash",
		name: 'delete',
	},
];
