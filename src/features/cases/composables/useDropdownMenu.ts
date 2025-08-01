import type { ActionDef } from "@/shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		command: (id: number) => {
			console.log("Редактировать кейс:", id);
		},
	},
	{
		label: "Опубликовать",
		icon: "pi pi-check",
		command: (id: number) => {
			console.log("Опубликовать кейс:", id);
		},
	},
	{
		label: "Скрыть",
		icon: "pi pi-eye-slash",
		command: (id: number) => {
			console.log("Скрыть кейс:", id);
		},
	},
	{ separator: true },
	{
		label: "Удалить",
		icon: "pi pi-trash",
		command: (id: number) => {
			console.log("Удалить кейс:", id);
		},
	},
];
