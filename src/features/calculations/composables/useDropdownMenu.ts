import type { ActionDef } from "@/shared/types/menu";

export const dropdownActions: ActionDef[] = [
	{
		label: "Просмотр",
		icon: "pi pi-eye",
		command: (id: number) => alert(`Просмотр: ${id}`),
	},
	{
		label: "Редактировать",
		icon: "pi pi-pencil",
		command: (id: number) => alert(`Редактировать: ${id}`),
	},
	{
		label: "Скачать PDF",
		icon: "pi pi-file-pdf",
		command: (id: number) => alert(`Скачать PDF: ${id}`),
	},
	{
		label: "Ссылка",
		icon: "pi pi-link",
		command: (id: number) => alert(`Ссылка: ${id}`),
	},
	{ separator: true },
	{
		label: "Опубликовать",
		icon: "pi pi-check",
		command: (id: number) => alert(`Опубликовать: ${id}`),
	},
	{
		label: "В черновик",
		icon: "pi pi-trash",
		command: (id: number) => alert(`В черновик: ${id}`),
	},
	{
		label: "Создать кейс",
		icon: "pi pi-book",
		command: (id: number) => alert(`Создать кейс: ${id}`),
	},
	{
		label: "Копировать",
		icon: "pi pi-copy",
		command: (id: number) => alert(`Копировать: ${id}`),
	},
	{ separator: true },
	{
		label: "Удалить",
		icon: "pi pi-trash",
		command: (id: number) => alert(`Удалить: ${id}`),
	},
];