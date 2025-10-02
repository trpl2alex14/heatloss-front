<template>
	<BaseChip
		v-if="tag"
		:label="tag.label"
		:icon="tag.icon"
		:class="$attrs.class"
		:icon-size="iconSize"
	/>
	<BaseChip
		v-else-if="isLoading"
		:label="label"
		class="opacity-50"
		:class="$attrs.class"
		:icon-size="iconSize"
	/>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import { useTagsApi } from "@shared/api/tags.ts";
import type { Tag } from "@/shared/types/ui";

interface Props {
	label: string;
	iconSize?: string;
}

const props = defineProps<Props>();

const { isLoading, loadData, tagsIndex } = useTagsApi();

const tag = computed<Tag | null>(() => {
	return (
		tagsIndex.value.get(props.label) || {
			label: props.label,
			icon: "hashtag",
		}
	);
});

onMounted(() => {
	loadData();
});
</script>
