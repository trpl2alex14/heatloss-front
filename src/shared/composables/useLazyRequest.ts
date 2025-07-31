import type { RequestDataOptions } from "@/shared/composables/useApiData";
import type { FilterOptions, PaginationOptions } from "@/shared/types/table";
import { onMounted, reactive, ref, type UnwrapRef } from "vue";

export const useLazyRequest = <T>(
	loadData: (params?: RequestDataOptions<T>) => void,
	autoLoad?: boolean,
	dateField?: keyof T,
	filterField?: keyof T
) => {
	const requestData = reactive<RequestDataOptions<T>>({
		lazyLoad: {
			page: 1,
			pageSize: 10,
		},
	});

	const dates = ref<Date[] | null>([]);

	const filterValue = ref("");

	const onPageChange = (page: PaginationOptions) => {
		requestData.lazyLoad = {
			page: page.page,
			pageSize: page.pageSize,
		};
		loadData(requestData as RequestDataOptions<T>);
	};

	const onDateChange = (value: Date[] | null) => {
		dates.value = value;

		if (!dateField) {
			return;
		}

		if (typeof requestData.filter !== "object") {
			requestData.filter = {} as UnwrapRef<FilterOptions<T>>;
		}

		if (
			(!value || value.length === 0) &&
			requestData.filter &&
			typeof requestData.filter === "object" &&
			dateField in requestData.filter
		) {
			delete (requestData.filter as FilterOptions<T>)[dateField];
		} else {
			(requestData.filter as FilterOptions<T>)[dateField] = value || [];
		}

		loadData(requestData as RequestDataOptions<T>);
	};

	const onFilterChange = (value: string) => {
		filterValue.value = value;
		if (typeof requestData.filter !== "object") {
			requestData.filter = {} as UnwrapRef<FilterOptions<T>>;
		}

		if (!filterField) {
			return;
		}

		if (value === "all") {
			delete (requestData.filter as FilterOptions<T>)[filterField];
		} else {
			(requestData.filter as FilterOptions<T>)[filterField] = value;
		}

		loadData(requestData as RequestDataOptions<T>);
	};

	if (autoLoad) {
		onMounted(() => {
			loadData(requestData as RequestDataOptions<T>);
		});
	}

	return {
		filterDates: dates,
		filterValue,
		requestData,
		onPageChange,
		onDateChange,
		onFilterChange,
	};
};
