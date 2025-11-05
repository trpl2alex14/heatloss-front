import {computed, ref, shallowRef, watch} from "vue";
import { useApiResource } from "@shared/composables/useApiResource.ts";
import type { PromoCode } from "@shared/types/ui.ts";

// Глобальное состояние для кэширования данных
const globalPromosData = shallowRef<{ data: PromoCode[] } | null>(null);
const isInitialized = ref(false);

export const usePromoResources = () => {
	const api = useApiResource<void, { data: PromoCode[] }>({ name: 'api-promos' });

	const loadDataOnce = async () => {
		if (globalPromosData.value && isInitialized.value) {
			return;
		}

		isInitialized.value = true;

		void api.loadData();
	};

	watch(
		() => api.data.value,
		() => {
			if(isInitialized.value && !globalPromosData.value && api.data.value) {
				globalPromosData.value = api.data.value;
			}
		}
	)

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
