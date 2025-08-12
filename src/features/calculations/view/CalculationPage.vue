<template>
	<div class="p-0">
		<Head :title="title" :subtitle="subTitle">
			<template #actions>
				<Status :calculation="calculation" />
			</template>
			<template #title-actions>
				<BaseButton 
					v-if="calculation.title !== title"
					icon="pencil" class="w-full" text @click="calculation.title = title"
				/>
			</template>
		</Head>
		<div class="flex gap-6 w-full">
			<div class="w-80 flex-shrink-0">
				<div class="sticky top-6">
					<SubMenu :items="subMenuItems"/>
					<div class="flex flex-col gap-2">
						<BaseButton icon="save" class="w-full" label="Сохранить" />
						<BaseButton
							icon="eye"
							class="w-full"
							label="Опубликовать"
							outlined
						/>
					</div>
				</div>
			</div>
			<div class="w-full min-w-0">
				<Calculation v-if="!isLoading" v-model="calculation" ref="calculationRef"/>
			</div>
			<div
				class="w-140 flex-shrink-0 border border-gray-300 p-3 rounded-xl"
			>
				<BaseSelectButton
					v-if="hasRequest"
					:options="rightBoxTabs"
					v-model="tab"
					class="mb-2"
					optionDisabled="disabled"
				/>
				<div v-if="tab == 'client'">
					<ClientDetails
						:client="client"
						:attachments="attachments"
					/>
				</div>
				<div v-else-if="tab == 'request'">
					<RequestDetails
						:request="requestData"
						:attachments="attachments"
						@copy-all="copyAll"
						@copy-constructions="copyConstructions"
						@copy-rooms="copyRooms"
					/>
				</div>
				<div v-else>
					<CalculationResult :result="calculationResult" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, useTemplateRef } from "vue";
import {
	BaseSelectButton,
	BaseButton,
	Head,
	SubMenu,
} from "@shared/components";
import {
	Status,
	ClientDetails,
	CalculationResult,
	RequestDetails,
	Calculation,
} from "@features/calculations/components";
import type { SelectButtonOption } from "@/shared/types/ui";
import type { SubMenuItem } from "@shared/types/submenu.ts";
import { useCalculator } from "@features/calculations/composables/useCalculator.ts";
import { useRequest } from "@/features/calculations/api/request";
import { useFetchCalculation } from "@/features/calculations/api/calculation";

const {
	result: calculationResult,
	calculation,
	title,
	subTitle,
} = useCalculator();

const requestId = computed(() => {	
	return calculation.value.requestId;
});

const { requestData, attachments, client, hasRequest, loadRequestData } =
	useRequest("");

watch(requestId, (newId) => {
	if (newId) {
		loadRequestData(newId);
	}
});

// TODO: взять из route params
const calculationId = 111;

const { isLoading, /* error,*/ loadCalculationData } = useFetchCalculation(
	calculationId,
	calculation
);

onMounted(() => {
	loadCalculationData();
});

const copyAll = () => {
	console.log("copyAll");
};

const copyConstructions = () => {
	console.log("copyConstructions");
};

const copyRooms = () => {
	console.log("copyRooms");
};

const tab = ref("result");

const rightBoxTabs = computed<SelectButtonOption[]>(() => {
	return [
		{
			label: "Клиент",
			value: "client",
			disabled: !hasRequest,
		},
		{
			label: "Исходные данные",
			value: "request",
			disabled: !hasRequest,
		},
		{
			label: "Результат",
			value: "result",
		},
	];
});

const calculationRef = useTemplateRef("calculationRef");

const subMenuItems: SubMenuItem[] = [
	{
		path: "#climate",
		title: "Климат",
		icon: "map-pinned.svg",
		action: () => calculationRef.value?.scrollTo("climate"),
	},
	{
		path: "#materials",
		title: "Огр. конструкции",
		icon: "brick-wall.svg",
		action: () => calculationRef.value?.scrollTo("constructions"),
	},
	{
		path: "#rooms",
		title: "Помещения",
		icon: "house.svg",
		action: () => calculationRef.value?.scrollTo("rooms"),
	},
	{
		path: "#equipments",
		title: "Оборудование",
		icon: "heater.svg",
		action: () => calculationRef.value?.scrollTo("equipments"),
	},
];
</script>
