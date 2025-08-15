<template>
	<div class="calculation-editor">
		<div class="">
			<!-- Секция: Общие данные -->
			<SectionProduct
				v-model="modelValueProxy"
				:isEditingTitle="!!modelValue?.title"
			/>

			<!-- Секция: Климат -->
			<div class="my-6 border-t border-gray-200" ref="climateRef"></div>
			<SectionClimat v-model="modelValueProxy" />

			<div
				class="my-6 border-t border-gray-200"
				ref="constructionsRef"
			></div>
			<SectionConstructions v-model="modelValueProxy" />

			<div class="my-6 border-t border-gray-200" ref="roomsRef"></div>
			<SectionRooms v-model="modelValueProxy" />

			<div
				class="my-6 border-t border-gray-200"
				ref="equipmentsRef"
			></div>
			<SectionEquipments v-model="modelValueProxy" />

			<div class="my-6 border-t border-gray-200" ref="otherRef"></div>
			<SectionOther v-model="modelValueProxy" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from "vue";
import type { CalculationDetails } from "../types/calculation";
import SectionProduct from "@/features/calculations/components/SectionProduct.vue";
import SectionClimat from "@/features/calculations/components/SectionClimat.vue";
import SectionConstructions from "@/features/calculations/components/SectionConstructions.vue";
import SectionRooms from "@/features/calculations/components/SectionRooms.vue";
import SectionEquipments from "@/features/calculations/components/SectionEquipments.vue";
import SectionOther from "@/features/calculations/components/SectionOther.vue";

interface Props {
	modelValue: CalculationDetails;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	"update:modelValue": [value: CalculationDetails];
}>();

const modelValueProxy = computed<CalculationDetails>({
	get: () => {
		if (props.modelValue.constructions === undefined) {
			props.modelValue.constructions = [];
		}
		if (props.modelValue.calculateMethod === undefined) {
			props.modelValue.calculateMethod = "detailed";
		}
		if (props.modelValue.rooms === undefined) {
			props.modelValue.rooms = [];
		}
		if (props.modelValue.equipment === undefined) {
			props.modelValue.equipment = [];
		}

		return props.modelValue;
	},
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

defineExpose({
	scrollTo,
});
</script>
