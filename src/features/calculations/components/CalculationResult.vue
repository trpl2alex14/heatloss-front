<template>
	<div class="flex flex-col gap-2">
		<!-- Кнопки действий -->
		<div v-if="result.ulid && isCorrect" class="flex gap-x-4">
			<BaseButton
				v-if="isPublic"
				label="Ссылка на расчёт"
				as="a"
				text
				:href="routeView"
				target="_blank"
				icon="link"
			/>
			<BaseButton
				label="Скачать в PDF"
				as="a"
				text
				:href="routePdf"
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
			<div class="border-b border-gray-300 mt-2 flex justify-between">
				<p class="font-medium">Суммарное количество оборудования</p>
				<div>
					<i
						@click="showEquipments=!showEquipments"
						class="pi text-(--p-primary-color) cursor-pointer"
						:class="{
							'pi-arrow-down-left-and-arrow-up-right-to-center': showEquipments,
							'pi-arrow-up-right-and-arrow-down-left-from-center': !showEquipments
						}"
					></i>
				</div>
			</div>

			<Transition name="slide-fade">
				<div v-show="showEquipments" class="flex flex-col gap-2">
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
						<BaseInputNumber v-model="equipment.quantity" label="Количество" class="w-22" suffix=" шт."
										 disabled/>
						<BaseInputNumber v-model="equipment.price" label="Цена" class="w-26" suffix=" ₽" disabled/>
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
			</Transition>
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
				<BaseInputText :model-value="totalHeatLoss" label="Общие теплопотери объекта" class="flex-1" disabled/>
			</div>
		</div>

		<!-- Секция конструкций -->
		<div v-if="result.constructions?.length" class="flex flex-col gap-2">
			<div class="border-b border-gray-300 mt-2 flex justify-between">
				<p class="font-medium">Конструкции</p>
				<div>
					<i
						@click="showConstructions=!showConstructions"
						class="pi text-(--p-primary-color) cursor-pointer"
						:class="{
							'pi-arrow-down-left-and-arrow-up-right-to-center': showConstructions,
							'pi-arrow-up-right-and-arrow-down-left-from-center': !showConstructions
						}"
					></i>
				</div>
			</div>

			<Transition name="slide-fade">
				<div v-if="showConstructions">
					<div
						v-for="(constr, index) in result.constructions"
						:key="index"
						class="flex gap-x-2">
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
			</Transition>
		</div>

		<!-- Секция помещения -->
		<div v-if="result.rooms?.length" class="flex flex-col gap-2 mb-8">
			<div class="border-b border-gray-300 mt-2 flex justify-between">
				<p class="font-medium">Помещения</p>
				<div>
					<i
						@click="showRooms=!showRooms"
						class="pi text-(--p-primary-color) cursor-pointer"
						:class="{
							'pi-arrow-down-left-and-arrow-up-right-to-center': showRooms,
							'pi-arrow-up-right-and-arrow-down-left-from-center': !showRooms
						}"
					></i>
				</div>
			</div>

			<Transition name="slide-fade">
				<div v-if="showRooms" class="flex flex-col gap-4">
					<div
						v-for="(floor, index) in groupRooms"
						class="bg-gray-100 rounded-xl px-4 py-2"
					>
						<div class="font-bold">Этаж {{ index+1 }} ({{getFloorSize(floor)}} м&sup2;)</div>
						<div class="flex gap-2" v-for="(room, index) in floor">
							<div class="w-[20px]">{{ index+1 }}.</div>
							<div class="flex-2">{{room.name}}</div>
							<div class="w-[120px]">
								{{Math.round(room.area * 10) / 10}} м&sup2;&nbsp;<span class="text-gray-400">( {{ Math.round(room.volume * 10) / 10 }}м&sup3; )</span>
							</div>
							<div class="flex-1">
								{{room.windows || '-'}}&nbsp;<span
									v-if="room.windows"
									class="text-gray-400"
								>{{plural(room.windows, ['окно', 'окна', 'окон'])}}</span>
							</div>
							<div class="w-[70px] text-right">{{room.heatLoss}} Вт</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import type {CalculationResult, Construction, RoomResult} from "../types";
import BaseTextArea from "@shared/components/ui/BaseTextArea.vue";
import {plural} from "@shared/utils/text";
import {computed, ref} from "vue";
import {useSettings} from "@features/settings/composables/useSettings.ts";
import {useRouter} from "vue-router";
import {groupBy} from "@shared/utils/objectHelpers.ts";

type Props = {
	result: CalculationResult;
	isCorrect?: boolean;
	isPublic?: boolean;
};

const props = defineProps<Props>();

const {powerPrice} = useSettings();

const router = useRouter();

const showEquipments = ref(true);
const showConstructions = ref(true);
const showRooms = ref(true);

const getFloorSize = (floor: RoomResult[]) => {
	return Math.round(floor.reduce((acc: number, room: RoomResult) => acc + room.area, 0));
}

const groupRooms = computed(()=>{
	return groupBy<RoomResult>(props.result.rooms || [], 'floor')
});

const totalHeatLoss = computed(() => {
	const heatLossInCube = props.result.volume ? props.result.totalHeatLoss / props.result.volume : 0;
	return `${props.result.totalHeatLoss} кВт*ч` + (heatLossInCube ? ` (${heatLossInCube.toFixed(2)} Вт/м³)` : "");
});

const getUrl = (name: string, id?: number) => {
	return id && router.resolve({
		name,
		params: {id}
	}).href || "";
}

const routeView = computed(() => {
	return getUrl('calculation-view', props.result.id);
});

const routePdf = computed(() => {
	return getUrl('calculation-pdf', props.result.id);
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

.slide-fade-enter-to,
.slide-fade-leave-from {
	max-height: 1000px;
}
</style>
