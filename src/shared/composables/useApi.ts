import { ref, computed, shallowRef, watch } from "vue";
import axios from "axios";
import { useMessage } from "@shared/composables/useMessage";
import { useRouter } from "vue-router";

export type ResponseData<T> = {
	data: T;
	status: string;
	error?: string;
};

export type Endpoint = string | { name: string };

export const useApi = <T, K>(
	endpoint: Endpoint
) => {
	const data = shallowRef<K>({} as K);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const router = useRouter();

	const getUrl = (id?: string | number) => {
		if(typeof endpoint === 'object'){
			return router.resolve({
				name: endpoint.name,
				params: id ? { id } : {}
			}).href;
		}

		return endpoint + (id || "");
	};

	const loadData = async (params?: T | string | number | null, id?: string | number) => {
		isLoading.value = true;
		error.value = null;

		if ((typeof params === "string" || typeof params === "number") && !id ) {
			id = params;
			params = null;
		}

		const url = getUrl(id);

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

		return data.value;
	};

	const saveData = async (route: string, params: T) => {
		isLoading.value = true;
		error.value = null;

		try {
			const url = getUrl(route);

			const response = await axios.post(url, params);

			if (response.data?.status !== "success") {
				throw new Error(
					response.data?.error ?? "Ошибка при сохранении данных"
				);
			}

			data.value = response.data;
		} catch (err) {
			error.value =
				err instanceof Error
					? err.message
					: "Ошибка при сохранении данных";
			console.error("Ошибка сохранения данных:", err);

			data.value = null;
		} finally {
			isLoading.value = false;
		}

		return data.value;
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
		saveData,
		clearError
	};
};
