import { computed, ref, shallowRef } from "vue";
import { useApi } from "@/shared/composables/useApi";
import type { EquipmentItem } from "../types";
import type { Product } from "@/shared/types/produtcs";
import { route } from "@/shared/utils/router";

// Глобальное состояние для кэширования данных
const globalEquipmentsData = shallowRef<{ data: EquipmentItem[] } | null>(null);
const isInitialized = ref(false);

export const useEquipments = (product: Product) => {
	const api = useApi<void, { data: EquipmentItem[] }>(
		route("api.equipments", product)
	);

	const loadDataOnce = async () => {
		if (globalEquipmentsData.value || isInitialized.value) {
			return;
		}

		isInitialized.value = true;

		await api.loadData();

		if (api.data.value) {
			globalEquipmentsData.value = api.data.value;
		}
	};

	return {
		data: computed(() => globalEquipmentsData.value || api.data.value),
		isLoading: computed(() => api.isLoading.value),
		error: computed(() => api.error.value),
		loadData: loadDataOnce,
		clearError: () => {
			api.clearError();
		},
		refresh: () => {
			globalEquipmentsData.value = null;
			isInitialized.value = false;
			return loadDataOnce();
		},
	};
};
