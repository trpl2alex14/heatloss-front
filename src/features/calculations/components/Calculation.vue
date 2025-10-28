<template>
	<div class="calculation-editor">
		<div class="">
			<!-- Секция: Общие данные -->
			<SectionProduct
				v-model="modelValueProxy"
				:isEditingTitle="!!modelValue?.title"
			/>

			<!-- Секция: Климат -->
			<div class="my-8 border-t border-gray-100" ref="climateRef"></div>
			<SectionClimate
				v-model="modelValueProxy"
				ref="sectionClimateRef"
			/>

			<div
				class="my-8 border-t border-gray-100"
				ref="constructionsRef"
			></div>
			<SectionConstructions
				v-model="modelValueProxy"
				ref="sectionConstructionsRef"
			/>

			<div class="my-8 border-t border-gray-100" ref="roomsRef"></div>
			<SectionRooms
				v-model="modelValueProxy"
				ref="sectionRoomsRef"
				@alertConstructions="alertConstructions"
			/>

			<div
				class="my-8 border-t border-gray-100"
				ref="equipmentsRef"
			></div>
			<SectionEquipments v-model="modelValueProxy" />

			<div class="my-8 border-t border-gray-100" ref="otherRef"></div>
			<SectionOther v-model="modelValueProxy" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from "vue";
import type { CalculationDetails, RoomFromRequest } from "../types";
import type { Construction as ConstructionFromRequest} from "@features/requests/types/request";
import SectionProduct from "./SectionProduct.vue";
import SectionClimate from "./SectionClimat.vue";
import SectionConstructions from "./SectionConstructions.vue";
import SectionRooms from "./SectionRooms.vue";
import SectionEquipments from "./SectionEquipments.vue";
import SectionOther from "./SectionOther.vue";
import { useMessage } from "@shared/composables/useMessage";
import { useDebounce } from "@shared/utils/debounce";

interface Props {
	modelValue: CalculationDetails;
}

const sectionClimateRef = useTemplateRef("sectionClimateRef");
const sectionConstructionsRef = useTemplateRef("sectionConstructionsRef");
const sectionRoomsRef = useTemplateRef("sectionRoomsRef");

const props = defineProps<Props>();

const emit = defineEmits<{
	"update:modelValue": [value: CalculationDetails];
}>();

const { warning } = useMessage();
const debounce = useDebounce();

const alertConstructions = () => {
	debounce(() => {
		warning("Проверьте распределение конструкций по помещениям");
	}, 500);
};

const modelValueProxy = computed<CalculationDetails>({
	get: () =>  props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

watch(modelValueProxy, (value) => {
	if (
		modelValueProxy.value.calculateMethod !== value.calculateMethod ||
		modelValueProxy.value.constructions !== value.constructions ||
		modelValueProxy.value.rooms !== value.rooms ||
		modelValueProxy.value.equipment !== value.equipment
	) {
		emit("update:modelValue", value);
	}
});

const sections = {
	climate: useTemplateRef("climateRef"),
	constructions: useTemplateRef("constructionsRef"),
	rooms: useTemplateRef("roomsRef"),
	equipments: useTemplateRef("equipmentsRef"),
	other: useTemplateRef("otherRef"),
};

const scrollTo = (
	scrollTo: "climate" | "constructions" | "rooms" | "equipments" | "other"
) => {
	sections[scrollTo]?.value?.scrollIntoView({ behavior: "smooth" });
};

const cityChange = (value: string) => {
	sectionClimateRef.value?.setCity(value);
}

const addConstructions = (constructions: ConstructionFromRequest[]) => {
	sectionConstructionsRef.value?.addConstructions(constructions);
}

const addRooms = (rooms: RoomFromRequest[]) => {
	sectionRoomsRef.value?.addRooms(rooms);
}

defineExpose({
	scrollTo,
	cityChange,
	addConstructions,
	addRooms
});
</script>
