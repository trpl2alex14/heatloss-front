import { ref, onMounted, computed, shallowRef, watch } from "vue";
import axios from "axios";
import { useMessage } from "@/shared/composables/useMessage";
import type {
	SortOptions,
	SearchOptions,
	FilterOptions,
	PaginationOptions,
} from "@/shared/types/table";

type LazyLoadOptions = {
	page: number;
	pageSize: number;
};

export type RequestDataOptions<T> = {
	search?: SearchOptions<T>;
	sort?: SortOptions<T>;
	lazyLoad?: LazyLoadOptions;
	filter?: FilterOptions<T>;
};

type ResponseData<T> = {
	data: T[];
	status: string;
	error?: string;
	pagination?: PaginationOptions;
};

const requestParams = <T>(params?: RequestDataOptions<T>) => {
	const options: Record<string, any> = {};
	if (params?.search) {
		options.search = JSON.stringify({
			fields: params.search.searchFields,
			value: params.search.searchValue,
		});
	}
	if (params?.sort && params.sort.sortField && params.sort.sortOrder) {
		options.sort = JSON.stringify({
			[params.sort.sortField]: params.sort.sortOrder,
		});
	}
	if (params?.lazyLoad) {
		options.limit = params.lazyLoad.pageSize;		
		const offset = (params.lazyLoad.page - 1) * params.lazyLoad.pageSize;
		if (offset > 0) {
			options.offset = offset;
		}
	}
	if (params?.filter && Object.keys(params.filter).length > 0) {
		options.filter = params.filter;
	}
	return options;
};

export const useApiData = <T>(
	endpoint: string,
	autoLoad = true,	
) => {
	const data = shallowRef<T[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const pagination = ref<PaginationOptions>({
		page: 1,
		pageSize: 10,
		total: 0,
	});

	const loadData = async (params?: RequestDataOptions<T>) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await axios.get<ResponseData<T>>(endpoint, {
				params: requestParams(params),
			});

			if (response.data?.status !== "success") {
				throw new Error(
					response.data?.error ?? "Ошибка при загрузке данных"
				);
			}

			data.value = response.data?.data ?? [];
			if (response.data?.pagination) {
				pagination.value = {
					page: response.data?.pagination.page,
					pageSize: response.data?.pagination.pageSize,
					total: response.data?.pagination.total,
				};
			}
		} catch (err) {
			error.value =
				err instanceof Error
					? err.message
					: "Ошибка при загрузке данных";
			console.error("Ошибка загрузки данных:", err);
		} finally {
			isLoading.value = false;
		}
	};

	const clearError = () => {
		error.value = null;
	};

	if (autoLoad) {
		onMounted(() => {
			loadData();
		});
	}

	const { error: errorMessage } = useMessage();

	watch(error, (newVal) => {
		if (newVal) {
			errorMessage(newVal);
		}
	});

	return {
		data: computed(() => data.value),
		isLoading: computed(() => isLoading.value),
		error: computed(() => error.value),
		loadData,
		clearError,
		pagination,
	};
};
