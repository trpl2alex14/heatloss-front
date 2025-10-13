import {ref, computed, shallowRef, watch} from "vue";
import {useMessage} from "@shared/composables/useMessage";
import {type LocationQueryRaw} from "vue-router";
import {type RejectResponse, useApiRequest} from "@shared/composables/useApiRequest.ts";

export type ResponseData<ResponseEntity> = {
	data: ResponseEntity;
	status: string;
	error?: string;
};

export type Endpoint = string | { name: string };

export const useApiResource = <ReqParams, ResponseEntity>(
	endpoint: Endpoint
) => {
	const {get, post} = useApiRequest<ResponseEntity>(true);

	const data = shallowRef<ResponseEntity>({} as ResponseEntity);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const loadData = (params?: ReqParams & LocationQueryRaw | string | number | null, id?: string | number): void => {
		isLoading.value = true;
		error.value = null;

		if ((typeof params === "string" || typeof params === "number") && !id) {
			id = params;
			params = null;
		}

		const routeName = typeof endpoint === 'object' ? endpoint.name : endpoint + (id || "");

		get(routeName, {id}, params && typeof params === 'object' ? params : undefined)
			.then((response?: ResponseEntity) => {
				if(response){
					data.value = response;
				}
			})
			.catch((reject: RejectResponse) => error.value = reject.message)
			.finally(() => isLoading.value = false);
	};

	const saveData = (route: string, params: ReqParams): void => {
		isLoading.value = true;
		error.value = null;

		const routeName = typeof endpoint === 'object' ? endpoint.name : endpoint + (route || "");

		post(routeName, {id: route}, params && typeof params === 'object' ? params : undefined)
			.then((response?: ResponseEntity) => {
				if(response){
					data.value = response;
				}
			})
			.catch((reject: RejectResponse) => error.value = reject.message)
			.finally(() => isLoading.value = false);
	};

	const clearError = () => {
		error.value = null;
	};

	const {error: errorMessage} = useMessage();

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
		saveData,
		clearError
	};
};
