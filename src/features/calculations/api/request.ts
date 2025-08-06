import { useApi } from "@/shared/composables/useApi";
import type { ClientRequest, Attach } from "@/shared/types/client";
import { route } from "@/shared/utils/router";
import { computed } from "vue";
import type { RequestDetails } from "@/features/requests/types/request";

export const useRequest = (endpoint: string) => {
	const {
		data: requestDataRaw,
		isLoading: isRequestLoading,
		loadData: loadRequestData,
		error: requestError,
	} = useApi<{}, RequestDetails>(endpoint);
		
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
		loadRequestData: (id: number) => loadRequestData(null, route("requests.index", id)),
		hasRequest,
	};
};