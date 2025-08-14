<template>
	<div class="flex flex-col gap-3 rounded-xl relative bg-gray-50">
		<div class="p-4">
			<!-- Заголовок с основными полями -->
			<div class="flex items-center gap-3.5">
				<!-- Выбор этажа -->
				<div class="w-auto">
					<BaseSelectButton
						v-model="floorValue"
						:options="floorOptions"
						option-label="label"
						option-value="value"
					/>
				</div>

				<!-- Кнопка добавления этажа -->
				<BaseButton icon="plus" label="Этаж" text severity="primary" />

				<!-- Переключатель мансарды -->
				<div class="flex items-center gap-2.5">
					<BaseToggleSwitch
						v-model="isMansardValue"
						label="Мансарда"
					/>
				</div>
			</div>

			<!-- Основные параметры помещения -->
			<div class="flex items-center gap-3.5 mt-4">
				<!-- Название помещения -->
				<div class="flex-1">
					<BaseInputText
						v-model="nameValue"
						label="Название"
						placeholder="Введите название помещения"
					/>
				</div>

				<!-- Размеры помещения -->
				<div class="flex items-center gap-2">
					<div class="w-20">
						<BaseInputNumber
							v-model="widthValue"
							label="Ширина"
							:minFractionDigits="1"
							placeholder="0"
							:min="0"
							:suffix="' м'"
							:disabled="useDirectArea"
							@click="switchToDimensionsMode"
						/>
					</div>

					<div class="text-gray-500">х</div>

					<div class="w-20">
						<BaseInputNumber
							v-model="lengthValue"
							label="Длина"
							:minFractionDigits="1"
							placeholder="0"
							:min="0"
							:suffix="' м'"
							:disabled="useDirectArea"
							@click="switchToDimensionsMode"
						/>
					</div>

					<div class="text-gray-500">=</div>

					<div class="w-26">
						<BaseInputNumber
							v-model="directAreaValue"
							label="Площадь"
							:minFractionDigits="1"
							:suffix="' м²'"
							:disabled="!useDirectArea"
							:readonly="!useDirectArea"
							@click="switchToAreaMode"
						/>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<div class="w-24" v-if="isMansardValue">
						<BaseInputNumber
							v-model="minHeightValue"
							label="Мин. высота"
							placeholder="0"
							:min="0"
							:minFractionDigits="1"
							:suffix="' м'"
						/>
					</div>

					<div class="w-24">
						<BaseInputNumber
							v-model="heightValue"
							label="Высота"
							placeholder="0"
							:min="0"
							:minFractionDigits="1"
							:suffix="' м'"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Заголовок секции конструкций -->
		<h3 class="px-4">Ограждающей конструкции помещения</h3>

		<!-- Переключатели режимов -->
		<div class="px-4">
			<BaseSelectButton
				v-model="constructionMode"
				:options="constructionModeOptions"
				option-label="label"
				option-value="value"
			/>
		</div>

		<!-- Список конструкций помещения -->
		<div class="flex flex-col gap-2 px-4">
			<RoomConstruction
				v-for="(
					roomConstruction, index
				) in modelValue.roomConstructions"
				:key="roomConstruction.id"
				v-model="modelValue.roomConstructions[index]"
				:construction="getConstructionById(roomConstruction.id)"
				:min-temp="minTemp"
				:required-temp="requiredTemp"
				@remove="removeRoomConstruction(index)"
			/>

			<!-- Кнопка выбора конструкций -->
			<div class="flex justify-end">
				<BaseButton
					icon="bars"
					label="Выбрать"
					text
					severity="primary"
					@click="toggleConstructionPopover"
				/>
			</div>

			<!-- Popover для выбора конструкций -->
			<Popover ref="constructionPopoverRef">
				<div class="px-2 pb-2 min-w-80">
					<h4 class="font-medium mb-3">Конструкции</h4>
					<div class="flex flex-col gap-2">
						<div
							v-for="construction in constructions"
							:key="construction.id"
							class="flex items-center gap-2"
						>
							<BaseToggleSwitch
								v-model="selectedConstructions[construction.id]"
								:label="construction.name"
								@update:model-value="
									(value) =>
										toggleConstruction(
											construction.id,
											value
										)
								"
							/>
						</div>
					</div>
				</div>
			</Popover>
		</div>

		<!-- Заголовок секции оборудования -->
		<div class="px-4">
			<h3>Отопительное оборудование</h3>
			<p class="text-sm text-gray-600">
				Перечень оборудования рекомендованного к установке
			</p>
		</div>

		<!-- Список оборудования -->
		<div class="flex flex-col gap-2 px-4">
			<RoomEquipment
				v-for="(equipment, index) in modelValue.equipment"
				:key="equipment.id"
				v-model="modelValue.equipment[index]"
				:index="index"
				@remove="removeEquipment(index)"
			/>

			<!-- Кнопки действий для оборудования -->
			<div class="flex gap-5 self-end">
				<BaseButton
					icon="calculator"
					label="Авто"
					text
					severity="primary"
					@click="$emit('auto')"
				/>
				<BaseButton
					icon="plus"
					label="Добавить оборудование"
					text
					severity="primary"
					@click="$emit('addEquipment')"
				/>
			</div>
		</div>



		<!-- Кнопки действий -->
		<div class="absolute top-0 right-0 flex gap-1">
			<BaseButton
				icon="arrow-up"
				text
				severity="secondary"
				@click="$emit('moveUp')"
			/>
			<BaseButton
				icon="arrow-down"
				text
				severity="secondary"
				@click="$emit('moveDown')"
			/>
			<BaseButton
				icon="copy"
				text
				severity="secondary"
				@click="$emit('duplicate')"
			/>
			<BaseButton
				icon="eye-slash"
				text
				severity="secondary"
				@click="$emit('hide')"
			/>
			<BaseButton
				icon="trash"
				text
				severity="secondary"
				@click="$emit('remove')"
			/>
		</div>

		<!-- Итоговые результаты -->
		<div
			class="flex justify-end items-center gap-3.5 p-4 bg-gray-200 rounded-xl"
		>
			<!-- Дополнительный источник тепла -->
			<div class="flex items-center gap-3.5 px-4">
				<div class="w-34" v-if="additionalHeatSource">
					<BaseInputNumber
						v-model="additionalHeatPower"
						label="Мощность"
						placeholder="0"
						:min="0"
						:suffix="' Вт'"
					/>
				</div>
				<BaseToggleSwitch
					v-model="additionalHeatSource"
					label="Дополнительный источник тепла"
				/>
			</div>		
			<div class="flex-1"></div>
			
			<div class="w-42">
				<BaseInputNumber
					:model-value="totalHeatLoss"
					:label="`Теплопотери в ${minTemp}°C`"
					:disabled="true"
					:readonly="true"
					:suffix="' Вт'"					
				/>
			</div>
			<div class="w-42">
				<BaseInputNumber
					:model-value="totalEquipmentPower"
					label="Мощность оборудования"
					:disabled="true"
					:readonly="true"
					:suffix="' Вт'"
					:style="getStyleHeatLoss()"
				/>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
	BaseSelectButton,
	BaseInputText,
	BaseInputNumber,
	BaseButton,
	BaseToggleSwitch,
} from "@/shared/components";
import Popover from "primevue/popover";
import RoomConstruction from "./RoomConstruction.vue";
import RoomEquipment from "./RoomEquipment.vue";
import type { Room, Construction } from "../types/calculation";

interface Props {
	modelValue: Room;
	constructions: Construction[];
	minTemp: number;
	requiredTemp: number;
	floors: number;
}

interface Emits {
	(e: "update:modelValue", value: Room): void;
	(e: "auto"): void;
	(e: "addEquipment"): void;
	(e: "moveUp"): void;
	(e: "moveDown"): void;
	(e: "duplicate"): void;
	(e: "hide"): void;
	(e: "remove"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Refs
const constructionPopoverRef = ref();
const selectedConstructions = ref<Record<number, boolean>>({});
const additionalHeatSource = ref(false);
const additionalHeatPower = ref(0);
const useDirectArea = ref(false);

// Вычисляемые свойства для v-model
const nameValue = computed({
	get: () => props.modelValue.name,
	set: (value: string) => {
		emit("update:modelValue", {
			...props.modelValue,
			name: value,
		});
	},
});

const floorValue = computed({
	get: () => props.modelValue.floor,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			floor: value,
		});
	},
});

const isMansardValue = computed({
	get: () => props.modelValue.isMansard || false,
	set: (value: boolean) => {
		emit("update:modelValue", {
			...props.modelValue,
			isMansard: value,
			// Если мансарда отключена, устанавливаем minHeight равным height
			minHeight: value
				? props.modelValue.minHeight
				: props.modelValue.height,
		});
	},
});

const widthValue = computed({
	get: () => props.modelValue.width || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			width: value,
		});
	},
});

const lengthValue = computed({
	get: () => props.modelValue.length || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			length: value,
		});
	},
});

const heightValue = computed({
	get: () => props.modelValue.height || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			height: value,
		});
	},
});

const minHeightValue = computed({
	get: () => props.modelValue.minHeight || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			minHeight: value,
		});
	},
});

// Вычисляемая площадь
const calculatedArea = computed(() => {
	return (widthValue.value || 0) * (lengthValue.value || 0);
});

// Прямое значение площади
const directAreaValue = computed({
	get: () => props.modelValue.area || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			area: value,
		});
	},
});

// Синхронизация площади при изменении размеров
watch([widthValue, lengthValue], () => {
	if (!useDirectArea.value) {
		emit("update:modelValue", {
			...props.modelValue,
			area: calculatedArea.value,
		});
	}
});

// Синхронизация размеров при изменении площади напрямую
watch(directAreaValue, (newArea) => {
	if (useDirectArea.value && newArea > 0) {
		const sideLength = Math.sqrt(newArea);
		emit("update:modelValue", {
			...props.modelValue,
			area: newArea,
			width: sideLength,
			length: sideLength,
		});
	}
});

// Синхронизация minHeight при изменении height, если мансарда не активна
watch(heightValue, (newHeight) => {
	if (!isMansardValue.value) {
		emit("update:modelValue", {
			...props.modelValue,
			minHeight: newHeight,
		});
	}
});

// Опции для выбора этажа
const floorOptions = computed(() => {
	return Array.from({ length: props.floors }, (_, i) => ({
		value: i + 1,
		label: `${i + 1} этаж`,
	}));
});

// Режим выбора конструкций
const constructionMode = ref("auto");
const constructionModeOptions = [
	{ value: "auto", label: "Авто" },
	{ value: "windows", label: "Витражи" },
	{ value: "manual", label: "Указать размеры" },
];

// Методы для работы с конструкциями
const getConstructionById = (id: number): Construction => {
	return (
		props.constructions.find((c) => c.id === id) || props.constructions[0]
	);
};

const removeRoomConstruction = (index: number) => {
	const constructionToRemove = props.modelValue.roomConstructions[index];
	if (constructionToRemove) {
		// Обновляем состояние selectedConstructions
		selectedConstructions.value[constructionToRemove.id] = false;

		// Удаляем конструкцию из списка
		const newConstructions = [...props.modelValue.roomConstructions];
		newConstructions.splice(index, 1);
		emit("update:modelValue", {
			...props.modelValue,
			roomConstructions: newConstructions,
		});
	}
};

const toggleConstructionPopover = (event: Event) => {
	// Инициализируем selectedConstructions при открытии popover
	if (!selectedConstructions.value[props.constructions[0]?.id]) {
		props.constructions.forEach((construction) => {
			const isSelected = props.modelValue.roomConstructions.some(
				(rc) => rc.id === construction.id
			);
			selectedConstructions.value[construction.id] = isSelected;
		});
	}
	constructionPopoverRef.value.toggle(event);
};

const toggleConstruction = (constructionId: number, isSelected: boolean) => {
	const construction = props.constructions.find(
		(c) => c.id === constructionId
	);
	if (!construction) return;

	if (isSelected) {
		// Добавляем конструкцию
		const newRoomConstruction = {
			id: construction.id,
			enabled: true,
			area: construction.area || 0,
			count: construction.surface?.type === "window" ? 1 : undefined,
			heatLoss: 0,
		};

		emit("update:modelValue", {
			...props.modelValue,
			roomConstructions: [
				...props.modelValue.roomConstructions,
				newRoomConstruction,
			],
		});
	} else {
		// Убираем конструкцию
		const newConstructions = props.modelValue.roomConstructions.filter(
			(rc) => rc.id !== constructionId
		);

		emit("update:modelValue", {
			...props.modelValue,
			roomConstructions: newConstructions,
		});
	}
};

// Методы для работы с оборудованием
const removeEquipment = (index: number) => {
	const newEquipment = [...props.modelValue.equipment];
	newEquipment.splice(index, 1);
	emit("update:modelValue", {
		...props.modelValue,
		equipment: newEquipment,
	});
};

// Вычисляемые итоговые значения
const totalEquipmentPower = computed(() => {
	return props.modelValue.equipment.reduce(
		(sum, eq) => sum + eq.quantity * (eq.power || 0),
		additionalHeatSource.value ? additionalHeatPower.value || 0 : 0
	);
});

const totalHeatLoss = computed(() => {
	return props.modelValue.roomConstructions.reduce(
		(sum, rc) => sum + (rc.enabled ? rc.heatLoss : 0),
		0
	);
});

// Методы переключения режимов ввода площади
const switchToDimensionsMode = () => {
	if (useDirectArea.value) {
		useDirectArea.value = false;
	}
};

const switchToAreaMode = () => {
	if (!useDirectArea.value) {
		useDirectArea.value = true;
	}
};

// Функция для стилизации поля теплопотерь
const getStyleHeatLoss = () => {
	return {
		"--p-inputtext-border-color":
			totalHeatLoss.value - totalEquipmentPower.value < 100
				? totalEquipmentPower.value - totalHeatLoss.value < 100
					? "var(--p-surface-300)"
					: "var(--color-green-500)"
				: "var(--color-red-500)",
	};
};
</script>
