import { ref, computed, type Ref } from "vue";

interface Pagination {
	page: number;
	pageSize: number;
	total: number;
}

interface UseTableOptions<T> {
	searchFields?: (keyof T)[];
	pageSize?: number;
}

export function useTable<T extends Record<string, any>>(
	data: Ref<T[]>,
	options: UseTableOptions<T> = {}
) {
	const { searchFields = [], pageSize = 10 } = options;

	const searchValue = ref("");

	const pagination = ref<Pagination>({
		page: 1,
		pageSize,
		total: data.value.length,
	});

	const sort = ref<{
		sortField: string | undefined;
		sortOrder: 1 | -1 | undefined;
	}>({
		sortField: undefined,
		sortOrder: undefined,
	});

	const filteredData = computed(() => {
		let filtered = data.value;

		if (searchValue.value) {
			const searchTerm = searchValue.value.toLowerCase();
			filtered = filtered.filter((row) => {
				return searchFields.some((field) => {
					const value = row[field];
					return String(value).toLowerCase().includes(searchTerm);
				});
			});
		}

		return filtered;
	});

	const sortedData = computed(() => {
		if (sort.value.sortField && sort.value.sortOrder) {
			const field = sort.value.sortField as keyof T;
			return filteredData.value.sort((a, b) => {
				if (
					typeof a[field] === "number" &&
					typeof b[field] === "number"
				) {
					return sort.value.sortOrder === 1
						? a[field] - b[field]
						: b[field] - a[field];
				}
				if (
					typeof a[field] === "string" &&
					typeof b[field] === "string"
				) {
					return sort.value.sortOrder === 1
						? a[field].localeCompare(b[field])
						: b[field].localeCompare(a[field]);
				}
				return 0;
			});
		}
		return filteredData.value;
	});

	const tableData = computed(() => {
		pagination.value.total = sortedData.value.length;
		return sortedData.value.slice(
			(pagination.value.page - 1) * pagination.value.pageSize,
			pagination.value.page * pagination.value.pageSize
		);
	});

	function onPageChange(page: Pagination) {
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
		filteredData,
		onPageChange,
		onSortChange,
		resetPagination,
		clearSearch,
	};
}
