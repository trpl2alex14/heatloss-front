<template>
	<div class="pt-6 flex flex-col gap-4">
		<h2 class="text-xl bg-gray-200 px-2 py-1 rounded-md">Редактирование климата</h2>
		<p v-if="errorMessage" class="text-md text-(--p-form-field-invalid-border-color)">{{ errorMessage }}</p>
		<div v-if="climate" class="flex flex-row gap-2">
			<div class="flex flex-col gap-2">
				<div class="flex flex-wrap gap-2">
					<BaseInputText
						v-model="climate.city"
						label="Город"
						class="flex-1"
						:invalid="isInvalidField('city')"
					/>
					<BaseSelectButton
						label="Зона"
						:options="[
							{ label: 'А', value: 'А' },
							{ label: 'Б', value: 'Б' },
						]"
						v-model="climate.humidity"
						:invalid="isInvalidField('humidity')"
					/>
				</div>
				<div class="flex flex-wrap gap-2">
					<BaseInputText
						v-model="climate.region"
						label="Регион"
						class="flex-1"
						:invalid="isInvalidField('region')"
					/>
				</div>
				<div class="flex flex-wrap gap-2">
					<BaseInputNumber
						v-model="climate.minTemp"
						label="Мин. температура"
						suffix="°C"
						class="flex-1"
						:invalid="isInvalidField('minTemp')"
					/>
					<BaseInputNumber
						v-model="climate.avgTemp"
						label="Средняя"
						suffix="°C"
						class="flex-1"
						:invalid="isInvalidField('avgTemp')"
					/>
					<BaseInputNumber
						v-model="climate.heatingSeason"
						label="Сезон"
						suffix="дней"
						class="flex-1"
						:invalid="isInvalidField('heatingSeason')"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-2 bg-gray-100 p-4 rounded-md">
				<p class="text-center w-full">Нормативное сопротивление</p>
				<div class="flex flex-col gap-2">
					<BaseInputNumber
						v-model="climate.floorNorm"
						label="Пол"
						suffix="(м²*С°)/Вт"
						class="flex-1"
						:invalid="isInvalidField('floorNorm')"
					/>
					<BaseInputNumber
						v-model="climate.wallNorm"
						label="Стены"
						suffix="(м²*С°)/Вт"
						class="flex-1"
						:invalid="isInvalidField('wallNorm')"
					/>
					<BaseInputNumber
						v-model="climate.floorNorm"
						label="Кровля"
						suffix="(м²*С°)/Вт"
						class="flex-1"
						:invalid="isInvalidField('floorNorm')"
					/>
				</div>
			</div>
		</div>
		<div class="flex flex-row gap-2 justify-end w-full">
			<BaseButton v-if="climate" label="Сохранить" icon="save" @click="save"/>
			<BaseButton
				label="Закрыть"
				icon="times-circle"
				variant="outlined"
				severity="danger"
				@click="emit('close')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, watch} from "vue";
import type {ClimateItem} from "../types";
import {BaseInputNumber, BaseInputText, BaseSelectButton} from "@shared/components";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import {useForm} from "@shared/composables/useForm.ts";

type Props = {
	id?: number;
};

const emit = defineEmits<{
	(e: "save", climate: ClimateItem): void;
	(e: "close"): void;
}>();

const props = defineProps<Props>();

const {entity: climate, errorMessage, fetchEntity, isInvalidField, save: saveEntity} = useForm<ClimateItem>({
	get: 'api-climate',
	create: 'api-climate-create',
	update: 'api-climate',
})

watch(
	() => props.id,
	(id) => {
		id && fetchEntity(id);
	}
);

onMounted(() => {
	if (props.id) {
		fetchEntity(props.id);
	} else {
		climate.value = {
			humidity: "А",
		} as ClimateItem;
	}
});

const save = async () => {
	const result = await saveEntity(props.id)
	if (result) {
		emit("save", result);
	}
};
</script>
