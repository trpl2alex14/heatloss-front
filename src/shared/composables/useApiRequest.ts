import { useRouter, type LocationQueryRaw, type RouteParamsRawGeneric } from "vue-router";
import axios from "axios";
import { useMessage } from "@/shared/composables/useMessage.ts";

export type RejectResponse = {
	message: string,
	fields: {
		[key: string]: string[]
	}
}

export const useApiRequest = () => {
	const router = useRouter();
	const { error } = useMessage();

	const request = async <T>(
		url: string,
		action: "get" | "delete" | "post" = "get",
		params?: any
	): Promise<T | undefined> => {
		return new Promise(async (resolve, reject) => {
			const rejectResponse: RejectResponse = {
				message: 'Ошибка сервера',
				fields: {}
			}
			try {
				const result = await axios[action](url, params);
				if (result.data.status === "success") {
					resolve(result.data.data || {});
				}else if (result.data.errors) {
					rejectResponse.message = result.data.message || rejectResponse.message;
					rejectResponse.fields = result.data.errors
				}
			} catch (e) {
				error("Сервер вернул: " + (e instanceof Error ? e.message : "ошибку"));
			}
			reject(rejectResponse);
		});
	};

	const get = <T>(name: string, params?: RouteParamsRawGeneric, query?: LocationQueryRaw) => {
		const path = router.resolve({
			name,
			params,
			query,
		});

		return request<T>(path.href, "get");
	};

	const drop = (name: string, params?: RouteParamsRawGeneric) => {
		const path = router.resolve({
			name,
			params,
		});

		return request<{id: number}>(path.href, "delete");
	};

	const post = <T>(name: string, params?: RouteParamsRawGeneric, data?: any) => {
		const path = router.resolve({
			name,
			params,
		});

		return request<T>(path.href, "post", data);
	};

	return {
		get,
		drop,
		post,
	};
};
