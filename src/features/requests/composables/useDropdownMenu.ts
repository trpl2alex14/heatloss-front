import type { ActionDef } from "@/shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Просмотр",
		icon: "pi pi-eye",
		name: 'view',
	},
	{
		label: "Создать расчёт",
		icon: "pi pi-plus",
		name: 'create',
	},
	{
		separator: true,
	},
	{
		label: "Удалить",
		icon: "pi pi-trash",
		name: 'delete',
	},
];
