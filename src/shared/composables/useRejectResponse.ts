import {computed, ref} from "vue";
import type {RejectResponse} from "@shared/composables/useApiRequest.ts";

export type ErrorFieldsResult = {
	[index: number | string]: { [key: string]: ErrorFieldsResult | string[] } | string[];
};
export const useRejectResponse = () => {
	const errors = ref<RejectResponse | null>(null);

	const errorMessage = computed(
		() => (errors.value !== null ? errors.value.message : "")
	);

	const isInvalidField = (name: string, cb?: (field: string) => boolean) => {
		return errors.value !== null
			&& (name in errors.value.fields || cb && Object.keys(errors.value.fields).some(cb));
	};

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

	const getErrorFieldMessage = computed(() => {
		const fields = errors.value ? getErrorFields(errors.value) || {} : {};
		return (field: string) => field in fields
			? (Array.isArray(fields[field])
					? fields[field].join(', ')
					: (typeof fields[field] === 'string' ? fields[field] : '')
			)
			: '';
	});

	return {
		errors,
		errorMessage,
		getErrorFields,
		isInvalidField,
		getErrorFieldMessage
	}
}
