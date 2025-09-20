export function route(name: string, id?: number | string) {
	switch (name) {
		case "directories.equipment":
			return "/data/equipment.json";
		case "directories.materials":
			return "/data/materials.json";
		case "directories.climate":
			return "/data/climate.json";
		case "directories.surfaces":
			return "/data/surfaces.json";

		case "cases":
			return "/data/cases.json";

		case "requests":
			return "/data/requests.json";
		case "requests.index":
			return `/data/requests.1222.json?`;
						
		case "calculations":
			return id ? `/calculations/${id}` : "/data/calculations.lazy.json";
		case "calculations.index":
			return `/data/calculations.111.json?`;
		case "calculations.history":
			return `/history/${id}`;			
		case "calculations.save":
			return `/data/calculations.save.json?`;
		case "calculations.view":
			return `/calculations/view/${id}`;
		case "calculations.pdf":
			return `/calculations/pdf/${id}`;

		case "crm.lead":
			return `https://kouzi.bitrix24.ru/crm/lead/details/${id}/`;
		case "crm.deal":
			return `https://kouzi.bitrix24.ru/crm/deal/details/${id}/`;

		case "/api/tags":
			return "/data/tags.json";
		case "/api/promos":
			return "/data/promos.json";
		case "api.equipments":
			return `/data/equipments.api.json?product=`;
	}
	return "";
}
