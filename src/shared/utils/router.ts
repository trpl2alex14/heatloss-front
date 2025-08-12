export function route(name: string, id? :number) {
	switch (name) {
		case "directories.equipment":
			return "/data/equipment.json";
		case "directories.materials":
			return "/data/materials.json";
		case "directories.climate":
			return "/data/climate.json";
		case "directories.surfaces":
			return "/data/surfaces.json";			
		case "calculations":
			return "/data/calculations.lazy.json";
		case "requests":
			return "/data/requests.json";
		case "cases":
			return "/data/cases.json";
		case "requests.index":
			return `/data/requests.${id}.json`;
		case "calculations.index":
			return `/data/calculations.${id}.json`;
		case "crm.lead":
			return `https://kouzi.bitrix24.ru/crm/lead/details/${id}/`;
		case "crm.deal":
			return `https://kouzi.bitrix24.ru/crm/deal/details/${id}/`;
		case "/api/tags":
			return "/data/tags.json";
		case "calculations.view":
			return `/calculations/view/${id}`;
		case "calculations.pdf":
			return `/calculations/pdf/${id}`;			

	}
	return "";
}
