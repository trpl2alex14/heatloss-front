<template>
	<div class="relative">
		<img v-if="src" :src="src" alt="Image" class="rounded-md w-full sm:w-64 mb-2" />
		<FileUpload
			mode="basic"
			@select="onFileSelect"
			customUpload
			accept="image/*"
			auto
			severity="text"
			class="p-button-text"
			:chooseLabel="src ? 'Изменить изображение' : 'Выбрать изображение'"
			choose-icon="pi pi-upload"
			invalidFileTypeMessage="Невыерный тип файла"
		/>
		<div v-if="src" class="absolute top-4 right-4">
			<BaseButton
				icon="trash"
				text
				severity="secondary"
				class="text-(--p-primary-color)!"
				@click="src = null"
				/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {BaseButton} from "@shared/components";

interface Props {
    src?: string
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: 'upload', file: string): void
}>();

const src = ref(props.src || null);

watch(() => props.src, (newValue) => {
	if(newValue) {
		src.value = newValue
	}
});

function onFileSelect(event: any) {
	const file = event.files[0];
	const reader = new FileReader();

	reader.onload = async (e:any) => {
		src.value = e.target.result;
		if(src.value) {
			emit('upload', src.value);
		}
	};

	reader.readAsDataURL(file);
}
</script>
