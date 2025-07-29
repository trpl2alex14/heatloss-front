import type { ActionDef } from "@/shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		command: (id: number) => alert(`Редактировать: ${id}`),
	},
	{
		label: "Опубликовать",
		icon: "pi pi-check-circle",
		command: (id: number) => alert(`Опубликовать: ${id}`),
	},
	{
		label: "Скрыть",
		icon: "pi pi-eye-slash",
		command: (id: number) => alert(`В черновик: ${id}`),
	},			
	{ separator: true },
	{
		label: "Удалить",
		icon: "pi pi-trash",
		command: (id: number) => alert(`Удалить: ${id}`),
	},
];