import type { ActionDef } from "@/shared/types/menu";

export const useDropdownMenu = () => {
	const dropdownActions: ActionDef[] = [
		{
			label: "Просмотр",
			icon: "pi pi-eye",
			name: 'view'
		},
		{
			label: "Редактировать",
			icon: "pi pi-pencil",
			name: 'edit'
		},
		{
			label: "Скачать PDF",
			icon: "pi pi-file-pdf",
			name: 'pdf'
		},
		{
			label: "Ссылка",
			icon: "pi pi-link",
			name: 'link'
		},
		{ separator: true },
		{
			label: "Опубликовать",
			icon: "pi pi-check",
			name: 'public'	
		},
		{
			label: "В черновик",
			icon: "pi pi-trash",
			name: 'draft',
		},
		{
			label: "Создать кейс",
			icon: "pi pi-book",
			name: 'case',
		},
		{
			label: "Копировать",
			icon: "pi pi-copy",
			name: 'copy',
		},
		{ separator: true },
		{
			label: "Удалить",
			icon: "pi pi-trash",
			name: "delete",
		},
	];

	return {
		dropdownActions,
	};
};
