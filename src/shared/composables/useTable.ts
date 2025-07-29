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

	const tableData = computed(() => {
		pagination.value.total = filteredData.value.length;
		return filteredData.value.slice(
			(pagination.value.page - 1) * pagination.value.pageSize,
			pagination.value.page * pagination.value.pageSize
		);
	});

	function onPageChange(page: number) {
		pagination.value.page = page;
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
		resetPagination,
		clearSearch,
	};
}
