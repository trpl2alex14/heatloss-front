<template>
	<div class="flex items-center gap-2">
		<component
			:is="url ? component : 'div'"
			:to="url"
			class="flex items-center gap-2"
		>
			<img :src="calcIcon" class="w-5 h-5" />
		</component>
		<span>{{ label }}</span>
	</div>
</template>

<script setup lang="ts">
import calcIcon from "@assets/icons/pencil-ruler.svg";
import { computed, type PropType } from "vue";
import { useLink } from "@shared/composables/useLink";

const { link } = useLink();

const props = defineProps({
	data: {
		type: [String, Number, Object] as PropType<
			string | number | { url: string; label: string }
		>,
		required: true,
	},
	type: {
		type: String as PropType<"link" | "router">,
		default: "router",
	},
});

const label = computed(() => {
	return typeof props.data === "object" ? props.data.label : props.data;
});

const url = computed(() => {
	return typeof props.data === "object" ? props.data.url : undefined;
});

const component = computed(() => {
	return props.type === "link" ? "a" : link;
});
</script>
