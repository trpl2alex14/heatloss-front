export function route(name: string) {
	switch (name) {
		case "directories.equipment":
			return "/data/equipment.json";
		case "directories.materials":
			return "/data/materials.json";
		case "directories.climate":
			return "/data/climate.json";
		case "calculations":
			return "/data/calculations.lazy.json";
	}
	return "";
}
