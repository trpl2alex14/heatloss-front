import { useToast } from "primevue/usetoast";

export const useMessage = () => {
	const toast = useToast();

	const error = (message: string) => {
		toast.add({ severity: "error", summary: "Ошибка", detail: message, life: 3000 });
	};

	const warning = (message: string) => {
		toast.add({ severity: "warn", summary: "Внимание", detail: message, life: 3000 });
	};

	return { error, warning };
};