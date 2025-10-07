import { useToast } from "primevue/usetoast";

export const useMessage = () => {
	const toast = useToast();
	const error = (message: string, life: number = 3000) => {
		toast.add({ severity: "error", summary: "Ошибка", detail: message, life });
	};

	const warning = (message: string, life: number = 3000) => {
		toast.add({ severity: "warn", summary: "Внимание", detail: message, life });
	};

	const info = (message: string, life: number = 3000, title?: string) => {
		toast.add({ severity: "info", summary: title, detail: message, life });
	};

	return { error, warning, info };
};
