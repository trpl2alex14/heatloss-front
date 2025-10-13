import {computed} from "vue";
import type {Category} from "@features/directories/types";
import {useApiResource} from "@shared/composables/useApiResource.ts";

type ApiResponse = { data: Category[] };

export const useMaterialCategoryData = () => {
	const {data, isLoading, error, loadData, clearError}
		= useApiResource<void, ApiResponse>({name: 'api-directories-material-categories'});

	return {
		categories: computed(() => data.value?.data || []),
		isLoading: computed(() => isLoading.value || data.value.length === 0),
		error,
		loadCategoriesData: loadData,
		clearCategoriesError: clearError,
	};
};
