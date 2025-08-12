import { computed, ref } from "vue";
import type { CalculationDetails, CalculationResult } from "@/features/calculations/types/calculation.ts";

export const useCalculator = () => {
	const calculation = ref<CalculationDetails>({
		useSeason: "permanent",
	} as CalculationDetails);


	
	const title = computed(() => {
		return (
			calculation.value?.title ||
			(calculation.value?.city && calculation.value?.area ?
			`${calculation.value.city} - Дом ${calculation.value.area} м²` :
			'Новый расчёт')
		);
	});
	
	const subTitle = computed(() => {
		return `объект ${calculation.value.id || ''} от ${calculation.value.date || new Date().toLocaleDateString()}`;
	});	
	
    const result = computed<CalculationResult>(() => {
        return {
			id: 1222,
			power: 5.25,
			averagePower: 1230,
			equipmentCost: 198500,
			averageExpenses: 4500,
			equipment: [
				{
					name: "Флэйт 3 секции 500Вт - 150 Черный Ral 0922, правый",
					quantity: 5,
					price: 155000,
				},
				{
					name: "Флэйт 6 секции 250Вт - 30",
					quantity: 2,
					price: 10800,
				},
				{
					name: "Welrok lis",
					quantity: 3,
					price: 2500,
				},
			],
			totalEquipmentCost: 198500,
			deliveryCost: 1722,
		
			city: "Санкт-Петербург",
			humidity: "Б",
			area: 268.3,
			volume: 652.23,
			minTemp: -28,
			avgTemp: -1.3,
			requiredTemp: 25,
			heatingSeason: 213,
			totalHeatLoss: 21210.32,
			constructions: [
				{
					name: "Крыша утепленная наклонная",
					heatLoss: 1022,
					snipResistance: 3.7,
					calculatedResistance: 2.7,
					layers: []
				},
				{
					name: "Пристрой к дому (47 м2)",
					heatLoss: 325,
					snipResistance: 4.7,
					calculatedResistance: 4.5,
					layers: []
				},
				{
					name: "Стена наружная",
					heatLoss: 2224,
					snipResistance: 3.2,
					calculatedResistance: 3,
					layers: []
				},
				{
					name: "Пол над техподпольем, расп. выше уровня земли",
					heatLoss: 538,
					snipResistance: 2.7,
					calculatedResistance: 4.8,
					layers: []
				},
			],
		}
    })
	
	return {
		calculation,
		result,
		title,
		subTitle,
	};
};