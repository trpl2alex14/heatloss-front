<template>
	<div class="flex flex-col gap-3.5">
		<!-- Заголовок секции -->
		<div class="flex flex-col gap-1.5">
			<h3 class="text-2xl font-normal text-gray-900">Помещения</h3>
			<p class="text-md font-normal text-gray-600">
				Перечень всех помещений на объекте, даже тех где установка
				оборудования не предполагается
			</p>
		</div>

		<div class="flex items-center gap-2 mb-4">
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
		<div class="flex flex-col gap-8">
			<TransitionGroup name="room-fade">
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
					:product="modelValue.product || 'all'"
					:tags="modelValue.tags"
					@move-up="moveRoomUp(index)"
					@move-down="moveRoomDown(index)"
					@duplicate="duplicateRoom(index)"
					@remove="removeRoom(index)"
					@add-floor="addFloor(index)"
					@add-equipment="addEquipment(index)"
					class="shadow-md shadow-gray-300 hover:shadow-lg transition-shadow"
				/>
			</TransitionGroup>

			<EmptyBox
				v-if="modelValue.rooms.length === 0"
				label="помещения отсутствуют"
			/>

			<!-- Кнопка добавления помещения -->
			<BaseButton
				icon="home"
				label="Добавить помещение"
				severity="primary"
				@click="newRoom"
				class="self-start"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, defineAsyncComponent } from "vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseSelectButton from "@shared/components/ui/BaseSelectButton.vue";
import Room from "./Room.vue";
import EmptyBox from "@shared/components/EmptyBox.vue";
import type {
	CalculationDetails, Equipment,
	Room as RoomType, RoomConstruction,
	RoomConstructionMethod,
	RoomFromRequest,
	Construction
} from "../types";
import { useAutoDistribution } from "../composables/useAutoDistribution";
import { useCalculator } from "../composables/useCalculator";
import { useDialog } from 'primevue/usedialog';

const equipmentsPicker = defineAsyncComponent(() => import('./EquipmentPickerDialog.vue'));

interface Props {
	modelValue: CalculationDetails;
}

interface Emits {
	(e: "update:modelValue", value: CalculationDetails): void;
	(e: "alertConstructions"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { getMaxFloor } = useCalculator();

const dialog = useDialog();

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
		options.push({ value: "windows", label: "Авто (Кроме окон)" });
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

// Методы для работы с помещениями
const getNextRoomId = (): number => {
	if (!props.modelValue.rooms.length) return 1;
	return Math.max(...props.modelValue.rooms.map((room) => room.id)) + 1;
};

const newRoom = () => {
	const id = getNextRoomId();
	const lastRoom = props.modelValue.rooms.length ? props.modelValue.rooms[props.modelValue.rooms.length - 1] : null;
	const newRoom: RoomType = {
		id: id,
		name: `Комната ${id}`,
		area: 0,
		floor: lastRoom?.floor || 1,
		width: 0,
		length: 0,
		height: lastRoom?.height || 2.5,
		minHeight: lastRoom?.minHeight || 2.5,
		isMansard: lastRoom?.isMansard || false,
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

const addEquipment = (index: number) => {
	dialog.open(equipmentsPicker, {
        props: {
			showHeader: false,
            style: {
                width: '45vw',
            },
            modal: true
        },
		data: {
			product: props.modelValue.product,
			roomId: props.modelValue.rooms[index].id,
			roomName: props.modelValue.rooms[index].name,
			exclude: props.modelValue.rooms[index].equipment?.map((equipment: Equipment) => equipment.id) || [],
		},
		onClose: (value) => {
			if (!value?.data || !Array.isArray(value.data) || value.data.length === 0) {
				return;
			}

			emit("update:modelValue", {
				...props.modelValue,
				rooms: props.modelValue.rooms.map((room, roomIndex) => {
					if (roomIndex === index) {
						return {
							...room,
							manualEquip: true,
							equipment: [...room.equipment || [], ...value.data]
						};
					}
					return room;
				}),
			});
		}
	});
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

	const { distributeConstructions, isAlertConstructions }
		= useAutoDistribution(props.modelValue.rooms, props.modelValue.constructions);
	const updatedRooms = distributeConstructions(mode);

	if (isAlertConstructions.value) {
		emit("alertConstructions");
	}

	// Вызываем emit только если есть изменения
	if (hasRoomsConstructionsChanges(updatedRooms, props.modelValue.rooms)) {
		emit("update:modelValue", {
			...props.modelValue,
			rooms: updatedRooms,
		});
	}
};

// Функция для проверки изменений в помещениях
const hasRoomsConstructionsChanges = (
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
			currentRoom.roomConstructions.sort((a: RoomConstruction, b: RoomConstruction) => a.id - b.id);

		// Сравниваем содержимое roomConstructions
		return updatedRoom.roomConstructions
			.sort((a: RoomConstruction, b: RoomConstruction) => a.id - b.id)
			.some((updatedConstruction: RoomConstruction, constIndex: number) => {
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

const addRooms = (rooms: RoomFromRequest[]) => {
	let index = 0;
	const newRooms = rooms.map((room: RoomFromRequest) => {
		const id = ++index;
		let roomConstructions = [];
		if(room.windows && room.windowsArea){
			const windowsConstruction = props.modelValue.constructions.find(
				(c: Construction) => c.surface?.type === 'window'
			);
			if(windowsConstruction) {
				roomConstructions.push({
					id: windowsConstruction.id,
					enabled: true,
					area: room.windowsArea,
					count: room.windows,
					heatLoss: 0,
				});
			}
		}

		return {
			id: id,
			name: room.name || `Комната ${id}`,
			area: room.area,
			floor: room.floor,
			width: 0,
			length: 0,
			height: room.height,
			minHeight: room.minHeight,
			isMansard: room.isMansard,
			defaultWindows: room.windows,
			defaultWindowsArea: room.windowsArea,
			heatLoss: 0,
			baseHeat: 0,
			roomConstructions: roomConstructions,
			equipment: [],
		};
	})

	emit("update:modelValue", {
		...props.modelValue,
		rooms: [...newRooms],
	});
}

defineExpose({
	addRooms
});
</script>


<style lang="css">
/* 1. объявление transition */
.room-fade-move,
.room-fade-enter-active,
.room-fade-leave-active {
	transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. объявление enter from и leave to состояний */
.room-fade-enter-from,
.room-fade-leave-to {
	opacity: 0;
	transform: scaleY(0.01) translate(30px, 0);
}

/* 3. убедитесь, что элементы удалены из потока layout,
      чтобы можно было правильно рассчитать анимацию перемещения */
.room-fade-leave-active {
	position: absolute;
}
</style>
