import { TableState } from "@tanstack/react-table";

export function buildTableSearchParams(state: TableState): URLSearchParams {
	const { pagination, sorting, filters } = state;

	const searchParams = new URLSearchParams({
		pageIndex: pagination.pageIndex.toString(),
		pageSize: pagination.pageSize.toString(),
	});

	if (sorting.length > 0) {
		searchParams.append("sortBy", sorting[0].id);
		searchParams.append("sortDesc", sorting[0].desc.toString());
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== null && value !== undefined) {
			searchParams.append(key, value.toString());
		}
	});

	return searchParams;
}
