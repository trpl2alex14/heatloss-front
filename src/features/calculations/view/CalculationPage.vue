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
							v-if="isCorrect"
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
							<CalculationResult :result="calculationResult" :is-correct="isCorrect" />
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
import type { SelectButtonOption } from "@/shared/types/ui";
import type { SubMenuItem } from "@shared/types/submenu.ts";
import { useCalculator } from "@features/calculations/composables/useCalculator.ts";
import { useRequest } from "@/features/calculations/api/request";
import { useFetchCalculation, useSaveCalculation } from "@/features/calculations/api/calculation";
import { useLocalHistory } from "@/features/calculations/composables/useLocalHistory";
import { useDebounce } from "@/shared/utils/debounce";
import type { CalculationSaved } from "@/features/calculations/types";
import { useRoute, useRouter } from "vue-router";
import { toRaw } from "vue";
import { useSettings } from "@/features/settings/composables/useSettings";

const debounce = useDebounce();

const route = useRoute();
const router = useRouter();

const calculationRef = useTemplateRef("calculationRef");

let notSaveAuto = false;
const needSave = ref(false);
const historyKey = ref("");

const { setLocalHistory, getLocalHistory, getLocalHistoryList } = useLocalHistory();
const historyList = ref(getLocalHistoryList());

const { seasonTag, frostProtectionTag, allowedTags = [], isMansardaTag } = useSettings();

const { result: calculationResult, calculation, title, subTitle, resetCalculation, isCorrect } = useCalculator();

const { isLoading, loadCalculationData } = useFetchCalculation(calculation);
const { requestData, attachments, client, hasRequest, loadRequestData } = useRequest();
const { saveCalculation } = useSaveCalculation();

const requestId = computed(() => {
	return calculation.value.requestId;
});

watch(requestId, (newId) => {
	if (newId) {
		loadRequestData(newId);
	}
});

watch(
	() => route.params,
	({ id, key }) => {
		notSaveAuto = true;

		if (id) {
			loadCalculationData(+id);
			setTimeout(() => {
				needSave.value = false;
			}, 1000);
		} else if (key && typeof key === "string") {
			const calculationHistory = getLocalHistory(key);
			if (calculationHistory) {
				historyKey.value = key;
				calculation.value = {
					...calculationHistory.calculation,
				};
			} else {
				resetCalculation();
			}
		} else {
			historyKey.value = "";
			resetCalculation();
			setTimeout(() => {
				needSave.value = false;
			}, 100);
		}
	},
	{ immediate: true }
);

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
	//TODO: отправить на сервер(auto sava)?
};

const openLocalHistory = (key: string) => {
	router.push(`/history/${key}`);
};

const save = async () => {
	const id = await saveCalculation(calculation.value.id || "", {
		key: calculation.value.id?.toString() || "",
		calculation: { ...calculation.value },
		result: { ...calculationResult.value },
	});

	if (id) {
		needSave.value = false;
		notSaveAuto = true;
		router.push(`/calculations/${id}`);
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
						//todo: format
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
