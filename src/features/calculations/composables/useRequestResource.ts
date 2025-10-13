import { computed } from "vue";
import { useApiResource } from "@shared/composables/useApiResource.ts";
import type { ClientRequest, Attach } from "@shared/types/client.ts";
import type { RequestDetails } from "@features/requests/types/request.ts";

export const useRequestResource = (endpoint?: string) => {
	const {
		data: requestDataRaw,
		isLoading: isRequestLoading,
		loadData: loadRequestData,
		error: requestError,
	} = useApiResource<{}, RequestDetails>(endpoint || { name: 'api-request' });

	const requestData = computed<RequestDetails>(() => {
		return requestDataRaw.value?.data ?? ({} as RequestDetails);
	});

	const attachments = computed<Attach[]>(() => {
		return requestData.value?.attachments ?? [];
	});

	const client = computed<ClientRequest>(() => {
		return requestData.value?.client ?? ({} as ClientRequest);
	});

	const hasRequest = computed(() => {
		return !isRequestLoading.value && !requestError.value && requestDataRaw.value?.data;
	});

	return {
		requestData,
		attachments,
		client,
		isRequestLoading,
		requestError,
		loadRequestData: (id: number | string) => loadRequestData(id),
		hasRequest,
	};
};
