<template>
	<div class="calculation-editor">
		<div class="rounded-xl border border-gray-300 p-6">
			<!-- Секция: Общие данные -->
			<SectionProduct
				v-model="modelValueProxy"
				:isEditingTitle="!!modelValue?.title"
			/>

			<!-- Секция: Климат -->
			<div class="my-6 border-t border-gray-200" ref="climateRef"></div>
			<SectionClimat v-model="modelValueProxy" />

			<div class="my-6 border-t border-gray-200" ref="constructionsRef"></div>
			<div class="my-6 border-t border-gray-200" ref="roomsRef"></div>
			<div class="my-6 border-t border-gray-200" ref="equipmentsRef"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import type { CalculationDetails } from "../types/calculation";
import SectionProduct from "@/features/calculations/components/SectionProduct.vue";
import SectionClimat from "@/features/calculations/components/SectionClimat.vue";

interface Props {
	modelValue: CalculationDetails;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	"update:modelValue": [value: CalculationDetails];
}>();

const modelValueProxy = computed<CalculationDetails>({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const sections = {
	climate: useTemplateRef("climateRef"),
	constructions: useTemplateRef("constructionsRef"),
	rooms: useTemplateRef("roomsRef"),
	equipments: useTemplateRef("equipmentsRef"),
};

const scrollTo = (scrollTo: "climate" | "constructions" | "rooms" | "equipments") => {	
	sections[scrollTo]?.value?.scrollIntoView({ behavior: "smooth" });
};

defineExpose({
	scrollTo,
});
</script>
