<template>
	<div class="p-0">
		<Head :title="title" :subtitle="subTitle">
			<template #actions>
				<Status :calculation="calculation" />
			</template>
			<template #title-actions>
				<BaseButton
					v-if="calculation.title !== title"
					icon="pencil"
					class="w-full"
					text
					@click="calculation.title = title"
				/>
			</template>
		</Head>
		<div class="flex gap-6 w-full">
			<div class="w-80 flex-shrink-0">
				<div class="sticky top-6">
					<SubMenu :items="subMenuItems" />
					<div class="flex flex-col gap-2">
						<BaseButton v-if="needSave" icon="save" class="w-full" label="Сохранить" @click="save" />
						<BaseButton
							v-if="isCorrect && calculation.status !=='published'"
							icon="eye"
							class="w-full"
							label="Опубликовать"
							outlined
							@click="publish"
						/>
					</div>
					<LocalHistoryMenu class="mt-8" @open="openLocalHistory" :history="history" :open-key="historyKey" />
				</div>
			</div>
			<div class="w-full min-w-0">
				<Calculation v-if="!isLoading" v-model="calculation" ref="calculationRef" />
				<Preloader v-else />
			</div>
			<div class="w-140 flex-shrink-0">
				<div class="border border-gray-300 p-3 rounded-xl sticky top-4">
					<BaseSelectButton
						v-if="hasRequest"
						:options="rightBoxTabs"
						v-model="tab"
						:allow-empty="false"
						class="mb-2"
						optionDisabled="disabled"
					/>
					<div class="max-h-[80vh] overflow-y-auto">
						<div v-if="tab == 'client'">
							<ClientDetails :client="client" :attachments="attachments" />
						</div>
						<div v-else-if="tab == 'request'">
							<RequestDetails
								:request="requestData"
								:attachments="attachments"
								@copy-all="copyAll"
								@copy-city="copyCity"
								@copy-constructions="copyConstructions"
								@copy-rooms="copyRooms"
								@copy-tags="copyTags"
							/>
						</div>
						<div v-else>
							<CalculationResult :result="calculationResult" :is-correct="isCorrect && !needSave" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch, useTemplateRef, nextTick } from "vue";
import { BaseSelectButton, BaseButton, Head, SubMenu } from "@shared/components";
import {
	Status,
	ClientDetails,
	CalculationResult,
	RequestDetails,
	Calculation,
	LocalHistoryMenu,
} from "@features/calculations/components";
import type { SelectButtonOption } from "@shared/types/ui";
import type { SubMenuItem } from "@shared/types/submenu.ts";
import { useCalculator } from "@features/calculations/composables/useCalculator.ts";
import { useRequestResource } from "@features/calculations/composables/useRequestResource.ts";
import { useCalculationResource } from "@features/calculations/composables/useCalculationResource.ts";
import { useLocalHistory } from "@features/calculations/composables/useLocalHistory";
import { useDebounce } from "@shared/utils/debounce";
import type { CalculationSaved } from "@features/calculations/types";
import { useRoute, useRouter } from "vue-router";
import { toRaw } from "vue";
import { useSettings } from "@features/settings/composables/useSettings";

import MapIcon from "@assets/icons/map-pinned.svg";
import BrickIcon from "@assets/icons/brick-wall.svg";
import HouseIcon from "@assets/icons/house.svg";
import HeaterIcon from "@assets/icons/heater.svg";
import {useActualPriceEquipments} from "@features/calculations/composables/useActualPriceEquipments.ts";
import Preloader from "@shared/components/Preloader.vue";

const debounce = useDebounce();

const route = useRoute();
const router = useRouter();

const calculationRef = useTemplateRef("calculationRef");

let notSaveAuto = false;
const needSave = ref(false);
const historyKey = ref("");
let isLoaded = ref(true);

const { setLocalHistory, getLocalHistory, getLocalHistoryList } = useLocalHistory();
const historyList = ref(getLocalHistoryList());

const { seasonTag, frostProtectionTag, allowedTags = [], isMansardaTag } = useSettings();

const { result: calculationResult, calculation, title, subTitle, resetCalculation, isCorrect } = useCalculator();

const { isLoading, loadCalculationData, saveCalculation } = useCalculationResource(calculation);
const { requestData, attachments, client, hasRequest, loadRequestData } = useRequestResource();

const { updatePrice } = useActualPriceEquipments(calculation);

const requestId = computed(() => {
	return calculation.value.requestId || Number(route.query.request);
});

watch(requestId, (newId) => {
	if (newId) {
		loadRequestData(newId);
	}
}, {
	immediate: true
});

const updatedWatcher = () =>
	watch(
		calculation,
		(newCalculation) => {
			needSave.value = true;

			debounce(() => {
				autoSaveCalculation({
					key: newCalculation.id?.toString() || historyKey.value,
					calculation: toRaw(newCalculation),
					result: { ...calculationResult.value },
				});
			}, 3000);
		},
		{ deep: true }
	);


watch(
	() => route.params,
	async ({id, key}, oldValue) => {
		if ((id || key) && id === oldValue?.id && key === oldValue?.key) {
			return;
		}

		notSaveAuto = true;
		needSave.value = false;

		if (id) {
			isLoaded.value = false;

			await loadCalculationData(+id);
			await updatePrice();

			isLoaded.value = true;
		} else if (key && typeof key === "string") {
			const calculationHistory = getLocalHistory(key);
			if (calculationHistory) {
				historyKey.value = key;
				calculation.value = {
					...calculationHistory.calculation,
				};
				await updatePrice();
			} else {
				resetCalculation();
			}
		} else {
			historyKey.value = "";
			resetCalculation();
		}

		//fix watch after load
		setTimeout(()=>updatedWatcher(), 1000);
	},
	{ immediate: true }
);

watch(historyKey, () => {
	historyList.value = getLocalHistoryList();
});

const history = computed(() =>
	historyList.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

const autoSaveCalculation = (calculation: CalculationSaved) => {
	if (notSaveAuto) {
		notSaveAuto = false;
		return;
	}

	historyKey.value = setLocalHistory(calculation);
};

const openLocalHistory = (key: string) => {
	router.push({name: 'history', params: { key }});
};

const save = async () => {
	const id = await saveCalculation(calculation.value.id || "", {
		key: calculation.value.id?.toString() || "",
		calculation: { ...calculation.value, requestId: requestId.value },
		result: { ...calculationResult.value },
	});

	if (id) {
		needSave.value = false;
		notSaveAuto = true;
		router.push({name: "calculation", params: {id}});
	}
};

const copyAll = async () => {
	await nextTick(()=>copyTags());
	await nextTick(()=>copyCity());
	await nextTick(()=>copyConstructions());
	await nextTick(()=>copyRooms());
};

const copyTags = () => {
	const newTags = requestData.value.tags?.filter((tag) => allowedTags.includes(tag)) || [];

	if (calculation.value.tags) {
		calculation.value.tags?.push(...newTags.filter((v) => (calculation.value.tags || []).indexOf(v) < 0));
	} else {
		calculation.value.tags = newTags;
	}
};

const copyConstructions = () => {
	const importConstructions =
		requestData.value.constructions || [];

	calculationRef.value?.addConstructions(importConstructions);
};

const copyRooms = () => {
	const rooms =
		requestData.value.floors
			?.map((floor, index) => {
				return floor.rooms.map((room) => {
					const height = room.height || floor.height || 2.5;
					const isMansard = room.tags?.includes(isMansardaTag) || floor.tags?.includes(isMansardaTag);
					let diffHeight = (requestData.value.ridgeHeight || 0) - (requestData.value.wallHeight || 0);
					diffHeight = diffHeight > 0 && diffHeight < height ? diffHeight : 0;

					return {
						...room,
						height: height,
						minHeight: isMansard ? (room.minHeight ? room.minHeight : height - diffHeight) : undefined,
						isMansard: isMansard,
						floor: index + 1,
						windows: room.windows?.reduce((sum, w) => sum + w.count, 0) || 0,
					};
				});
			})
			.flat() || [];

	calculationRef.value?.addRooms(rooms);
};

const copyCity = () => {
	if (requestData.value.city) {
		calculationRef.value?.cityChange(requestData.value.city);
	}

	if (requestData.value.tags?.includes(seasonTag)) {
		calculation.value.useSeason = "seasonal";
	}

	if (requestData.value.tags?.includes(frostProtectionTag)) {
		calculation.value.useSeason = "freeze";
	}

	if (requestData.value.electricity?.price) {
		calculation.value.powerPrice = requestData.value.electricity?.price;
	}
};

const publish = () => {
	calculation.value.status = "published";
	save();
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

const subMenuItems: SubMenuItem[] = [
	{
		path: "#",
		title: "Климат",
		icon: MapIcon,
		action: () => calculationRef.value?.scrollTo("climate"),
	},
	{
		path: "#",
		title: "Огр. конструкции",
		icon: BrickIcon,
		action: () => calculationRef.value?.scrollTo("constructions"),
	},
	{
		path: "#",
		title: "Помещения",
		icon: HouseIcon,
		action: () => calculationRef.value?.scrollTo("rooms"),
	},
	{
		path: "#",
		title: "Оборудование",
		icon: HeaterIcon,
		action: () => calculationRef.value?.scrollTo("equipments"),
	},
];
</script>
