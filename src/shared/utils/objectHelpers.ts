export function isDeepEqual(x: any, y: any): boolean {
	if (x === y || (x === undefined && y === undefined)) {
		return true;
	} else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
		if (Object.keys(x).length != Object.keys(y).length)
			return false;

		for (let prop in x) {
			if (y.hasOwnProperty(prop)) {
				if (!isDeepEqual(x[prop], y[prop]))
					return false;
			} else
				return false;
		}

		return true;
	}

	return false;
}
