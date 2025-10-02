<template>
	<div class="flex flex-col gap-2">
		<div
			v-for="(property, index) in modelValue"
			:key="index"
			class="flex flex-row gap-2"
		>
			<BaseInputText
				v-model="property.label"
				label="Название"
				class="w-1/2"
				:invalid="isError(index, 'label')"
			/>
			<BaseInputText
				v-model="property.measure"
				label="Единицы"
				class="w-30"
				:invalid="isError(index, 'measure')"
			/>
			<BaseInputText
				v-model="property.key"
				label="ID"
				class="w-60"
				:invalid="isError(index, 'key')"
			/>
			<BaseInputText
				v-model="property.value"
				label="Значение"
				class="w-1/4"
				:invalid="isError(index, 'value')"
			/>
			<BaseButton
				icon="trash"
				variant="text"
				severity="secondary"
				text
				@click="drop(index)"
			/>
		</div>
		<div class="flex justify-end w-full">
			<BaseButton label="Добавить параметр" link icon="plus" @click="add"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {EquipmentProperty} from "@features/directories/types";
import {BaseButton, BaseInputText} from "@shared/components";
import type {ErrorFieldsResult} from "@features/directories/composables/useForm.ts";

interface Props {
	modelValue: EquipmentProperty[];
	errors?: ErrorFieldsResult
}

const props = defineProps<Props>();

defineEmits<{
	(e: 'update:modelValue', v: EquipmentProperty[]): void;
}>()

const isError = (index: number, field: string) => {
	return props.errors && !!props.errors[index]
		&& field in props.errors[index];
}

const drop = (index: number) => {
	props.modelValue.splice(index);
}

const add = () => {
	props.modelValue.push({
		key: '',
		value: ''
	});
}

</script>
