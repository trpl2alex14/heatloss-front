import { ref, computed, shallowRef, watch } from "vue";
import axios from "axios";
import { useMessage } from "@/shared/composables/useMessage";

export type ResponseData<T> = {
	data: T;
	status: string;
	error?: string;
};

export const useApi = <T, K>(
	endpoint: string
) => {
	const data = shallowRef<K>({} as K);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	
	const loadData = async (params?: T | string | number | null, id?: string | number) => {
		isLoading.value = true;
		error.value = null;

		if ((typeof params === "string" || typeof params === "number") && !id ) {
			id = params;
			params = null;
		}

		const url = endpoint + (id || "");

		try {
			const response = await axios.get(url, params ? {params} : {});
						
			if (response.data?.status !== "success") {
				throw new Error(
					response.data?.error ?? "Ошибка при загрузке данных"
				);
			}

			data.value = response.data;
		} catch (err) {
			error.value =
				err instanceof Error
					? err.message
					: "Ошибка при загрузке данных";
			console.error("Ошибка загрузки данных:", err);
		} finally {
			isLoading.value = false;
		}
	};

	const clearError = () => {
		error.value = null;
	};

	const { error: errorMessage } = useMessage();

	watch(error, (newVal) => {
		if (newVal) {
			errorMessage(newVal);
		}
	});

	return {
		data: computed(() => data.value),
		isLoading: computed(() => isLoading.value),
		error: computed(() => error.value),
		loadData,
		clearError
	};
};
