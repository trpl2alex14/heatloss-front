import { ref, onMounted, computed, shallowRef } from "vue";
import axios from "axios";

export const useApiData = <T>(endpoint: string, autoLoad = true) => {
	const data = shallowRef<T[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const loadData = async (params?: Record<string, any>) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await axios.get<{ data: T[], status: string, error?: string }>(endpoint, { params });
			data.value = await response.data?.data ?? [];
			if (response.data?.status !== "success") {
				throw new Error(response.data?.error ?? "Ошибка при загрузке данных");
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Ошибка при загрузке данных";
			console.error("Ошибка загрузки данных:", err);
		} finally {
			isLoading.value = false;
		}
	};

	const clearError = () => {
		error.value = null;
	};

	if (autoLoad) {
		onMounted(() => {
			loadData();
		});
	}

	return {
		data: computed(() => data.value),
		isLoading: computed(() => isLoading.value),
		error: computed(() => error.value),
		loadData,
		clearError,
	};
};
