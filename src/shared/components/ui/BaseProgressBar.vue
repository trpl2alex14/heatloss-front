<template>
	<div class="w-full">
		<template v-if="hasCompleatSlot() && value > 100">
			<slot name="compleat" />
		</template>
		<ProgressBar v-else v-bind="progressProps" :style="[$attrs.style, barStyle]">
			<slot />
		</ProgressBar>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots, type PropType } from "vue";
import ProgressBar from "primevue/progressbar";

const props = defineProps({
	value: {
		type: Number,
		required: true,
		default: 0,
	},
	mode: {
		type: String as PropType<"determinate" | "indeterminate">,
		default: "determinate",
	},
	hide: {
		type: Boolean,
		default: false,
	},
});

const hasCompleatSlot = () => {
	return !!useSlots().compleat;
}

const $attrs = useAttrs();

// Функция для вычисления цвета по value (градиент: красный -> синий -> зеленый)
const getBarColor = (value: number) => {
	if (value <= 50) {
		// Красный (0%) -> Синий (50%)
		const r = 255 - Math.round((value / 50) * 255);
		const g = 0;
		const b = Math.round((value / 50) * 255);
		return `rgb(${r},${g},${b})`;
	} else {
		// Синий (50%) -> Зеленый (100%)
		const r = 0;
		const g = Math.round(((value - 50) / 50) * 255);
		const b = 255 - Math.round(((value - 50) / 50) * 255);
		return `rgb(${r},${g},${b})`;
	}
};

const barStyle = computed(() => {
	return {
		"--base-progress-bar-color": getBarColor(props.value),
	};
});

const progressProps = computed(() => ({
	value: props.value,
	mode: props.mode,
	showValue: !props.hide && props.value > 30,
	...$attrs,
}));
</script>

<style scoped>
:deep(.p-progressbar-value) {
	background-color: var(--base-progress-bar-color) !important;
	transition: background-color 0.3s;
}
</style>
