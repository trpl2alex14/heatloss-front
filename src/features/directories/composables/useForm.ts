import {type RejectResponse, useApiRequest} from "@shared/composables/useApiRequest";
import {computed, ref, watch} from "vue";
import {serialize} from "@shared/utils/serialize.ts";

export type Routes = {
	get: string,
	update: string,
	create: string,
	delete?: string
}

export type ErrorFieldsResult = {
	[index: number | string]: { [key: string]: ErrorFieldsResult | string[] } | string[];
};

export const useForm = <Entity>(routes: Routes) => {
	const {get, post} = useApiRequest();

	const entity = ref();

	const isChanged = ref(false);

	const errors = ref<RejectResponse | null>(null);

	const errorMessage = computed(
		() => (!isChanged.value && errors.value !== null ? errors.value.message : "")
	);

	watch(
		entity,
		() => {
			isChanged.value = true;
		},
		{
			deep: true,
		}
	);

	const getErrorFields = (errors: RejectResponse, fieldPrefix?: string): ErrorFieldsResult => {
		const result: ErrorFieldsResult = {};

		Object.keys(errors.fields).forEach(field => {
			// Если fieldPrefix не задан или поле начинается с fieldPrefix
			if (!fieldPrefix || field.startsWith(`${fieldPrefix}.`)) {
				// Убираем префикс, если он есть, иначе берем полное поле
				const path = fieldPrefix ? field.slice(fieldPrefix.length + 1) : field;
				const parts = path.split('.');

				let currentLevel: ErrorFieldsResult | string[] = result;

				// Проходим по всем частям пути, кроме последней
				for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i];
					// Если следующий уровень не существует, создаем его
					if (!currentLevel[part]) {
						currentLevel[part] = {};
					}
					currentLevel = currentLevel[part] as ErrorFieldsResult;
				}

				// Последняя часть пути - это ключ, куда записываем массив ошибок
				const lastKey = parts[parts.length - 1];
				currentLevel[lastKey] = errors.fields[field];
			}
		});

		return result;
	}

	const isInvalidField = (name: string, cb?: (field: string) => boolean) => {
		return !isChanged.value
			&& errors.value !== null
			&& (name in errors.value.fields || cb && Object.keys(errors.value.fields).some(cb));
	};

	const fetchEntity = async (id: number) => {
		entity.value = await get<Entity>(routes.get, {id});
	};

	const makeFormData = (entity: Entity) => {
		if (entity && typeof entity === 'object') {
			return serialize(entity);
		}

		return null;
	}

	const save = async (id?: number) => {
		isChanged.value = false;

		const name = id ? routes.update : routes.create;
		const params = id ? {id} : undefined;
		return post<Entity>(name, params, makeFormData(entity.value), {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.catch((result: RejectResponse) => {
				errors.value = result;
			});
	};

	return {
		entity,
		errors,
		isInvalidField,
		getErrorFields: (field?: string) => errors.value ? getErrorFields(errors.value, field) : undefined,
		isChanged,
		errorMessage,
		fetchEntity,
		save
	}
}
