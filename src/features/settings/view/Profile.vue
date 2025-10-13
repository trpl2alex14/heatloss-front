<template>
	<div class="p-0">
		<Head title="Профиль пользователя" subtitle="Обновите свое имя и адрес электронной почты"/>
		<form
			v-if="userForm"
			class="max-w-md mt-8 space-y-6"
		>
			<BaseInputText
				v-model="userForm.name"
				label="Имя"
				placeholder="Введите имя"
				class="w-full"
				:invalid="isInvalidField('name')"
				:field-error="getErrorFieldMessage('name')"
			/>
			<BaseInputText
				v-model="userForm.email"
				label="Email"
				placeholder="Введите email"
				class="w-full"
				type="email"
				:invalid="isInvalidField('email')"
				:field-error="getErrorFieldMessage('email')"
			/>
			<BaseInputText
				v-model="userForm.phone"
				label="Телефон"
				placeholder="Введите телефон"
				class="w-full"
				:invalid="isInvalidField('phone')"
				:field-error="getErrorFieldMessage('phone')"
			/>
			<BaseButton
				:loading="isSaving"
				class=""
				@click="onSave"
				label="Сохранить"
			/>
		</form>
	</div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import Head from "@shared/components/SubHead.vue";
import {useForm} from "@shared/composables/useForm.ts";
import {useMessage} from "@shared/composables/useMessage.ts";
import type {User} from "@shared/types/user.ts";

type UserForm  = MakeOptional<User, 'id'>;

const isSaving = ref(false);

const {entity: userForm, fetchEntity, save, isInvalidField, errorMessage, getErrorFieldMessage} = useForm<UserForm>({
	get: 'api-profile',
	update: 'api-profile-update'
});

fetchEntity();

const {error, info} = useMessage();

watch(errorMessage, (value) => {
	value && error(value) ;
})

const onSave = async () => {
	if (isSaving.value || !userForm.value?.id) return;
	isSaving.value = true;

	const result = await save(userForm.value.id)
	isSaving.value = false;

	if(result){
		info('Данные обновлены')
	}
};
</script>
