import { computed, ref, shallowRef } from "vue";
import { useApi } from "@shared/composables/useApi";
import type { PromoCode } from "@shared/types/ui";

// Глобальное состояние для кэширования данных
const globalPromosData = shallowRef<{ data: PromoCode[] } | null>(null);
const isInitialized = ref(false);

export const usePromos = () => {
	const api = useApi<void, { data: PromoCode[] }>({ name: 'api-promos' });

	const loadDataOnce = async () => {
		if (globalPromosData.value || isInitialized.value) {
			return;
		}

		isInitialized.value = true;

		await api.loadData();

		if (api.data.value) {
			globalPromosData.value = api.data.value;
		}
	};

	return {
		data: computed(() => globalPromosData.value || api.data.value),
		isLoading: computed(() => api.isLoading.value),
		error: computed(() => api.error.value),
		loadData: loadDataOnce,
		clearError: () => {
			api.clearError();
		},
		refresh: () => {
			globalPromosData.value = null;
			isInitialized.value = false;
			return loadDataOnce();
		},
	};
};
