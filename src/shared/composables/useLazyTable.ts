import type { RequestDataOptions } from "@shared/composables/useFetchCollection.ts";
import type {
	FilterOptions,
	PaginationOptions,
	SortOptions,
} from "@/shared/types/table";
import { onMounted, reactive, ref, watch } from "vue";
import { useDebounce } from "@/shared/utils/debounce";

const debounce = useDebounce();

type LazyRequestOptions<T> = {
	dateField?: keyof T;
	filterField?: keyof T;
	searchFields?: (keyof T)[];
	pageSize?: number;
};

export const useLazyTable = <T>(
	loadData: (params?: RequestDataOptions<T>) => void,
	autoLoad?: boolean,
	options?: LazyRequestOptions<T>
) => {
	const requestData: RequestDataOptions<T> = reactive({
		lazyLoad: {
			page: 1,
			pageSize: options?.pageSize || 10,
		},
	});

	const dates = ref<Date[] | null>([]);

	const filterValue = ref("");

	const searchValue = ref("");

	const loadDataDebounced = (data: RequestDataOptions<T>) =>
		debounce(() => {
			loadData(data);
		}, 500);

	watch(searchValue, (value) => {
		requestData.search = {
			searchFields: options?.searchFields || [],
			searchValue: value,
		};

		loadDataDebounced(requestData as RequestDataOptions<T>);
	});

	const onPageChange = (page: PaginationOptions) => {
		requestData.lazyLoad = {
			page: page.page,
			pageSize: page.pageSize,
		};
		loadDataDebounced(requestData as RequestDataOptions<T>);
	};

	const onSortChange = (value: SortOptions<T>) => {
		requestData.sort = value;
		loadDataDebounced(requestData as RequestDataOptions<T>);
	};

	const reload = () => {
		loadDataDebounced(requestData as RequestDataOptions<T>);
	}

	const onDateChange = (value: Date[] | null) => {
		dates.value = value;

		if (!options?.dateField) {
			return;
		}

		if (typeof requestData.filter !== "object") {
			requestData.filter = {};
		}

		if (
			(!value || value.length === 0) &&
			requestData.filter &&
			typeof requestData.filter === "object" &&
			options.dateField in requestData.filter
		) {
			delete (requestData.filter as FilterOptions<T>)[options.dateField];
		} else {
			(requestData.filter as FilterOptions<T>)[options.dateField] =
				value || [];
		}

		loadDataDebounced(requestData as RequestDataOptions<T>);
	};

	const onFilterChange = (value: string) => {
		filterValue.value = value;
		if (typeof requestData.filter !== "object") {
			requestData.filter = {};
		}

		if (!options?.filterField) {
			return;
		}

		if (value === "all") {
			delete (requestData.filter as FilterOptions<T>)[
				options.filterField
			];
		} else {
			(requestData.filter as FilterOptions<T>)[options.filterField] =
				value;
		}

		loadDataDebounced(requestData as RequestDataOptions<T>);
	};

	if (autoLoad) {
		onMounted(() => {
			loadData(requestData as RequestDataOptions<T>);
		});
	}

	return {
		filterDates: dates,
		filterValue,
		searchValue,
		requestData,
		onPageChange,
		onSortChange,
		onDateChange,
		onFilterChange,
		reload
	};
};
