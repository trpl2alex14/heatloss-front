<template>
	<div class="flex flex-col gap-2">
		<div class="flex gap-x-4">
			<BaseButton
				v-if="client.lead"
				:label="`Лид №${client.lead}`"
				as="a"
				text
				:href="getLeadUrl(client.lead)"
				target="_blank"
				icon="link"
			/>
			<BaseButton
				v-if="client.deal"
				:label="`Сделка №${client.deal}`"
				as="a"
				text
				:href="getDealUrl(client.deal)"
				target="_blank"
				icon="link"
			/>
		</div>
		<BaseInputText v-model="client.name" label="Клиент" disabled />
		<div class="flex flex-wrap gap-2">
			<BaseInputText
				v-model="client.phone"
				label="Телефон"
				class="flex-1"
				disabled
			/>
			<BaseInputText
				v-model="client.email"
				label="Почта"
				class="flex-1"
				disabled
			/>
		</div>
		<div>
			<BaseTextArea
				v-model="client.comment"
				label="Комментарий"
				class="flex-1"
				rows="3"
				disabled
				autoResize
				style="resize: none"
			/>
		</div>
		<div class="flex gap-x-4 flex-wrap">
			<BaseButton
				v-for="(attach, key) in attachments"
				:label="attach.label"
				:key="key"
				as="a"
				text
				:href="attach.url"
				target="_blank"
				icon="file"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Attach, ClientRequest } from "@/shared/types/client";
import BaseButton from "@shared/components/ui/BaseButton.vue";
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import BaseTextArea from "@shared/components/ui/BaseTextArea.vue";
import { useCrm } from "@/shared/composables/useCrm";

type Props = {
	client: ClientRequest;
	attachments?: Attach[];
};

const { getDealUrl, getLeadUrl } = useCrm();

defineProps<Props>();
</script>
