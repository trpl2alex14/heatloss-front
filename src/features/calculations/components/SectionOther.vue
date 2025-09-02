<template>
	<div class="section-other">
		<!-- Заголовок секции -->
		<div class="mb-5">
			<h3 class="text-xl font-normal text-gray-900">
				Дополнительная информация
			</h3>
		</div>

		<!-- Поля формы -->
		<div class="space-y-2">
			<!-- Промокод и стоимость электроэнергии в одной строке -->
			<div class="flex gap-5">
				<!-- Промокод -->
				<div class="w-70">
					<BaseSelect
						v-model="modelValueProxy.promoCode"
						:options="promoOptions"
						option-label="label"
						option-value="value"
						placeholder="Без промокода"
						label="Промокод"
						:disabled="isLoading"
					/>
				</div>

				<!-- Стоимость электроэнергии -->
				<div class="w-50">
					<BaseInputNumber
						v-model="modelValueProxy.powerPrice"
						label="Стоимость электроэнергии"
						placeholder="0.00"
						suffix="₽ за кВт"
						:min-fraction-digits="2"
						:max-fraction-digits="2"
					/>
				</div>
			</div>

			<!-- Комментарии для клиента -->
			<div>
				<BaseTextArea
					v-model="modelValueProxy.comment"
					label="Комментарии для клиента"
					placeholder="Введите комментарии..."
					rows="4"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import type { CalculationDetails } from "../types";
import { usePromos } from "../api/promos";
import BaseSelect from "@/shared/components/ui/BaseSelect.vue";
import BaseInputNumber from "@/shared/components/ui/BaseInputNumber.vue";
import BaseTextArea from "@/shared/components/ui/BaseTextArea.vue";
import type { PromoCode } from "@/shared/types/ui";
import { useSettings } from "@/features/settings/composables/useSettings.ts";

interface Props {
	modelValue: CalculationDetails;
}

const props = defineProps<Props>();

const { powerPrice } = useSettings();

const emit = defineEmits<{
	"update:modelValue": [value: CalculationDetails];
}>();

const modelValueProxy = computed<CalculationDetails>({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

// API для промокодов
const { data: promosData, isLoading, loadData } = usePromos();

watch(modelValueProxy, (value) => {
	if (value.powerPrice === undefined || value.powerPrice === null) {
		value.powerPrice = powerPrice;
	}
});

// Опции для селекта промокодов
const promoOptions = computed(() => {
	const options = [
		{
			label: "Без промокода",
			value: null,
		},
	];

	if (promosData.value?.data) {
		options.push(
			...promosData.value.data.map((promo: PromoCode) => ({
				label: `${promo.code} - ${promo.description}`,
				value: promo.code,
			}))
		);
	}

	return options;
});

// Загружаем данные при монтировании компонента
onMounted(() => {
	loadData();
});
</script>
