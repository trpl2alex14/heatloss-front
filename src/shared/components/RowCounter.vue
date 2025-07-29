<template>
	<div class="border border-gray-300 rounded-md py-2 px-3">
		{{ value }} {{ label }}
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { plural } from "@/shared/utils/text";

interface Props {
	value: number;
	label?: string;
}

const props = defineProps<Props>();

const label = computed(() => {
	return props?.label || plural(props.value, ["запись", "записи", "записей"]);	
});
</script>
