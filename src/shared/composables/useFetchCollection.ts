import { ref, onMounted, computed, watch } from "vue";
import { useMessage } from "@shared/composables/useMessage";
import type {
	SortOptions,
	SearchOptions,
	FilterOptions,
	PaginationOptions,
} from "@shared/types/table";
import { useApi, type ResponseData, type Endpoint } from "@shared/composables/useApi";

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

type ResponseCollection<T> = ResponseData<T[]> & {
	pagination?: PaginationOptions;
};

const requestParams = <T>(params?: RequestDataOptions<T>) => {
	const options: Record<string, any> = {};
	if (params?.search && params.search.searchValue) {
		options.search = {
			fields: params.search.searchFields,
			value: JSON.stringify(params.search.searchValue),
		};
	}
	if (params?.sort && params.sort.sortField && params.sort.sortOrder) {
		options.sort = {
			field: params.sort.sortField,
			order: params.sort.sortOrder,
		};
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

export const useFetchCollection = <T>(endpoint: Endpoint, autoLoad = true) => {
	const {
		data: dataApi,
		isLoading,
		error,
		loadData: loadDataApi,
		clearError,
	} = useApi<RequestDataOptions<T>, ResponseCollection<T>>(endpoint);

	const defPagination = ref<PaginationOptions>({
		page: 1,
		pageSize: 10,
		total: 0,
	});

	const loadData = async (params?: RequestDataOptions<T>) => {
		loadDataApi(requestParams(params));
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

	const data = computed(() => {
		return dataApi.value.data ?? [];
	});

	const pagination = computed({
		get: () => {
			return dataApi.value.pagination ?? defPagination.value;
		},
		set: (value) => {
			defPagination.value = value;
		},
	});

	return {
		data,
		isLoading: computed(() => isLoading.value),
		error: computed(() => error.value),
		loadData,
		clearError,
		pagination,
	};
};
