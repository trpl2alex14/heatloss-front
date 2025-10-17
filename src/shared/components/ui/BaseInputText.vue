<template>
	<div>
		<InputGroup class="w-auto">
			<IftaLabel class="">
				<InputText
					v-bind="inputAttrs"
					v-model="modelValueProxy"
					:placeholder="placeholder"
					:type="type"
					class="w-full"
					variant="filled"
					:disabled="disabled"
				/>
				<label v-if="label" class="block text-sm font-medium text-gray-700">{{
					label
				}}</label>
			</IftaLabel>
			<InputGroupAddon v-if="clearable">
        		<Button icon="pi pi-times" class="h-full" text @click="modelValueProxy = ''"/>
    		</InputGroupAddon>
		</InputGroup>
		<p v-if="fieldError" class="pl-2 pt-1 text-(--p-form-field-invalid-border-color)">{{fieldError}}</p>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";

interface Props {
	modelValue?: string | number,
	label?: string,
	placeholder?: string,
	type?: string,
	disabled?: boolean,
	clearable?: boolean,
	fieldError?: string | undefined
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	label: "",
	placeholder: "",
	type: "text",
	disabled: false,
	clearable: false,
	fieldError: ""
});

const emit = defineEmits(["update:modelValue"]);

const modelValueProxy = computed({
	get: () => props.modelValue as string,
	set: (v) => emit("update:modelValue", v),
});

const attrs = useAttrs();

const inputAttrs = computed(() => {
	const { modelValue, label, placeholder, type, ...rest } = props;
	return { ...attrs, ...rest };
});
</script>

<style lang="scss">
.p-inputtext {
	--p-inputtext-disabled-background: var(--color-gray-200);
	--p-inputtext-disabled-color: var(--color-gray-800);
}
</style>
