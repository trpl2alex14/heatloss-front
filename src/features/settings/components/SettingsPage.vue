<template>
	<div>
		<h1 class="text-2xl font-bold mb-4">Настройки</h1>
		<p>Здесь будут настройки приложения.</p>
		<form class="max-w-md mx-auto mt-8 space-y-6">
			<BaseInputText
				v-model="userForm.name"
				label="Имя"
				placeholder="Введите имя"
				class="w-full"
			/>
			<BaseInputText
				v-model="userForm.email"
				label="Email"
				placeholder="Введите email"
				class="w-full"
				type="email"
			/>
			<BaseInputText
				v-model="userForm.phone"
				label="Телефон"
				placeholder="Введите телефон"
				class="w-full"
			/>
			<BaseButton
				:loading="isSaving"
				class="w-full"
				@click="onSave"
				label="Сохранить"
			/>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";

interface UserForm {
	name: string;
	email: string;
	phone: string;
}

const userForm = ref<UserForm>({
	name: "",
	email: "",
	phone: "",
});

const isSaving = ref(false);

const onSave = async () => {
	if (isSaving.value) return;
	isSaving.value = true;
	// Здесь должна быть логика сохранения данных пользователя
	// Например, вызов API
	setTimeout(() => {
		isSaving.value = false;
		// Можно добавить уведомление об успешном сохранении
	}, 1200);
};
</script>
