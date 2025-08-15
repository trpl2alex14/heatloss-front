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

		<!-- Список помещений -->
		<div class="flex flex-col gap-6">
			<Room
				v-for="(room, index) in modelValue.rooms"
				:key="room.id"
				v-model="modelValue.rooms[index]"
				:constructions="modelValue.constructions"
				:min-temp="modelValue.freezeTemp"
				:required-temp="modelValue.requiredTemp"
				:floors="getMaxFloor()"
				@move-up="moveRoomUp(index)"
				@move-down="moveRoomDown(index)"
				@duplicate="duplicateRoom(index)"
				@remove="removeRoom(index)"
				@add-floor="addFloor(index)"
			/>

			<!-- Кнопка добавления помещения -->
			<BaseButton
				icon="house"
				label="Добавить помещение"
				severity="primary"
				@click="addRoom"
				class="self-end"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import Room from "./Room.vue";
import type {
	CalculationDetails,
	Room as RoomType,
} from "../types/calculation";

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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

	const newRooms = [...props.modelValue.rooms];
	const temp = newRooms[index];
	newRooms[index] = newRooms[index - 1];
	newRooms[index - 1] = temp;

	emit("update:modelValue", {
		...props.modelValue,
		rooms: newRooms,
	});
};

const moveRoomDown = (index: number) => {
	if (index === props.modelValue.rooms.length - 1) return;

	const newRooms = [...props.modelValue.rooms];
	const temp = newRooms[index];
	newRooms[index] = newRooms[index + 1];
	newRooms[index + 1] = temp;

	emit("update:modelValue", {
		...props.modelValue,
		rooms: newRooms,
	});
};

const addFloor = (index: number) => {
	props.modelValue.rooms[index].floor = getMaxFloor() + 1;
};
</script>
