import { computed, ref, shallowRef, watch, type Ref } from "vue";
import { useApi } from "@shared/composables/useApi";
import type { EquipmentItem } from "../types";
import type { Product } from "@shared/types/produtcs";

// Глобальное состояние для кэширования данных
const globalEquipmentsData = shallowRef<{ data: EquipmentItem[] } | null>(null);
const isInitialized = ref(false);
let initializedForProduct: Product | undefined;

export const useEquipments = (product: Ref<Product>) => {
	const api = useApi<{ product: Product }, { data: EquipmentItem[] }>({ name : 'api-equipments'});

	watch(product, (newProduct, oldProduct) => {
		if(newProduct !== oldProduct) {
			loadDataOnce();
		}
	});

	const isLoading = computed(() => api.isLoading.value);

	const loadDataOnce = async (reload: boolean = false) => {
		if (
			(globalEquipmentsData.value || isInitialized.value)
			&& initializedForProduct === product.value
			&& !reload
			|| (isLoading.value && initializedForProduct === product.value)
		) {
			return;
		}

		initializedForProduct = product.value;
		isInitialized.value = true;

		await api.loadData({
			product: initializedForProduct
		});

		if (api.data.value) {
			globalEquipmentsData.value = api.data.value;
		}
		if (api.error.value) {
			globalEquipmentsData.value = null;
			isInitialized.value = false;
		}
	};

	return {
		data: computed(() => globalEquipmentsData.value),
		isLoading: isLoading,
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
