<template>
	<div>
		<Head title="Смена пароля" subtitle="Рекомендуем использовать длинный пароль"/>

		<form class="max-w-md mt-8 space-y-6">
			<BaseInputText
				v-model="form.currentPassword"
				label="Текущий пароль"
				placeholder="пароль"
				class="w-full"
				:invalid="isInvalidField('currentPassword')"
				:field-error="getErrorFieldMessage('currentPassword')"
			/>
			<BaseInputText
				v-model="form.newPassword"
				label="Новый пароль"
				placeholder="пароль"
				class="w-full"
				type="email"
				:invalid="isInvalidField('newPassword')"
				:field-error="getErrorFieldMessage('newPassword')"
			/>
			<BaseInputText
				v-model="confirmPassword"
				label="Подтвердите пароль"
				placeholder="пароль"
				class="w-full"
				:invalid="form.newPassword !== confirmPassword"
			/>
			<BaseButton
				:loading="isSaving"
				:disabled="!form.newPassword || form.newPassword !== confirmPassword"
				class=""
				@click="onSave"
				label="Изменить пароль"
			/>
		</form>
	</div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import Head from "@shared/components/SubHead.vue";
import {useApiRequest} from "@shared/composables/useApiRequest.ts";
import {useRejectResponse} from "@shared/composables/useRejectResponse.ts";
import {useMessage} from "@shared/composables/useMessage.ts";

interface PasswordForm {
	currentPassword: string;
	newPassword: string;
}

const form = ref<PasswordForm>({
	currentPassword: "",
	newPassword: "",
});

const confirmPassword = ref<string>('');

const isSaving = ref(false);

const {post} = useApiRequest();
const {errors, errorMessage, isInvalidField, getErrorFieldMessage} = useRejectResponse();

const {error, info} = useMessage();

watch(errorMessage, (value) => {
	value && error(value) ;
});

watch(
	() => form.value,
	() => {
		if(errors.value){
			errors.value = null;
		}
	},
	{
		deep: true,
	}
);

const onSave = async () => {
	if (isSaving.value) return;
	isSaving.value = true;

	post('api-password', undefined, form.value)
		.then(()=>info('Пароль изменён'))
		.catch(response => {
			errors.value = {...response}
		})
		.finally(() => isSaving.value = false);
};
</script>
