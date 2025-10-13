import {type LocationQueryRaw, type RouteParamsRawGeneric, useRouter} from "vue-router";
import axios, {type AxiosRequestConfig} from "axios";
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

const request = async <Response>(
	url: string,
	action: "get" | "delete" | "post" = "get",
	params?: any,
	config?: AxiosRequestConfig<any>,
	raw?: boolean
): Promise<Response | undefined> => {
	return new Promise(async (resolve, reject) => {
		const rejectResponse: RejectResponse = {
			message: 'Ошибка сервера',
			fields: {}
		}
		let result;
		try {
			if(action === 'get'){
				result = await axios.get(url, {params, ...config});
			} else {
				result = await axios[action](url, params, config);
			}
			//Если ответ с redirect
			if (result && hasRedirect(url, result)) {
				location.href = result?.request?.responseURL || '/';
				return;
			}

			if (result.data.status === "success") {
				resolve((raw ? result.data : result.data.data) || {});
			} else if (result.data.errors) {
				rejectResponse.message = result.data.message || rejectResponse.message;
				rejectResponse.fields = result.data.errors
			}
		} catch (e) {
			rejectResponse.message = "Сервер вернул: " + (e instanceof Error ? e.message : "ошибку");

			//Не авторизованный запрос или истекла
			if (e && typeof e === 'object' && 'status' in e && e.status === 401) {
				location.href = '/';
				return;
			}
		}
		reject(rejectResponse);
	});
};

export const useApiRequest = <DefResponse = any>(raw?: boolean) => {
	const router = useRouter();

	const get = <Response = DefResponse>(name: string, params?: RouteParamsRawGeneric, query?: LocationQueryRaw) => {
		const path = router.resolve({
			name,
			params
		});

		return request<Response>(path.href, "get", query, undefined, raw);
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

		return request<Response>(path.href, "post", data, config, raw);
	};

	return {
		get,
		drop,
		post,
	};
};
