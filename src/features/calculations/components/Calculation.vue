<template>
	<div class="calculation-editor">
		<div class="bg-white rounded-xl border border-gray-300 p-6">
			<div class="mb-6">
				<h2 class="text-xl font-semibold text-gray-900">
					Редактирование расчета
				</h2>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Основная информация -->
				<div class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Название расчета
						</label>
						<BaseInput
							v-model="modelValue.title"
							placeholder="Введите название расчета"
							class="w-full"
						/>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Город
						</label>
						<BaseInput
							v-model="modelValue.city"
							placeholder="Введите город"
							class="w-full"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Дата создания
							</label>
							<BaseInput
								v-model="modelValue.date"
								type="date"
								class="w-full"
							/>
						</div>
						<div>
							<label
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Статус
							</label>
							<BaseDropdown
								v-model="modelValue.status"
								:options="statusOptions"
								optionLabel="label"
								optionValue="value"
								placeholder="Выберите статус"
								class="w-full"
							/>
						</div>
					</div>
				</div>

				<!-- Дополнительные параметры -->
				<div class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Площадь (м²)
						</label>
						<BaseInput
							v-model="modelValue.area"
							type="number"
							placeholder="Введите площадь"
							class="w-full"
						/>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							ID заявки
						</label>
						<BaseInput
							v-model="modelValue.requestId"
							type="number"
							placeholder="ID заявки"
							class="w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
	BaseInputText as BaseInput,
	BaseSelectButton as BaseDropdown,
} from "@/shared/components";

interface Calculation {
	id?: number;
	date: string;
	status: string;
	requestId?: number;
	city: string;
	area: number;
	title?: string;
}

interface Props {
	modelValue: Calculation;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	"update:modelValue": [value: Calculation];
}>();

// Вычисляемое свойство для v-model
const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

// Опции для выпадающих списков
const statusOptions = [
	{ label: "Опубликован", value: "published" },
	{ label: "В работе", value: "working" },
	{ label: "Кейс", value: "case" },
	{ label: "Скрыт", value: "hide" },
];
</script>
