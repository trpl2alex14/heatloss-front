import { useApi } from "@/shared/composables/useApi";
import type { CalculationDetails, CalculationSaved, CalculationStatus } from "../types";
import { type Ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useMessage } from "@/shared/composables/useMessage.ts";

export const useFetchCalculation = (calculationData: Ref<CalculationDetails>) => {
	const { data, isLoading, error, loadData } = useApi<{}, CalculationDetails>({ name: "api-calculation" });

	watch(data, (newData) => {
		if (newData && newData.data) {
			calculationData.value = newData.data;
		}
	});

	return { isLoading, error, loadCalculationData: (id: number | string) => loadData(id) };
};

export const useSaveCalculation = () => {
	const { saveData, error } = useApi<CalculationSaved, number>({ name: "api-calculation" });

	const saveCalculation = async (id: number | string | CalculationSaved, params?: CalculationSaved) => {
		if (typeof id === "object") {
			params = id;
			id = "";
		}

		const result = await saveData(id ? `${id}` : "", params as CalculationSaved);

		return result.data.id;
	};

	return {
		saveCalculation,
		error,
	};
};

export const useCalculationAction = () => {
	const router = useRouter();
	const { info, error } = useMessage();

	const changeStateCalculation = async (id: number, status: CalculationStatus, successMsg?: string) => {
		const path = router.resolve({
			name: "calculation-status",
			params: { id },
			query: { status },
		});

		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.get(path.href);
				if (result.data.status === "success") {
					id = result.data.data || "";
					info("", 5000, successMsg || `Статус расчёта ${id} изменён`);
					resolve(id);
				}
			} catch (e) {
				error("Сервер вернул: " + (e instanceof Error ? e.message : "ошибку"));
			}
			reject();
		});
	};

	const deleteCalculation = async (id: number) => {
		const path = router.resolve({
			name: "calculation",
			params: { id },
		});

		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.delete(path.href);
				if (result.data.status === "success") {
					id = result.data.data || "";
					info("", 5000, `Расчёт ${id} удалён`);
					resolve(id);
					return;
				}
			} catch (e) {
				error("Сервер вернул: " + (e instanceof Error ? e.message : "ошибку"));
			}
			reject();
		});
	};

	const copyCalculation = async (id: number) => {
		const path = router.resolve({
			name: "calculation",
			params: { id },
			query: {
				action: "copy",
			},
		});

		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.post(path.href);
				if (result.data.status === "success") {
					const newId = result.data.data || "";
					info("", 5000, `Расчёт ${id} скопирован в ${newId}`);
					resolve(newId);
					return;
				}
			} catch (e) {
				error("Сервер вернул: " + (e instanceof Error ? e.message : "ошибку"));
			}
			reject();
		});
	};

	return {
		changeStateCalculation,
		deleteCalculation,
		copyCalculation,
	};
};
