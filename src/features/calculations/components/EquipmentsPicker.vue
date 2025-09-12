<template>
	<div class="equipments-picker">
		<!-- Заголовок -->
		<div class="my-4">
			<h3 v-if="showTitle" class="text-xl font-normal text-gray-900 ">
				Добавить оборудование
			</h3>
			<p class="text-md text-gray-600 mt-1">
				{{ roomName }}
				<span v-if="selectedEquipment.length > 0"
					>(выбрано {{ selectedEquipment.length }})</span
				>
			</p>
		</div>

		<!-- Теги для фильтрации -->
		<div v-if="availableTags.length > 0" class="mb-4">
			<div class="flex flex-wrap gap-2">
				<template v-for="tag in availableTags" :key="tag">
					<BaseButton
						v-if="!selectedTags.includes(tag)"
						:label="`#${tag as string}`"
						variant="link"
						size="small"
						class="py-0!"
						@click="addTagFilter(tag as string)"
					/>
					<BaseChip
						v-else
						:label="tag as string"
						removable
						class="bg-blue-100 text-blue-800"
						@remove="removeTagFilter(tag as string)"
					/>
				</template>
			</div>
		</div>

		<div class="flex gap-3">
			<!-- Левая панель - Категории -->
			<div class="min-w-52">
				<BaseListbox
					v-model="selectedCategory"
					:options="categoryOptions"
					option-label="label"
					option-value="value"
					placeholder="Выберите категорию"
					class="w-full"
				/>
			</div>

			<!-- Правая панель - Список оборудования -->
			<div class="flex-1">
				<!-- Список оборудования -->
				<div v-if="filteredEquipments.length > 0">
					<BaseListbox
						v-model="selectedEquipment"
						:options="filteredEquipments"
						filter
						multiple
						option-label="name"
						option-value="id"
						placeholder="Выберите оборудование"
						class="w-full"
						listStyle="max-height:35vh; min-height:35vh;"
					>
						<template #option="{ option }">
							<div class="equipment-item p-0 w-full">
								<div class="flex items-center gap-3">
									<!-- Фото оборудования -->
									<div class="flex-shrink-0">
										<img
											v-if="option.photo"
											:src="option.photo"
											:alt="option.name"
											class="w-8 h-8 object-cover rounded"
										/>
										<div
											v-else
											class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
										>
											<span class="text-gray-500 text-xs"
												>⚡</span
											>
										</div>
									</div>

									<!-- Информация об оборудовании -->
									<div class="flex-1 min-w-0">
										<h5
											class="text-sm font-medium text-gray-900 mb-1"
										>
											{{ option.name }}
										</h5>
										<p class="text-xs text-gray-500">
											{{ option.category }}
										</p>
									</div>

									<!-- Цена -->
									<div class="flex-shrink-0">
										<span
											class="text-sm font-semibold text-gray-900"
										>
											{{ option.price.toLocaleString() }}₽
										</span>
									</div>
								</div>
							</div>
						</template>
					</BaseListbox>
				</div>

				<!-- Сообщение об отсутствии оборудования -->
				<div
					v-else-if="!isLoading"
					class="text-center py-8 text-gray-500 min-h-[38vh]"
				>
					<p>Оборудование не найдено</p>
				</div>
			</div>
		</div>

		<!-- Кнопки действий -->
		<div class="flex gap-3 pt-4 mt-6 justify-end">
			<BaseButton
				label="Добавить"
				icon="plus"
				:disabled="selectedEquipment.length === 0"
				severity="danger"
				@click="addToRoom"
			/>
			<BaseButton
				label="Закрыть"
				variant="outlined"
				severity="danger"
				@click="$emit('cancel')"
			/>
		</div>

		<!-- Индикатор загрузки -->
		<div v-if="isLoading" class="text-center py-4">
			<p class="text-gray-500">Загрузка оборудования...</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import BaseListbox from "@/shared/components/ui/BaseListbox.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import { useEquipments } from "../api/equipments";
import type { Product } from "@/shared/types/produtcs";
import type { EquipmentItem, Equipment } from "../types";
import { useSettings } from "@/features/settings/composables/useSettings";

interface Props {
	product: Product;
	roomId: number;
	roomName: string;
	exclude?: number[];
	showTitle?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	add: [equipment: Equipment[]];
	cancel: [];
}>();

// Состояние компонента
const selectedCategory = ref<string>("all");
const selectedEquipment = ref<number[]>([]);
const selectedTags = ref<string[]>([]);

const { powerProperty } = useSettings();

const product = computed(() => props.product);

// API для загрузки оборудования
const { data: equipments, isLoading, loadData } = useEquipments(product);

// Загрузка данных при монтировании
onMounted(() => {
	loadData();
});

// Следим за изменением продукта и перезагружаем данные
watch(
	product,
	() => {
		selectedCategory.value = "all";
		selectedEquipment.value = [];
		selectedTags.value = [];
		loadData();
	}
);

// Вычисляемые свойства
const categoryOptions = computed(() => {
	if (!equipments.value?.data) return [];

	const categories = [
		...new Set(
			equipments.value.data.map((item: EquipmentItem) => item.category)
		),
	];

	// Добавляем категорию "Все" в начало списка
	return [
		{ label: "Все", value: "all" },
		...categories.map((category) => ({
			label: category,
			value: category,
		})),
	];
});

const availableTags = computed(() => {
	if (!equipments.value?.data) return [];

	const allTags = equipments.value.data.flatMap(
		(item: EquipmentItem) => item.tags
	);
	const uniqueTags = [...new Set(allTags)] as string[];

	// Сортируем: сначала выбранные теги, потом остальные
	return uniqueTags.sort((a, b) => {
		const aSelected = selectedTags.value.includes(a);
		const bSelected = selectedTags.value.includes(b);

		if (aSelected && !bSelected) return -1; // a выбран, b нет
		if (!aSelected && bSelected) return 1; // a не выбран, b выбран
		return a.localeCompare(b); // если оба выбраны или оба не выбраны, сортируем по алфавиту
	});
});

const filteredEquipments = computed(() => {
	if (!equipments.value?.data || !selectedCategory.value) return [];

	let filtered = equipments.value.data;

	// Исключаем продукты из списка exclude
	if (props.exclude && props.exclude.length > 0) {
		filtered = filtered.filter(
			(item: EquipmentItem) => !props.exclude!.includes(item.id)
		);
	}

	// Если выбрана не категория "Все", то фильтруем по категории
	if (selectedCategory.value !== "all") {
		filtered = filtered.filter(
			(item: EquipmentItem) => item.category === selectedCategory.value
		);
	}

	// Фильтрация по тегам
	if (selectedTags.value.length > 0) {
		filtered = filtered.filter((item: EquipmentItem) =>
			selectedTags.value.some((tag) => item.tags.includes(tag))
		);
	}

	return filtered;
});

// Методы
const addTagFilter = (tag: string) => {
	if (!selectedTags.value.includes(tag)) {
		selectedTags.value.push(tag);
	}
};

const removeTagFilter = (tag: string) => {
	selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const clearFilters = () => {
	selectedTags.value = [];
	selectedEquipment.value = [];
};

const addToRoom = () => {
	if (selectedEquipment.value.length === 0) return;

	// Получаем все выбранное оборудование
	const selectedEquipments =
		equipments.value?.data?.filter((item: EquipmentItem) =>
			selectedEquipment.value.includes(item.id)
		) || [];

	// Преобразуем EquipmentItem[] в Equipment[] с quantity = 1
	const equipmentForRoom: Equipment[] = selectedEquipments.map(
		(item: EquipmentItem) => {
			// Ищем значение power в properties
			let powerValue: number | undefined;
			if (item.properties && powerProperty) {
				const powerProp = item.properties.find(
					(prop) => prop.key === powerProperty
				);
				if (powerProp && typeof powerProp.value === "number") {
					powerValue = powerProp.value;
				}
			}

			return {
				id: item.id,
				name: item.name,
				quantity: 1,
				price: item.price,
				power: powerValue,
				article: item.article || "",
			};
		}
	);

	// Эмитим событие с массивом Equipment
	emit("add", equipmentForRoom);

	// Сброс выбора
	clearFilters();
};
</script>
