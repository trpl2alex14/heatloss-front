import { computed, ref, shallowRef } from "vue";
import { useApi } from "@/shared/composables/useApi";
import type { Tag } from "@/shared/types/ui";

// Глобальное состояние для кэширования данных
const globalTagsData = shallowRef<{ data: Tag[] } | null>(null);
const isInitialized = ref(false);

export const useTagsApi = () => {
	const api = useApi<void, { data: Tag[] }>({ name: 'api-tags' });

	// Создаем индекс для быстрого поиска тегов по label
	const tagsIndex = computed(() => {
		const data = globalTagsData.value || api.data.value;
		if (!data?.data) return new Map<string, Tag>();

		const index = new Map<string, Tag>();
		data.data.forEach((tag: Tag) => {
			index.set(tag.label, tag);
		});
		return index;
	});

	
	const loadDataOnce = async () => {		
		if (globalTagsData.value || isInitialized.value) {
			return;
		}

		isInitialized.value = true;

		await api.loadData();
			
		if (api.data.value) {
				globalTagsData.value = api.data.value;
		}
	};

	return {
		data: computed(() => globalTagsData.value || api.data.value),
		isLoading: computed(() => api.isLoading.value),
		error: computed(() => api.error.value),
		tagsIndex,
		loadData: loadDataOnce,
		clearError: () => {			
			api.clearError();
		},		
		refresh: () => {
			globalTagsData.value = null;
			isInitialized.value = false;
			return loadDataOnce();
		},
	};
};
