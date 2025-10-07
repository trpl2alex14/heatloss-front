import { computed, ref } from "vue";
import type {
	CalculationDetails,
	CalculationResult,
	Equipment,
	Room,
	Construction,
} from "../types";
import { useSettings } from "@features/settings/composables/useSettings.ts";
import type { SurfaceType } from "@features/directories/types";

const { powerPrice, tagsForTitle } = useSettings();
const calculation = ref<CalculationDetails>({
	useSeason: "permanent",
} as CalculationDetails);

export const useCalculator = () => {

	const resetCalculation = () => {
		calculation.value = {
			useSeason: "permanent",
		} as CalculationDetails;
	};

	const getTypeObject = computed(() => {
		return (
			tagsForTitle.find((item) =>
				calculation.value.tags?.includes(item)
			) || ""
		);
	});

	const title = computed(() => {
		return (
			calculation.value?.title ||
			(calculation.value?.city && totalArea.value
				? `${calculation.value.city} - ${getTypeObject.value} ${totalArea.value} м²`
				: "Новый расчёт")
		);
	});

	const subTitle = computed(() => {
		return `объект ${calculation.value.id || ""} от ${
			calculation.value.date || new Date().toLocaleDateString()
		}`;
	});

	const getSnipResistance = (surfaceType: SurfaceType) => {
		switch (surfaceType) {
			case 'wall':
				return calculation.value.climate?.wallNorm || 0;
			case "roof":
				return calculation.value.climate?.roofNorm || 0;
			case "floor":
				return calculation.value.climate?.floorNorm || 0;
			default:
				return 0;
		}
	};

	const getAllEquipmentFromRooms = (
		calculationData: CalculationDetails
	): Equipment[] => {
		const allEquipment: Equipment[] = [];

		calculationData.rooms?.forEach((room) => {
			room.equipment?.forEach((item) => {
				allEquipment.push({ ...item });
			});
		});

		return allEquipment;
	};

	const mergeEquipments = (equipment: Equipment[]): Equipment[] => {
		const equipmentMap = new Map<number, Equipment>();

		equipment.forEach((item) => {
			if (equipmentMap.has(item.id)) {
				const existing = equipmentMap.get(item.id)!;
				existing.quantity += item.quantity;
			} else {
				equipmentMap.set(item.id, { ...item });
			}
		});

		return Array.from(equipmentMap.values());
	};

	const calculatedHeatLoss = (
		area?: number,
		calculatedResistance?: number,
		tempDiff?: number
	) => {
		if (!area || !calculatedResistance || !tempDiff) return 0;
		return Math.round(((area * tempDiff) / calculatedResistance) * 10) / 10;
	};

	const totalEquipment = computed(() => {
		return mergeEquipments([
			...getAllEquipmentFromRooms(calculation.value),
			...(calculation.value.equipment || []),
		]);
	});

	const totalEquipmentCost = computed(() => {
		return totalEquipment.value.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		);
	});

	const totalEquipmentPower = computed(() => {
		return totalEquipment.value.reduce(
			(acc, item) => acc + (item?.power || 0) * item.quantity,
			0
		);
	});

	const totalHeatLoss = computed(() => {
		//todo: rooms heatloss or constructions heatloss
		return (
			Math.round(
				constructions.value.reduce(
					(acc, item) => acc + (item.heatLoss || 0),
					0
				) * 10
			) / 10
		);
	});

	const tempDiff = computed(() => {
		return (
			calculation.value.requiredTemp - (calculation.value.climate?.minTemp || 0)
		);
	});

	const averageHeatLoss = computed(() => {
		return Math.round(
			totalHeatLoss.value *
				((calculation.value.requiredTemp -
					(calculation.value.climate?.avgTemp || 0)) /
					tempDiff.value)
		);
	});

	const averagePower = computed(() => {
		return Math.round((averageHeatLoss.value * 24 * 30) / 100) / 10;
	});

	const constructionsDetailed = () => {
		if (!calculation.value.constructions) return [];
		return calculation.value.constructions.map((item) => ({
			...item,
			heatLoss: calculatedHeatLoss(
				item.area,
				item.calculatedResistance,
				tempDiff.value
			),
		}));
	};

	const constructionsSnip = () => {
		return constructionsDetailed();
	};

	const constructionsSimple = (): Construction[] => {
		return [
			{
				...calculation.value.constructions[0],
				area: totalArea.value,
			},
		];
	};

	const constructions = computed(() => {
		switch (calculation.value.calculateMethod) {
			case "simple":
				return constructionsSimple();
			case "snip":
				return constructionsSnip();
			default:
				return constructionsDetailed();
		}
	});

	const totalArea = computed(() => {
		return (
			calculation.value.rooms?.reduce(
				(acc, item) => acc + item.area,
				0
			) || 0
		);
	});

	const rooms = computed(() => {
		return calculation.value.rooms?.map((item) => ({
			id: item.id,
			name: item.name,
			area: item.area,
			floor: item.floor,
			volume:  Math.round(item.area * getRoomHeight(item) * 10) / 10,
			heatLoss: Math.round(item.heatLoss * 10) / 10,
			baseHeat: Math.round(item.baseHeat || 0 * 10) / 10,
			equipment: item.equipment,
			windows: item.roomConstructions.reduce((acc, item) => acc + (item.count || 0), 0),
		})) || [];
	});

	// Получение максимального этажа из всех помещений
	const getMaxFloor = (): number => {
		if (!calculation.value.rooms.length) return 1;
		return Math.max(...calculation.value.rooms.map((room) => room.floor));
	};

	const getRoomHeight = (item: Room) => {
		const height = item.height || 0;
		return item.isMansard ? (height + (item.minHeight || 0)) / 2 : height;
	};

	const totalVolume = computed(() => {
		return Math.round((
			calculation.value.rooms?.reduce(
				(acc, item) => acc + item.area * getRoomHeight(item),
				0
			) || 0
		) * 10) / 10;
	});

	const result = computed<CalculationResult>(() => {
		return {
			id: calculation.value.id || 0,
			power: totalEquipmentPower.value / 1000,
			equipmentCost: totalEquipmentCost.value,
			equipment: totalEquipment.value,
			averagePower: Math.round(averagePower.value * 10) / 10,
			averageExpenses:Math.round(
				averagePower.value *
				(calculation.value.powerPrice || powerPrice) * 10) / 10,
			deliveryCost: calculation.value.deliveryCost || 0,

			city: calculation.value.city,
			humidity: calculation.value.climate?.humidity || "-",
			minTemp: calculation.value.climate?.minTemp || 0,
			avgTemp: calculation.value.climate?.avgTemp || 0,
			requiredTemp: calculation.value.requiredTemp || 0,
			heatingSeason: calculation.value.climate?.heatingSeason || 0,
			area: Math.round(totalArea.value * 10) / 10,
			volume: Math.round(totalVolume.value * 10) / 10,
			totalHeatLoss: totalHeatLoss.value,
			constructions: constructions.value,
			powerPrice: calculation.value.powerPrice || powerPrice,
			diliveryInfo: calculation.value.diliveryInfo || "",
			comment: calculation.value.comment || "",
			rooms: rooms.value,
		};
	});

	return {
		calculation,
		result,
		title,
		subTitle,
		calculatedHeatLoss,
		getSnipResistance,
		getRoomHeight,
		getMaxFloor,
		computedTempDiff: tempDiff,
		tempDiff: tempDiff.value,
		resetCalculation,
		isCorrect: computed(() => {
			return result.value.power > 0 && result.value.area > 0 && result.value.totalHeatLoss > 0;
		}),
	};
};
