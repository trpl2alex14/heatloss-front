<template>
	<div class="space-y-2">
		<!-- Название расчета (только в режиме редактирования) -->
		<div v-if="isEditingTitle">
			<BaseInputText
				v-model="localModel.title"
				label="Название расчета"
				placeholder="Введите своё название"
				class="w-full"
				clearable
			/>
		</div>

		<div class="flex gap-2">
			<BaseSelect
				v-model="localModel.product"
				:options="productOptions"
				optionLabel="label"
				optionValue="value"
				defaultValue="all"
				label="Продукт"
				placeholder="не выбран"
				class="w-64"
			/>

			<BaseMultiSelect
				v-model="tagsProxy"
				:options="tagsOptions"
				label="Характеристики объекта"
				placeholder="..."
				class="w-full min-w-0"
				filter
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
	BaseSelect,
	BaseMultiSelect,
	BaseInputText,
} from "@shared/components";
import type { CalculationDetails } from "../types";
import { useTypes } from "@shared/composables/useTypes";
import type { SelectOption } from "@shared/types/ui";
import { useTags } from "@shared/composables/useTags.ts";
import type { Tag } from "@shared/types/ui";

interface Props {
	modelValue: CalculationDetails;
	isEditingTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isEditingTitle: false,
});

const emit = defineEmits<{
	"update:modelValue": [value: CalculationDetails];
}>();

const localModel = computed<CalculationDetails>({
	get: () => {
		props.modelValue.product = props.modelValue?.product || "all";
		return props.modelValue;
	},
	set: (val) => emit("update:modelValue", val),
});

const { productCategory } = useTypes();
const productOptions = productCategory.map((p) => ({
	label: p.label,
	value: p.key,
	icon: p.image,
}));

const { data, loadData } = useTags('calculation');
loadData();

const tagsOptions = computed<SelectOption[]>(() => {
	const list = data.value || [];
	return list.map((t: Tag) => ({
		label: t.label,
		value: t.label,
		icon: t.icon,
	}));
});

const tagsProxy = computed<(string | number)[]>({
	get: () => localModel.value.tags || [],
	set: (val) => {
		localModel.value = {
			...localModel.value,
			tags: (val || []).map((v) => String(v)),
		};
	},
});
</script>
