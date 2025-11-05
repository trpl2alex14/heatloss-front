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
			<div class="flex gap-2">
				<template v-if="modelValueProxy.needDelivery">
					<div class="w-120">
						<BaseInputText
						v-model="modelValueProxy.deliveryInfo"
						label="Информация о доставке"
						placeholder="Введите информацию о доставке..."
						/>
					</div>
					<div class="w-50">
						<BaseInputNumber
						v-model="modelValueProxy.deliveryCost"
						label="Стоимость доставки"
						placeholder="0.00"
						suffix="₽"
						/>
					</div>
				</template>
				<BaseToggleSwitch
					v-model="modelValueProxy.needDelivery"
					label="Нужна доставка"
				/>
			</div>

			<!-- Промокод и стоимость электроэнергии в одной строке -->
			<div class="flex gap-2">
				<!-- Промокод -->
				<div class="w-120">
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
import { usePromoResources } from "../composables/usePromoResources.ts";
import BaseSelect from "@shared/components/ui/BaseSelect.vue";
import BaseInputNumber from "@shared/components/ui/BaseInputNumber.vue";
import BaseTextArea from "@shared/components/ui/BaseTextArea.vue";
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import type { PromoCode } from "@shared/types/ui";
import { useSettings } from "@features/settings/composables/useSettings.ts";
import BaseToggleSwitch from "@shared/components/ui/BaseToggleSwitch.vue";

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
const { data: promosData, isLoading, loadData } = usePromoResources();

watch(modelValueProxy, (value) => {
	if (value.powerPrice === undefined || value.powerPrice == null) {
		value.powerPrice = powerPrice;
	}
});

watch(() => modelValueProxy.value.promoCode, (value) => {
	if (value) {
		modelValueProxy.value.promoInfo = promosData.value.data.find((i:PromoCode)=>i.code === value)?.description;
	}
});

watch(() => modelValueProxy.value.city, (value) => {
	if (value && !modelValueProxy.value.deliveryInfo) {
		modelValueProxy.value.deliveryInfo = "Доставка в г." + value;
	}
});

watch(() => modelValueProxy.value.needDelivery, (value) => {
	if (!value) {
		modelValueProxy.value.deliveryInfo = "";
		modelValueProxy.value.deliveryCost = 0;
	}
});

// Опции для промокодов
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
