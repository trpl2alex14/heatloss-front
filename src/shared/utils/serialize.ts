import {snake} from "@shared/utils/text.ts";

export function serialize(data: object, parentKey?: string, formData: FormData = new FormData()): FormData {
	const makeKey = (key: string, snakeKey: boolean = false): string => {
		return snakeKey ? snake(key) : key;
	}

	Object.entries(data).forEach(([key, value]) => {
		if (value instanceof File) {
			formData.append(makeKey(parentKey ? `${parentKey}[${key}]` : key), value);
		} else if (value && typeof value === 'object' && !(value instanceof Date)) {
			serialize(value, parentKey ? `${parentKey}[${key}]` : key, formData);
		} else {
			formData.append(makeKey(parentKey ? `${parentKey}[${key}]` : key), value);
		}
	});

	return formData;
}
