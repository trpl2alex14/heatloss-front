import type { ActionDef } from "@/shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Просмотр",
		icon: "pi pi-eye",
		command: (id: number) => {
			console.log("Просмотр заявки", id);
		},
	},
	{
		label: "Создать расчёт",
		icon: "pi pi-plus",
		command: (id: number) => {
			console.log("Создать расчёт для заявки", id);
		},
	},
	{
		separator: true,
	},
	{
		label: "Удалить",
		icon: "pi pi-trash",
		command: (id: number) => {
			console.log("Удалить заявку", id);
		},
	},
];
