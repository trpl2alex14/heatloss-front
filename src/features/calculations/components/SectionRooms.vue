<template>
	<div class="flex flex-col gap-3.5">
		<!-- Заголовок секции -->
		<div class="flex flex-col gap-1.5">
			<h3 class="text-xl font-normal text-gray-900">Помещения</h3>
			<p class="text-sm font-normal text-gray-600">
				Перечень всех помещений на объекте, даже тех где установка
				оборудования не предполагается
			</p>
		</div>

		<div class="flex items-center gap-2">
			<!-- Переключатели режимов -->
			<BaseSelectButton
				v-model="constructionMode"
				:options="constructionModeOptions"
				option-label="label"
				option-value="value"
				:allow-empty="false"
			/>
			<p class="text-gray-600 text-sm w-60">
				Способ расчета ограждающих конструкций помещения
			</p>
		</div>

		<!-- Список помещений -->
		<div class="flex flex-col gap-4">
			<Room
				v-for="(room, index) in modelValue.rooms"
				:key="room.id"
				v-model="modelValue.rooms[index]"
				:constructions="modelValue.constructions"
				:min-temp="modelValue?.climate?.minTemp || 0"
				:required-temp="modelValue.requiredTemp"
				:floors="getMaxFloor()"
				:room-construction-method="constructionMode"
				:is-first="index === 0"
				:is-last="index === modelValue.rooms.length - 1"
				@move-up="moveRoomUp(index)"
				@move-down="moveRoomDown(index)"
				@duplicate="duplicateRoom(index)"
				@remove="removeRoom(index)"
				@add-floor="addFloor(index)"
			/>

			<EmptyBox
				v-if="modelValue.rooms.length === 0"
				label="помещения отсутствуют"
			/>

			<!-- Кнопка добавления помещения -->
			<BaseButton
				icon="home"
				label="Добавить помещение"
				severity="primary"
				@click="addRoom"
				class="self-end"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import Room from "./Room.vue";
import EmptyBox from "@/shared/components/EmptyBox.vue";

import type {
	CalculationDetails,
	Room as RoomType,
	RoomConstructionMethod,
	RoomConstruction,
	Construction,
} from "../types";
import type { SurfaceType } from "@/features/directories/types/materials";
import { useCalculator } from "../composables/useCalculator";

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
	(e: "alertConstructions"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { getRoomHeight } = useCalculator();

// Режим выбора конструкций
const constructionMode = computed<RoomConstructionMethod>({
	get: () => props.modelValue.roomConstructionMethod,
	set: (value) => {
		if (!value) return;

		emit("update:modelValue", {
			...props.modelValue,
			roomConstructionMethod: value,
		});
	},
});

// Вычисляемые опции для режима выбора конструкций
const constructionModeOptions = computed(() => {
	const options = [];

	// Проверяем, есть ли area у всех конструкций
	const allConstructionsHaveArea = props.modelValue.constructions.every(
		(construction) =>
			construction.area !== undefined && construction.area > 0
	);

	// Проверяем, есть ли area у всех конструкций кроме окон
	const nonWindowConstructionsHaveArea = props.modelValue.constructions
		.filter((construction) => construction.surface?.type !== "window")
		.every(
			(construction) =>
				construction.area !== undefined && construction.area > 0
		);

	if (
		allConstructionsHaveArea ||
		props.modelValue.calculateMethod === "simple"
	) {
		options.push({ value: "auto", label: "Авто" });
	}

	if (
		nonWindowConstructionsHaveArea &&
		props.modelValue.calculateMethod === "detailed"
	) {
		options.push({ value: "windows", label: "Витражи" });
	}

	if (props.modelValue.calculateMethod !== "simple") {
		options.push({ value: "manual", label: "Указать размеры" });
	}

	// Если текущий режим недоступен, переключаемся на первый доступный
	if (!options.find((option) => option.value === constructionMode.value)) {
		constructionMode.value = (options[0]?.value ||
			"manual") as RoomConstructionMethod;
	}

	return options;
});

// Получение максимального этажа из всех помещений
const getMaxFloor = (): number => {
	if (!props.modelValue.rooms.length) return 1;
	return Math.max(...props.modelValue.rooms.map((room) => room.floor));
};

// Методы для работы с помещениями
const getNextRoomId = (): number => {
	if (!props.modelValue.rooms.length) return 1;
	return Math.max(...props.modelValue.rooms.map((room) => room.id)) + 1;
};

const addRoom = () => {
	const newRoom: RoomType = {
		id: getNextRoomId(),
		name: "Комната " + getNextRoomId(),
		area: 0,
		floor: 1,
		width: 0,
		length: 0,
		height: 2.5,
		minHeight: 2.5,
		isMansard: false,
		heatLoss: 0,
		baseHeat: 0,
		roomConstructions: [],
		equipment: [],
	};

	emit("update:modelValue", {
		...props.modelValue,
		rooms: [...props.modelValue.rooms, newRoom],
	});
};

const removeRoom = (index: number) => {
	const newRooms = [...props.modelValue.rooms];
	newRooms.splice(index, 1);

	emit("update:modelValue", {
		...props.modelValue,
		rooms: newRooms,
	});
};

const duplicateRoom = (index: number) => {
	const roomToDuplicate = props.modelValue.rooms[index];
	const duplicatedRoom: RoomType = {
		...roomToDuplicate,
		id: getNextRoomId(),
		name: `${roomToDuplicate.name} (копия)`,
	};

	emit("update:modelValue", {
		...props.modelValue,
		rooms: [...props.modelValue.rooms, duplicatedRoom],
	});
};

const moveRoomUp = (index: number) => {
	if (index === 0) return;

	let newRooms = [...props.modelValue.rooms];
	newRooms[index] = newRooms.splice(index - 1, 1, newRooms[index])[0];

	emit("update:modelValue", {
		...props.modelValue,
		rooms: newRooms,
	});
};

const moveRoomDown = (index: number) => {
	if (index === props.modelValue.rooms.length - 1) return;

	const newRooms = [...props.modelValue.rooms];
	newRooms[index] = newRooms.splice(index + 1, 1, newRooms[index])[0];

	emit("update:modelValue", {
		...props.modelValue,
		rooms: newRooms,
	});
};

const addFloor = (index: number) => {
	props.modelValue.rooms[index].floor = getMaxFloor() + 1;
};

// Watch для автоматического распределения конструкций
watch(constructionMode, (newMode) => {
	distributeConstructionsAutomatically(newMode);
});

// Watch для изменения конструкций в режиме auto
watch(
	() => props.modelValue.constructions,
	() => {
		distributeConstructionsAutomatically(constructionMode.value);
	},
	{ deep: true }
);

// Watch для изменения помещений в режиме auto
watch(
	() => props.modelValue.rooms,
	() => {
		distributeConstructionsAutomatically(constructionMode.value);
	},
	{ deep: true }
);

const getRoomConstructionsById = (
	room: RoomType,
	ids: number[]
): RoomConstruction[] => {
	const newRoomConstructions: RoomConstruction[] = [];

	room.roomConstructions?.forEach((construction) => {
		if (ids.includes(construction.id)) {
			newRoomConstructions.push(construction);
		}
	});

	return newRoomConstructions;
};

const getWindowConstructions = (room: RoomType): RoomConstruction[] => {
	const idsWindowConstructions = props.modelValue.constructions
		?.filter((construction) => construction.surface?.type === "window")
		.map((construction) => construction.id) || [];

	return getRoomConstructionsById(room, idsWindowConstructions);
};

const getUnlockedConstructions = (room: RoomType): RoomConstruction[] => {
	const idsUnlockedConstructions = room.roomConstructions
		?.filter((c) => c.unlocked)
		.map((construction) => construction.id) || [];

	return getRoomConstructionsById(room, idsUnlockedConstructions);
};

const getAreaMultiplier = (
	room: RoomType,
	construction?: Construction
): number => {
	if (!construction) return 0;

	const maxFloor = getMaxFloor();
	const totalAreaFirstFloor = getTotalAreaByFloor(1);
	const totalAreaLastFloor = getTotalAreaByFloor(maxFloor);
	const totalVolume = getTotalVolume();

	const surfaceType = (construction.surface?.type as SurfaceType) || "other";
	let areaMultiplier = 0;

	if (
		surfaceType === "floor" &&
		room.floor === 1 &&
		totalAreaFirstFloor > 0
	) {
		areaMultiplier = room.area / totalAreaFirstFloor;
	} else if (
		surfaceType === "roof" &&
		room.floor === maxFloor &&
		totalAreaLastFloor > 0
	) {
		areaMultiplier = room.area / totalAreaLastFloor;
	} else if (
		["wall", "window", "other"].includes(surfaceType) &&
		totalVolume > 0
	) {
		const roomVolume = room.area * getRoomHeight(room);
		areaMultiplier = roomVolume / totalVolume;
	}

	return areaMultiplier;
};

// Функция автоматического распределения конструкций
const distributeConstructionsAutomatically = (
	mode: RoomConstructionMethod = "auto"
) => {
	if (
		!props.modelValue.rooms.length ||
		!props.modelValue.constructions.length ||
		mode === "manual"
	) {
		return;
	}

	const decreaseAreaForConstructions = props.modelValue.rooms
		.map((room) =>
			room.roomConstructions
				?.filter((c) => c.unlocked)
				.map((c) => ({
					id: c.id,
					area: c.area,
					areaMultiplier: getAreaMultiplier(
						room,
						props.modelValue.constructions.find(
							(construction) => construction.id === c.id
						)
					),
				})) || []
		)
		.flat()
		.reduce((acc, curr) => {
			acc[curr.id] = {
				area: (acc[curr.id]?.area || 0) + curr.area,
				areaMultiplier:
					(acc[curr.id]?.areaMultiplier || 0) + curr.areaMultiplier,
			};
			return acc;
		}, {} as Record<number, { area: number; areaMultiplier: number }>);

	const updatedRooms = props.modelValue.rooms.map((room) => {
		// Очищаем существующие конструкции
		const newRoomConstructions: RoomConstruction[] =
			mode === "windows" ? getWindowConstructions(room) : [];

		newRoomConstructions.push(...getUnlockedConstructions(room));

		// Получаем все конструкции
		props.modelValue.constructions.forEach((construction) => {
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
				const area =
					decreaseAreaForConstructions[construction.id]?.area || 0;
				const decreaseAreaMultiplier =
					decreaseAreaForConstructions[construction.id]
						?.areaMultiplier || 0;
				let deltaArea =
					((construction.area * decreaseAreaMultiplier - area) *
						areaMultiplier) /
					(1 - decreaseAreaMultiplier);
				let calcArea = construction.area * areaMultiplier;

				if (calcArea + deltaArea < 0) {
					deltaArea = -calcArea;
					emit("alertConstructions");
				}

				//отличие больше чем на 50% от расчетного
				if (Math.abs(deltaArea) > 0.5 * Math.abs(calcArea)) {
					emit("alertConstructions");
				}

				const newRoomConstruction: RoomConstruction = {
					id: construction.id,
					enabled: true,
					area: Math.round((calcArea + deltaArea) * 10) / 10,
					count:
						construction.surface?.type === "window" ? 1 : undefined,
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

	// Вызываем emit только если есть изменения
	if (hasRoomsChanges(updatedRooms, props.modelValue.rooms)) {
		emit("update:modelValue", {
			...props.modelValue,
			rooms: updatedRooms,
		});
	}
};

// Вспомогательные функции для расчета площадей и объемов
const getTotalAreaByFloor = (floor: number): number => {
	return props.modelValue.rooms
		.filter((room) => room.floor === floor)
		.reduce((sum, room) => sum + room.area, 0);
};

const getTotalVolume = (): number => {
	return props.modelValue.rooms.reduce(
		(sum, room) => sum + room.area * getRoomHeight(room),
		0
	);
};

// Функция для проверки изменений в помещениях
const hasRoomsChanges = (
	updatedRooms: RoomType[],
	oldRooms: RoomType[]
): boolean => {
	return updatedRooms.some((updatedRoom, index) => {
		const currentRoom = oldRooms[index];
		if (!currentRoom) return true;

		// Сравниваем roomConstructions
		if (
			updatedRoom.roomConstructions.length !==
			currentRoom.roomConstructions.length
		) {
			return true;
		}

		const sortedCurrentRoomConstructions =
			currentRoom.roomConstructions.sort((a, b) => a.id - b.id);

		// Сравниваем содержимое roomConstructions
		return updatedRoom.roomConstructions
			.sort((a, b) => a.id - b.id)
			.some((updatedConstruction, constIndex) => {
				const currentConstruction =
					sortedCurrentRoomConstructions[constIndex];
				if (!currentConstruction) return true;

				return (
					updatedConstruction.id !== currentConstruction.id ||
					updatedConstruction.area !== currentConstruction.area ||
					updatedConstruction.enabled !==
						currentConstruction.enabled ||
					updatedConstruction.count !== currentConstruction.count ||
					updatedConstruction.unlocked !==
						currentConstruction.unlocked
				);
			});
	});
};
</script>
