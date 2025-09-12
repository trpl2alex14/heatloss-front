import type { CalculationSaved } from "../types";

export type LocalHistory = {
	key: string;
	label: string;
	createdAt: string;
};

export const useLocalHistory = () => {
	const setLocalHistory = (calculation: CalculationSaved): string => {
		const key = calculation.calculation.id?.toString() || calculation.key || Date.now().toString();

		calculation.key = key;

		localStorage.setItem(key, JSON.stringify(calculation));

		const label = calculation.calculation?.id 
			? ('Расчёт № ' + key) 
			: ('Расчёт от ' + new Date(Date.now()).toLocaleDateString());

		updateLocalHistoryList(key, label);

		return key;
	};

	const getLocalHistory = (key: string): CalculationSaved | null => {		
		const calculation = localStorage.getItem(key);
		return calculation ? JSON.parse(calculation) : null;
	};

	const getLocalHistoryList = (): LocalHistory[] => {
		const history = localStorage.getItem("history");
		return history ? JSON.parse(history) : [];
	};

	const removeLocalHistory = (key: string): void => {
		localStorage.removeItem(key);
	};

	const updateLocalHistoryList = (key: string, label: string): void => {
		const history = getLocalHistoryList();

		const existing = history.find((h) => h.key === key);
		if (existing) {
			existing.createdAt = new Date().toISOString();
		} else {
			history.push({
				key: key,
				label: label,
				createdAt: new Date().toISOString(),
			});

			if (history.length >= 6) {
				removeLocalHistory(history[0].key);
				history.shift();
			}
		}

		localStorage.setItem("history", JSON.stringify(history));
	};

	return {
		getLocalHistoryList,
		setLocalHistory,
		getLocalHistory,
	};
};
