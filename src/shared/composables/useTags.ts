import {computed, ref, shallowRef, watch} from "vue";
import { useApiResource } from "./useApiResource.ts";
import type { Tag } from "../types/ui.ts";

// Глобальное состояние для кэширования данных
const globalTagsData = shallowRef<{ data: Tag[] } | null>(null);
const isInitialized = ref(false);

export const useTags = (group?: string) => {
	const api = useApiResource<{ group?: string }, { data: Tag[] }>({ name: 'api-tags' });

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
		if (globalTagsData.value && isInitialized.value) {
			return;
		}

		isInitialized.value = true;

		api.loadData(group ? { group } : null);
	};

	watch(
		() => api.data.value,
		() => {
			if(isInitialized.value && !globalTagsData.value && api.data.value) {
				globalTagsData.value = api.data.value;
			}
		}
	)

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
