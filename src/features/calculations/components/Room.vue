<template>
	<div
		class="flex flex-col gap-3 rounded-xl relative bg-gray-100 border-1 border-gray-400 overflow-hidden"
	>
		<div class="pt-8 pb-4 px-4">
			<div class="flex items-center gap-3.5 mt-4 flex-wrap">
				<!-- Название помещения -->
				<div class="flex-1 min-w-[40%]">
					<BaseInputText
						v-model="nameValue"
						label="Название"
						placeholder="Введите название помещения"
						class="font-bold"
					/>
				</div>

				<div class="flex flex-1 items-center gap-2">
					<!-- Выбор этажа -->
					<div class="w-auto">
						<BaseSelectButton
							v-model="floorValue"
							:options="floorOptions"
							option-label="label"
							option-value="value"
							:allow-empty="false"
							class="border-1 border-gray-300"
						/>
					</div>

					<!-- Кнопка добавления этажа -->
					<BaseButton
						icon="plus"
						label="Этаж"
						text
						severity="primary"
						@click="addFloor"
					/>
				</div>
			</div>

			<!-- Основные параметры помещения -->
			<div class="flex items-center gap-3.5 mt-4">
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

				<div class="flex items-center gap-2">
					<!-- Переключатель мансарды -->
					<div class="flex items-center gap-2.5">
						<BaseToggleSwitch
							v-model="isMansardValue"
							label="Мансарда"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="px-4 flex flex-col gap-3" >
			<Transition name="slide-fade">
				<div
					class="flex flex-col gap-2 transition-all"
					v-if="props.constructions.length > 0"
					v-show="isShow"
				>
					<div class="flex items-center">
						<!-- Заголовок секции конструкций -->
						<h3>Ограждающие конструкции помещения</h3>

						<!-- Кнопка выбора конструкций -->
						<BaseButton
							icon="bars"
							label="Выбрать"
							text
							severity="primary"
							@click="toggleConstructionPopover"
							:disabled="modelValue.area === 0"
						/>
					</div>
					<!-- Список конструкций помещения -->
					<RoomConstruction
						v-for="(
							roomConstruction, index
						) in modelValue.roomConstructions"
						:key="roomConstruction.id"
						v-model="modelValue.roomConstructions[index]"
						:construction="getConstructionById(roomConstruction.id)"
						:min-temp="minTemp"
						:required-temp="requiredTemp"
						:is-auto-mode="isAutoMode(roomConstruction)"
						@remove="removeRoomConstruction(index)"
					/>

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
										v-model="
											selectedConstructions[construction.id]
										"
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
			</Transition>

			<div class="bg-white my-4 p-4 rounded-xl">
				<div class="flex gap-4 justify-between items-center mb-4">
					<!-- Заголовок секции оборудования -->
					<div>
						<h3>Отопительное оборудование</h3>
						<p class="text-sm text-gray-600">
							Перечень оборудования рекомендованного к установке
						</p>
					</div>

					<!-- Кнопки действий для оборудования -->
					<div class="flex gap-5 self-end items-center">
						<BaseToggleSwitch
							v-model="manualEquipValue"
							label="Авто расчёт"
							:disabled="totalHeatLoss === 0"
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

				<!-- Список оборудования -->
				<div class="flex flex-col gap-2">
					<RoomEquipment
						v-for="(equipment, index) in modelValue.equipment"
						:key="equipment.id"
						v-model="modelValue.equipment[index]"
						:index="index"
						:disabled="manualEquipValue"
						@remove="removeEquipment(index)"
					/>

					<EmptyBox
						v-if="!modelValue.equipment || modelValue.equipment.length === 0"
						label="оборудование отсутствует"
						class="bg-white min-h-15"
					/>
				</div>
			</div>
		</div>

		<!-- Кнопки действий -->
		<div class="absolute top-0 right-0 flex gap-1 bg-gray-200 left-0 justify-between items-center">
			<div class="pl-4">
				<p class="text-gray-600">Помещение</p>
			</div>
			<div class="flex gap-1">
				<BaseButton
					:icon="isShow ? 'eye-slash' : 'eye'"
					text
					severity="secondary"
					@click="isShow = !isShow"
				/>
				<BaseButton
					icon="arrow-up"
					text
					severity="secondary"
					@click="$emit('moveUp')"
					:disabled="isFirst"
				/>
				<BaseButton
					icon="arrow-down"
					text
					severity="secondary"
					@click="$emit('moveDown')"
					:disabled="isLast"
				/>
				<BaseButton
					icon="copy"
					text
					severity="secondary"
					@click="$emit('duplicate')"
				/>
				<BaseButton
					icon="trash"
					text
					severity="secondary"
					@click="$emit('remove')"
				/>
			</div>
		</div>

		<!-- Итоговые результаты -->
		<div
			class="flex justify-end items-center gap-3.5 p-4 bg-gray-200 rounded-xl"
		>
			<!-- Дополнительный источник тепла -->
			<div class="flex items-center gap-3.5 px-4">
				<div class="w-34" v-if="additionalHeatSource">
					<BaseInputNumber
						v-model="baseHeat"
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
import {computed, ref, watch} from "vue";
import {
	BaseButton,
	BaseInputNumber,
	BaseInputText,
	BaseSelectButton,
	BaseToggleSwitch,
	EmptyBox,
} from "@shared/components";
import type {Product} from "@shared/types/produtcs";
import {useDebounce} from "@shared/utils/debounce";
import Popover from "primevue/popover";
import RoomConstruction from "./RoomConstruction.vue";
import RoomEquipment from "./RoomEquipment.vue";
import type {
	Construction,
	Equipment,
	Room,
	RoomConstruction as RoomConstructionType,
	RoomConstructionMethod,
} from "../types";
import {useAutoEquip} from "../composables/useAutoEquip";
import {useEquipRules} from "../composables/useEquipRules";

interface Props {
	modelValue: Room;
	constructions: Construction[];
	minTemp: number;
	requiredTemp: number;
	floors: number;
	roomConstructionMethod: RoomConstructionMethod;
	isFirst?: boolean;
	isLast?: boolean;
	product: Product;
	tags?: string[];
}

interface Emits {
	(e: "update:modelValue", value: Room): void;
	(e: "addEquipment"): void;
	(e: "moveUp"): void;
	(e: "moveDown"): void;
	(e: "duplicate"): void;
	(e: "remove"): void;
	(e: "addFloor"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Refs
const constructionPopoverRef = ref();
const isShow = ref(true);
const selectedConstructions = ref<Record<number, boolean>>({});
const additionalHeatSource = ref(false);
const useDirectArea = ref(true);

const debounce = useDebounce();

const isAutoMode = (roomConstruction: RoomConstructionType) => {
	return (
		constructionMode.value === "auto" ||
		(constructionMode.value === "windows" &&
			props.constructions.find((c) => c.id === roomConstruction.id)
				?.surface?.type !== "window")
	);
};

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

const manualEquipValue = computed({
	get: () => !(props.modelValue.manualEquip || false),
	set: (value: boolean) => {
		emit("update:modelValue", {
			...props.modelValue,
			manualEquip: !value,
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


const baseHeat = computed({
	get: () => props.modelValue.baseHeat || 0,
	set: (value: number) => {
		emit("update:modelValue", {
			...props.modelValue,
			baseHeat: value,
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

watch(additionalHeatSource, (newAdditionalHeatSource) => {
	if(!newAdditionalHeatSource) {
		baseHeat.value = 0;
	}
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
	if (useDirectArea.value) {
		const sideLength = Math.round(Math.sqrt(newArea) * 10) / 10;
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

// Отслеживание изменений в props.constructions
watch(
	() => props.constructions,
	(newConstructions, oldConstructions) => {
		if (!oldConstructions) return;

		// Получаем ID удаленных конструкций
		const oldConstructionIds = new Set(oldConstructions.map((c) => c.id));
		const newConstructionIds = new Set(newConstructions.map((c) => c.id));
		const removedConstructionIds = [...oldConstructionIds].filter(
			(id) => !newConstructionIds.has(id)
		);

		// Удаляем конструкции из roomConstructions, если они были удалены из props.constructions
		if (removedConstructionIds.length > 0) {
			removedConstructionIds.forEach((id) => {
				removeRoomConstruction(
					props.modelValue.roomConstructions.findIndex(
						(rc: RoomConstructionType) => rc.id === id
					)
				);
			});
		}
	},
	{ deep: true }
);

// Опции для выбора этажа
const floorOptions = computed(() => {
	return Array.from({ length: props.floors }, (_, i) => ({
		value: i + 1,
		label: `${i + 1} этаж`,
	}));
});

// Режим выбора конструкций
const constructionMode = computed(() => props.roomConstructionMethod);

// Методы для работы с конструкциями
const getConstructionById = (id: number): Construction | undefined => {
	return props.constructions.find((c) => c.id === id);
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
	props.constructions.forEach((construction) => {
		selectedConstructions.value[construction.id] = props.modelValue.roomConstructions.some(
			(rc: RoomConstructionType) => rc.id === construction.id
		);
	});
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
			area: construction.surface?.type === "window" ? (props.modelValue.defaultWindowsArea || 0) : construction.area || 0,
			count: construction.surface?.type === "window" ? (props.modelValue.defaultWindows || 1) : undefined,
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
			(rc: RoomConstructionType) => rc.id !== constructionId
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
	return props.modelValue?.equipment?.reduce(
		(sum: number, eq: Equipment) => sum + eq.quantity * (eq.power || 0),
		additionalHeatSource.value ? (baseHeat.value || 0) : 0
	) || 0;
});

const totalHeatLoss = computed(() => {
	return props.modelValue?.roomConstructions?.reduce(
		(sum: number, rc: RoomConstructionType) => sum + (rc.enabled ? rc.heatLoss : 0),
		0
	) || 0;
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

// Метод для добавления этажа
const addFloor = () => {
	emit("addFloor");
};

const equipRules = useEquipRules(computed(() => props.tags || []));
// Композит для автоматического распределения оборудования
const { equipRoom, equipments } = useAutoEquip(computed(() => props.product), equipRules);

watch(totalHeatLoss, (newHeatLoss, oldHeatLoss) => {
	if(newHeatLoss !== oldHeatLoss) {
		emit("update:modelValue", {
			...props.modelValue,
			heatLoss: newHeatLoss,
		});
		debounce(() => autoEquip(), 100);
	}
});

watch(() => props.modelValue?.manualEquip, (newManualEquip, oldManualEquip) => {
	if(newManualEquip !== oldManualEquip) {
		autoEquip();
	}
});

watch(baseHeat, ()=>{
	debounce(() => autoEquip(), 100);
});

watch( equipRules, () => {
	debounce(() => autoEquip(), 100);
});

watch(()=> props?.product, (newProduct, oldProduct) => {
	if(newProduct !== oldProduct) {
		autoEquip();
	}
});

watch(equipments, (newEquipments, oldEquipments) => {
	if(!newEquipments?.data || !oldEquipments?.data) {
		return;
	}

	if(newEquipments?.data.length !== oldEquipments?.data.length) {
		autoEquip();
	}

	for(let i = 0; i < newEquipments?.data.length; i++) {
		if(newEquipments?.data[i].id !== oldEquipments?.data[i]?.id) {
			autoEquip();
		}
	}
});

// Функция автоматического распределения оборудования
const autoEquip = () => {
	if(props.modelValue.manualEquip){
		return;
	}

	const updatedEquipment = equipRoom(props.modelValue);

	emit("update:modelValue", {
		...props.modelValue,
		equipment: updatedEquipment,
	});
};
</script>


<style lang="css">
	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		max-height: 0;
		opacity: 0;
	}
</style>
