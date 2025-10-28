import {computed, ref, type Ref, shallowRef, watch} from "vue";
import {useApiResource} from "@shared/composables/useApiResource.ts";
import type {EquipmentItem} from "../types";
import type {Product} from "@shared/types/produtcs.ts";

// Глобальное состояние для кэширования данных
const globalEquipmentsData = shallowRef<{ data: EquipmentItem[] } | null>(null);
const isInitialized = ref(false);
let initializedForProduct: Product;

export const useEquipmentResources = (product: Ref<Product> = ref('all')) => {
	const api = useApiResource<any, { data: EquipmentItem[] }>({name: 'api-equipments'});

	watch(product, (newProduct, oldProduct) => {
		if (newProduct !== oldProduct) {
			void loadDataOnce();
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

		await api.loadData(initializedForProduct && initializedForProduct !== 'all'
			? {
				filter: {
					product: initializedForProduct
				}
			}
			: null);
	};

	watch(
		() => api.data.value,
		() => {
			if (isInitialized.value && api.data.value) {
				globalEquipmentsData.value = api.data.value
			}
		}, {
			deep: true
		}
	);

	watch(
		() => api.error.value,
		() => {
			if (api.error.value) {
				globalEquipmentsData.value = null;
				isInitialized.value = false;
			}
		}, {
			deep: true
		}
	);

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
