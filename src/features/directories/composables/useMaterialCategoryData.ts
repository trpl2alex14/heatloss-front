import {computed} from "vue";
import type {Category} from "@features/directories/types/materials";
import {useApi} from "@/shared/composables/useApi";

type ApiResponse = { data: Category[] };
export const useMaterialCategoryData = () => {
	const {data, isLoading, error, loadData, clearError}
		= useApi<void, ApiResponse>({name: 'api-directories-material-categories'});

	return {
		categories: computed(() => data.value?.data || []),
		isLoading: computed(() => isLoading.value || data.value.length === 0),
		error,
		loadCategoriesData: loadData,
		clearCategoriesError: clearError,
	};
};
