<template>
	<Tag
		v-bind="getTagAttr(status)"
		class="font-medium whitespace-nowrap"
	/>
</template>

<script setup lang="ts">
import Tag from "primevue/tag";
import type {TypeLabelDef} from "@shared/types/table.ts";

interface Props {
	statuses: TypeLabelDef[],
	status: string | number,
}

const props = defineProps<Props>();
const getTagAttr = (value: string | number) => {
	if (props.statuses) {
		const status = props.statuses.find((s) => s.key === value);
		return {
			severity: status?.type || "info",
			value: status?.label || value,
		};
	}
};

</script>
