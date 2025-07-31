import { ref, computed, type Ref } from "vue";
import type { PaginationOptions, SortOptions } from "@/shared/types/table";

interface UseTableOptions<T> {
	searchFields?: (keyof T)[];
	pageSize?: number;
	lazy?: boolean;
}

export function useTable<T extends Record<string, any>>(
	data: Ref<T[]>,
	options: UseTableOptions<T> = {}
) {
	const { searchFields = [], pageSize = 10, lazy = false } = options;

	const searchValue = ref("");

	const pagination = ref<PaginationOptions>({
		page: 1,
		pageSize,
		total: data.value.length,
	});

	const sort = ref<SortOptions<T>>({
		sortField: undefined,
		sortOrder: undefined,
	});

	const filteredData = (
		data: T[],
		searchValue: string,
		searchFields: (keyof T)[]
	) => {
		let filtered = data;
		const searchTerm = searchValue.toLowerCase();

		return filtered.filter((row) => {
			return searchFields.some((field) => {
				const value = row[field];
				return String(value).toLowerCase().includes(searchTerm);
			});
		});
	};

	const sortedData = (data: T[], field: keyof T, sortOrder: 1 | -1) => {
		return data.sort((a, b) => {
			if (typeof a[field] === "number" && typeof b[field] === "number") {
				return sortOrder === 1
					? a[field] - b[field]
					: b[field] - a[field];
			}
			if (typeof a[field] === "string" && typeof b[field] === "string") {
				return sortOrder === 1
					? a[field].localeCompare(b[field])
					: b[field].localeCompare(a[field]);
			}
			return 0;
		});
	};

	const tableData = computed(() => {
		let resultData = data.value;
		if (searchValue.value) {
			resultData = filteredData(
				resultData,
				searchValue.value,
				searchFields
			);
		}

		if (sort.value.sortField && sort.value.sortOrder) {
			resultData = sortedData(
				resultData,
				sort.value.sortField as keyof T,
				sort.value.sortOrder
			);
		}

		if(lazy) {
			return resultData;
		}

		pagination.value.total = resultData.length;
		return resultData.slice(
			(pagination.value.page - 1) * pagination.value.pageSize,
			pagination.value.page * pagination.value.pageSize
		);
	});

	function onPageChange(page: PaginationOptions) {
		pagination.value = page;
	}

	function onSortChange(value: any) {
		sort.value = value;
	}

	function resetPagination() {
		pagination.value.page = 1;
	}

	function clearSearch() {
		searchValue.value = "";
		resetPagination();
	}

	return {
		searchValue,
		pagination,
		tableData,
		onPageChange,
		onSortChange,
		resetPagination,
		clearSearch,
	};
}
