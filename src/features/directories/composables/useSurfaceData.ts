import { computed } from "vue";
import type { Surface } from "@features/directories/types/materials";
import { useApi } from "@shared/composables/useApi";

export const useSurfaceData = () => {
	const { data, isLoading, error, loadData, clearError } = useApi<
		void,
		{ data: Surface[] }
	>({name: 'api-directories-surfaces' });

	const loadSurfaceData = () => {
		loadData();
	};

	return {
		surfaces: computed(() => data.value?.data || []),
		isLoading: computed(() => isLoading.value || data.value.length === 0),
		error,
		loadSurfaceData,
		clearSurfaceError: clearError,
	};
};
