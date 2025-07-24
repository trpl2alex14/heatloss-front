<template>
	<IconField iconPosition="left">
		<InputIcon class="pi pi-search" />
		<InputText v-model="modelValueProxy" placeholder="Найти..." />
		<InputIcon
			v-show="modelValueProxy"
			class="pi pi-times cursor-pointer"
			@click="modelValueProxy = ''"
		/>		
	</IconField>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { computed } from "vue";

const props = defineProps<{
	modelValue: string;
}>();

const modelValueProxy = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();
</script>
