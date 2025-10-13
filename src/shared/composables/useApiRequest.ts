import {useRouter, type LocationQueryRaw, type RouteParamsRawGeneric} from "vue-router";
import axios, {type AxiosRequestConfig} from "axios";
import {useMessage} from "@shared/composables/useMessage.ts";
import {endsWith} from "@shared/utils/text.ts";

export type RejectResponse = {
	message: string,
	fields: {
		[key: string]: string[]
	}
}

const hasRedirect = (url: string, response: any): boolean => {
	const type = response?.headers?.getContentType() || 'other';
	const requestUrl = response?.request?.responseURL || url;

	if (type.includes('text/html') && !endsWith(requestUrl, url)) {
		console.log(response)
		return true;
	}

	return false;
}

export const useApiRequest = <DefResponse = any>() => {
	const router = useRouter();
	const {error} = useMessage();

	const request = async <Response>(
		url: string,
		action: "get" | "delete" | "post" = "get",
		params?: any,
		config?: AxiosRequestConfig<any>
	): Promise<Response | undefined> => {
		return new Promise(async (resolve, reject) => {
			const rejectResponse: RejectResponse = {
				message: 'Ошибка сервера',
				fields: {}
			}
			try {
				const result = await axios[action](url, params, config);
				//Если ответ с redirect
				if (result && hasRedirect(url, result)) {
					location.href = result?.request?.responseURL || '/';
					return;
				}

				if (result.data.status === "success") {
					resolve(result.data.data || {});
				} else if (result.data.errors) {
					rejectResponse.message = result.data.message || rejectResponse.message;
					rejectResponse.fields = result.data.errors
				}
			} catch (e) {
				error("Сервер вернул: " + (e instanceof Error ? e.message : "ошибку"));

				//Не авторизованный запрос или истекла
				if (e && typeof e === 'object' && 'status' in e && e.status === 401) {
					location.href = '/';
					return;
				}
			}
			reject(rejectResponse);
		});
	};

	const get = <Response = DefResponse>(name: string, params?: RouteParamsRawGeneric, query?: LocationQueryRaw) => {
		const path = router.resolve({
			name,
			params,
			query,
		});

		return request<Response>(path.href, "get");
	};

	const drop = (name: string, params?: RouteParamsRawGeneric) => {
		const path = router.resolve({
			name,
			params,
		});

		return request<{ id: number }>(path.href, "delete");
	};

	const post = <Response = DefResponse>(name: string, params?: RouteParamsRawGeneric, data?: any, config?: AxiosRequestConfig<any>) => {
		const path = router.resolve({
			name,
			params,
		});

		return request<Response>(path.href, "post", data, config);
	};

	return {
		get,
		drop,
		post,
	};
};
