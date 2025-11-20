<template>
	<div class="p-2">
		<div
			v-if="isLoaded && result"
			class="flex gap-4"
		>
			<div class="max-w-[300px] flex-1">
				<h5 class="font-bold mb-2">Детали расчёта №{{ id }}</h5>
				<div class="bg-gray-100 px-4 py-2 rounded-xl  text-sm">
					<div class="font-bold my-1">
						<span class="font-normal">Размер:</span> {{ result.size }} м&sup2; ( {{ result.size3 }}м&sup3; )
					</div>
					<div class="font-bold my-1">
						<span class="font-normal">Теплопотери:</span> {{ result.hLoss }} Вт
					</div>
					<div class="font-bold my-1">
						<span class="font-normal">Мощность оборудования:</span> {{ result.totalPowerShort }} кВт
					</div>
					<div class="font-bold my-1">
						<span class="font-normal">Стоимость оборудования:</span> {{ result.totalAmount }} ₽
					</div>
				</div>
			</div>
			<div class="flex-1">
				<h5 class="font-bold mb-2">Список оборудования</h5>
				<div class="flex flex-col gap-2 w-full mb-1">
					<div class="flex gap-4" v-for="(equip, index) in result.equipments">
						<div class="w-[20px]">{{ index+1 }}.</div>
						<div class="flex-1">{{equip.name}}</div>
						<div class="w-[70px] text-right">{{equip.count}} шт.</div>
						<div class="w-[10px] text-center">x</div>
						<div  class="w-[80px] text-right">{{equip.price}} ₽</div>
						<div  class="w-[10px] text-center">=</div>
						<div  class="w-[80px] text-right">{{equip.price * equip.count }} ₽</div>
					</div>
				</div>
				<div class="font-bold text-right">Сумма: {{result.totalAmount}} ₽</div>
			</div>
			<div class="flex-1">
				<h5 class="font-bold mb-2">Список помещений</h5>
				<div class="flex flex-col gap-2 w-full">
					<div class="flex gap-0 flex-col bg-gray-100 py-2 px-4 rounded-xl" v-for="(floor, index) in result.rooms">
						<div class="font-bold">Этаж {{ index+1 }}</div>
						<div class="flex gap-2" v-for="(room, index) in floor">
							<div class="w-[20px]">{{ index+1 }}.</div>
							<div class="flex-2">{{room.name}}</div>
							<div class="w-[120px]">
								{{room.size}}м&sup2;&nbsp;<span class="text-gray-400">({{ room.size3 }}м&sup3;)</span>
							</div>
							<div class="flex-1">
								{{room.floor}}&nbsp;<span class="text-gray-400">{{plural(room.floor, ['окно', 'окна', 'окон'])}}</span>
							</div>
							<div class="w-[70px] text-right">{{room.hLoss}}Вт</div>
							<div class="w-[10px] text-center">/</div>
							<div class="w-[70px] text-right">{{room.power}} Вт</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Preloader v-else-if="!isLoaded" class="max-h-[80px]" />

	</div>
</template>

<script setup lang="ts">
import {useApiResource} from "@shared/composables/useApiResource.ts";
import {computed, onMounted} from "vue";
import Preloader from "@shared/components/Preloader.vue";
import {plural} from "@shared/utils/text.ts";

type Props = {
	id: number
};

const props = defineProps<Props>();

const {data, loadData} = useApiResource<{}, any>({name: 'api-calculation-result'});

const result = computed(() => {
	return data && 'data' in data.value ? data.value.data : undefined;
})

const isLoaded = computed(() => {
	return data && 'status' in data.value;
})

onMounted(()=>{
	loadData(props.id);
});
</script>
