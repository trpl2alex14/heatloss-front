import { computed } from "vue";
import type { Surface } from "@features/directories/types/materials";
import { useApiResource } from "@shared/composables/useApiResource.ts";

export const useSurfaceData = () => {
	const { data, isLoading, error, loadData, clearError } = useApiResource<
		void,
		{ data: Surface[] }
	>({name: 'api-directories-surfaces' });

	const loadSurfaceData = () => {
		void loadData();
	};

	return {
		surfaces: computed(() => data.value?.data || []),
		isLoading: computed(() => isLoading.value || data.value.length === 0),
		error,
		loadSurfaceData,
		clearSurfaceError: clearError,
	};
};
