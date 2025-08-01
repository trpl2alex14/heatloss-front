<template>
	<Chip
		v-bind="chipProps"
		v-on="$attrs"
		:class="['mr-1', 'text-sm', $attrs.class]"
		@remove="onRemove()"
	/>
</template>

<script setup lang="ts">
import { useAttrs, computed } from "vue";
import Chip from "primevue/chip";

const props = defineProps({
	label: String,
	icon: String,
	image: String,
	removable: Boolean,
});

const $attrs = useAttrs();
const $emit = defineEmits(["remove"]);

const chipProps = computed(() => ({
	label: props.label,
	icon: props.icon,
	image: props.image,
	removable: props.removable,
}));

const onRemove = () => {
	$emit("remove");	
};
</script>
