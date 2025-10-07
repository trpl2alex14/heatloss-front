import type { Room, RoomConstruction } from "../types";
import type { Construction } from "../types";
import type { RoomConstructionMethod } from "../types";
import type { SurfaceType } from "@features/directories/types/materials";
import { useCalculator } from "./useCalculator";
import { ref } from "vue";

export const useAutoDistribution = (rooms: Room[], constructions: Construction[]) => {
	const { getRoomHeight, getMaxFloor } = useCalculator();

	const isAlertConstructions = ref(false);

	// Вспомогательные функции для расчета площадей и объемов
	const getTotalAreaByFloor = (floor: number): number => {
		return rooms.filter((room) => room.floor === floor).reduce((sum, room) => sum + room.area, 0);
	};

	const getTotalVolume = (): number => {
		return rooms.reduce((sum, room) => sum + room.area * getRoomHeight(room), 0);
	};

	const getRoomConstructionsById = (room: Room, ids: number[]): RoomConstruction[] => {
		const newRoomConstructions: RoomConstruction[] = [];

		room.roomConstructions?.forEach((construction) => {
			if (ids.includes(construction.id)) {
				newRoomConstructions.push(construction);
			}
		});

		return newRoomConstructions;
	};

	const getWindowConstructions = (room: Room): RoomConstruction[] => {
		const idsWindowConstructions =
			constructions
				?.filter((construction) => construction.surface?.type === "window")
				.map((construction) => construction.id) || [];

		return getRoomConstructionsById(room, idsWindowConstructions);
	};

	const getUnlockedConstructions = (room: Room): RoomConstruction[] => {
		const idsUnlockedConstructions =
			room.roomConstructions?.filter((c) => c.unlocked).map((construction) => construction.id) || [];

		return getRoomConstructionsById(room, idsUnlockedConstructions);
	};

	// Получение коэффициента для конструкций
	const getAreaMultiplier = (room: Room, construction?: Construction): number => {
		if (!construction) return 0;

		const maxFloor = getMaxFloor();
		const totalAreaFirstFloor = getTotalAreaByFloor(1);
		const totalAreaLastFloor = getTotalAreaByFloor(maxFloor);
		const totalVolume = getTotalVolume();

		const surfaceType = (construction.surface?.type as SurfaceType) || "other";
		let areaMultiplier = 0;

		if (surfaceType === "floor" && room.floor === 1 && totalAreaFirstFloor > 0) {
			areaMultiplier = room.area / totalAreaFirstFloor;
		} else if (surfaceType === "roof" && room.floor === maxFloor && totalAreaLastFloor > 0) {
			areaMultiplier = room.area / totalAreaLastFloor;
		} else if (["wall", "window", "other"].includes(surfaceType) && totalVolume > 0) {
			const roomVolume = room.area * getRoomHeight(room);
			areaMultiplier = roomVolume / totalVolume;
		}

		return areaMultiplier;
	};

	// Получение площади и коэффициента для конструкций (уже разблокированных)
	const getDecreaseAreaForConstructions = (
		rooms: Room[],
		constructions: Construction[]
	): Record<number, { area: number; areaMultiplier: number }> => {
		return rooms
			.map(
				(room) =>
					room.roomConstructions
						?.filter((c) => c.unlocked)
						.map((c) => ({
							id: c.id,
							area: c.area,
							areaMultiplier: getAreaMultiplier(
								room,
								constructions.find((construction) => construction.id === c.id)
							),
						})) || []
			)
			.flat()
			.reduce((acc, curr) => {
				acc[curr.id] = {
					area: (acc[curr.id]?.area || 0) + curr.area,
					areaMultiplier: (acc[curr.id]?.areaMultiplier || 0) + curr.areaMultiplier,
				};
				return acc;
			}, {} as Record<number, { area: number; areaMultiplier: number }>);
	};

	// Функция автоматического распределения конструкций
	const distributeConstructions = (mode: RoomConstructionMethod = "auto"): Room[] => {
		if (!rooms.length || !constructions.length || mode === "manual") {
			return rooms;
		}

		isAlertConstructions.value = false;

		const decreaseAreaForConstructions = getDecreaseAreaForConstructions(rooms, constructions);

		return rooms.map((room) => {
			// Очищаем существующие конструкции
			const newRoomConstructions: RoomConstruction[] = mode === "windows" ? getWindowConstructions(room) : [];

			newRoomConstructions.push(...getUnlockedConstructions(room));

			// Получаем все конструкции
			constructions.forEach((construction) => {
				if (
					!construction.surface?.type ||
					!construction.area ||
					newRoomConstructions.find((rC) => rC.id === construction.id) ||
					(construction.surface.type === "window" && mode === "windows")
				) {
					return;
				}

				const areaMultiplier = getAreaMultiplier(room, construction);

				if (areaMultiplier > 0) {
					const area = decreaseAreaForConstructions[construction.id]?.area || 0;
					const decreaseAreaMultiplier = decreaseAreaForConstructions[construction.id]?.areaMultiplier || 0;
					let deltaArea =
						((construction.area * decreaseAreaMultiplier - area) * areaMultiplier) /
						(1 - decreaseAreaMultiplier);
					let calcArea = construction.area * areaMultiplier;

					if (calcArea + deltaArea < 0) {
						deltaArea = -calcArea;
						isAlertConstructions.value = true;
					}

					//отличие больше чем на 50% от расчетного
					if (Math.abs(deltaArea) > 0.5 * Math.abs(calcArea)) {
						isAlertConstructions.value = true;
					}

					let count = undefined;

					if (construction.surface?.type === "window") {
						const windows = room.roomConstructions
							.filter((rC) => rC.id === construction.id);

						count = windows.length > 0 ?
							windows.reduce((acc, rC) => acc + (rC?.count || 0), 0)
							: (room.defaultWindows || 1);
					}

					const newRoomConstruction: RoomConstruction = {
						id: construction.id,
						enabled: true,
						area: Math.round((calcArea + deltaArea) * 10) / 10,
						count: count,
						heatLoss: 0,
					};
					newRoomConstructions.push(newRoomConstruction);
				}
			});

			return {
				...room,
				roomConstructions: newRoomConstructions,
			};
		});
	};

	return {
		distributeConstructions,
		isAlertConstructions,
	};
};
