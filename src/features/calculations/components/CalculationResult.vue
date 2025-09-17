<template>
	<div class="flex flex-col gap-2">
		<!-- Кнопки действий -->
		<div v-if="result.id && isCorrect" class="flex gap-x-4">
			<BaseButton
				label="Ссылка на расчёт"
				as="a"
				text
				:href="route('calculations.view', result.id)"
				target="_blank"
				icon="link"
			/>
			<BaseButton
				label="Скачать в PDF"
				as="a"
				text
				:href="route('calculations.pdf', result.id)"
				target="_blank"
				icon="file-pdf"
			/>
		</div>

		<!-- Основные показатели -->
		<div class="flex gap-x-2">
			<BaseInputNumber
				v-model="result.power"
				label="Мощность оборудования"
				class="flex-1"
				disabled
				suffix=" кВт"
			/>
			<BaseInputNumber
				v-model="result.averagePower"
				label="Средний расход за месяц"
				class="flex-1"
				disabled
				suffix=" кВт*ч"
			/>
		</div>

		<div class="flex gap-x-2">
			<BaseInputNumber
				v-model="result.equipmentCost"
				label="Стоимость оборудования"
				class="flex-1"
				disabled
				suffix=" ₽"
			/>
			<BaseInputNumber
				v-model="result.averageExpenses"
				:label="`Расходы в месяц (${result.powerPrice || powerPrice} ₽/кВт*ч)`"
				class="flex-1"
				disabled
				suffix=" ₽"
			/>
		</div>

		<!-- Секция оборудования -->
		<div v-if="result.equipment?.length" class="flex flex-col gap-2">
			<div class="font-medium border-b border-gray-300 mt-2">Суммарное количество оборудования</div>

			<div v-for="(equipment, index) in result.equipment" :key="index" class="flex gap-x-2">
				<BaseTextArea
					v-model="equipment.name"
					label="Наименование"
					class="flex-1"
					rows="1"
					autoResize
					style="resize: none"
					disabled
				/>
				<BaseInputNumber v-model="equipment.quantity" label="Количество" class="w-22" suffix=" шт." disabled />
				<BaseInputNumber v-model="equipment.price" label="Цена" class="w-26" suffix=" ₽" disabled />
			</div>

			<div class="flex justify-end">
				<BaseInputNumber
					v-model="result.equipmentCost"
					label="Стоимость оборудования"
					class="w-50"
					disabled
					suffix=" ₽"
				/>
			</div>

			<div v-if="result.deliveryCost" class="flex justify-end">
				<BaseInputNumber
					v-model="result.deliveryCost"
					label="Стоимость доставки"
					class="w-50"
					disabled
					suffix=" ₽"
				/>
			</div>
		</div>

		<!-- Секция теплопотерь -->
		<div v-if="result.city" class="flex flex-col gap-2">
			<div class="font-medium border-b border-gray-300 mt-2">Теплопотери</div>

			<div class="flex gap-x-2">
				<BaseInputText
					:model-value="`${result.city} (${result.humidity})`"
					label="Регион размещения"
					class="flex-1"
					disabled
				/>
				<BaseInputText
					:model-value="`${result.area} м² (${result.volume} м³)`"
					label="Размер объекта"
					class="flex-1"
					disabled
				/>
			</div>

			<div class="flex gap-x-2">
				<BaseInputText
					:model-value="`${result.minTemp} C°`"
					label="Температура холодной пятидневки"
					class="flex-1"
					disabled
				/>
				<BaseInputText
					:model-value="`${result.avgTemp} C°`"
					:label="`Средняя температура в сезон (${plural(
						result.heatingSeason,
						['день', 'дня', 'дней'],
						true
					)})`"
					class="flex-1"
					disabled
				/>
			</div>

			<div class="flex gap-x-2">
				<BaseInputText
					:model-value="`${result.requiredTemp} C°`"
					label="Температура в помещение"
					class="flex-1"
					disabled
				/>
				<BaseInputText :model-value="totalHeatLoss" label="Общие теплопотери объекта" class="flex-1" disabled />
			</div>
		</div>

		<!-- Секция конструкций -->
		<div v-if="result.constructions?.length" class="flex flex-col gap-2">
			<div class="font-medium border-b border-gray-300 mt-2">Конструкции</div>

			<div v-for="(constr, index) in result.constructions" :key="index" class="flex gap-x-2">
				<BaseTextArea
					v-model="constr.name"
					label="Конструкция"
					class="flex-1"
					disabled
					rows="1"
					autoResize
					style="resize: none"
				/>
				<BaseInputNumber
					:model-value="constr.heatLoss"
					:label="`Теплопотери в ${result.minTemp} С°`"
					class="w-35"
					disabled
					suffix=" Вт*ч"
					:style="getStyleHeatLoss(constr)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import type { CalculationResult, Construction } from "../types";
import { route } from "@/shared/utils/router";
import BaseTextArea from "@/shared/components/ui/BaseTextArea.vue";
import { plural } from "@/shared/utils/text";
import { computed } from "vue";
import { useSettings } from "@/features/settings/composables/useSettings.ts";

type Props = {
	result: CalculationResult;
	isCorrect?: boolean;
};

const props = defineProps<Props>();

const { powerPrice } = useSettings();

const totalHeatLoss = computed(() => {
	const heatLossInCube = props.result.volume ? props.result.totalHeatLoss / props.result.volume : 0;
	return `${props.result.totalHeatLoss} кВт*ч` + (heatLossInCube ? ` (${heatLossInCube.toFixed(2)} Вт/м³)` : "");
});

const getStyleHeatLoss = (c: Construction) => {
	return {
		"--p-inputtext-border-color":
			c.snipResistance - (c.calculatedResistance || 0) < 0.3
				? (c.calculatedResistance || 0) - c.snipResistance < 0.3
					? "var(--p-surface-300)"
					: "var(--color-green-500)"
				: "var(--color-red-500)",
	};
};
</script>
