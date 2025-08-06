<template>
	<Chip
		v-bind="chipProps"
		:class="['mr-1', 'text-sm', $attrs.class]"
		:style="[
			{ '--p-chip-icon-font-size': iconSize || '1rem' },
			{ '--p-chip-icon-size': iconSize || '1rem' },
		]"
		@remove="onRemove()"
	/>
</template>

<script setup lang="ts">
import { useAttrs, computed } from "vue";
import Chip from "primevue/chip";

type Props = {
	label: string;
	icon?: string;
	image?: string;
	removable?: boolean;
	iconSize?: string;
};

const props = defineProps<Props>();

const $attrs = useAttrs();
const $emit = defineEmits(["remove"]);

const chipProps = computed(() => ({
	...props,
	icon: props?.icon ? `pi pi-${props.icon}` : undefined,
}));

const onRemove = () => {
	$emit("remove");
};
</script>
