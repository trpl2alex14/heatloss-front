export function serialize(data: object, parentKey?: string, formData:FormData = new FormData()): FormData {
	Object.entries(data).forEach(([key, value]) => {
		if (value instanceof File) {
			formData.append(parentKey ? `${parentKey}[${key}]` : key, value);
		} else if (typeof value === 'object' && !(value instanceof Date)) {
			serialize(value, parentKey ? `${parentKey}[${key}]` : key, formData);
		} else {
			formData.append(parentKey ? `${parentKey}[${key}]` : key, value);
		}
	});

	return formData;
}
