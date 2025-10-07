<template>
	<template v-if="item">
		<div class="inline-flex items-center gap-1 h-5">
			<template v-if="typeName === 'image' && 'image' in item">
				<img
					v-if="short"
					:src="item.image"
					class="w-5 h-5"
					v-tooltip.bottom="item.label"
				/>
				<template v-else>
					<img :src="item.image" class="w-5 h-5" />
					<span v-if="!short" class="text-sm">{{ item.label }}</span>
				</template>
			</template>
			<template v-else-if="typeName === 'icon' && 'icon' in item">
				<i
					:class="classList"
					class="w-5 h-5"
					v-tooltip.bottom="item.label"
				/>
				<span v-if="!short" class="text-sm">{{
					item.label || item.key
				}}</span>
			</template>
			<template v-else-if="typeName === 'label'">
				<span class="text-sm">{{ item.label || item.key }}</span>
			</template>
		</div>
	</template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
	TypeImageDef,
	TypeIconDef,
	TypeLabelDef,
} from "@shared/types/table";

const props = defineProps<{
	type: number | string;
	types: TypeImageDef[] | TypeIconDef[] | TypeLabelDef[];
	short?: boolean;
}>();

const item = computed(() => {
	return props.types.find((t) => t.key === props.type);
});

const typeName = computed(() => {
	if (!props.types.length) return "label";
	const first = props.types[0];
	if ("image" in first) return "image";
	if ("icon" in first) return "icon";
	if ("type" in first) return "label";
	return "label";
});

const classList = computed(() => {
	if (typeName.value === "icon" && item.value && "icon" in item.value) {
		return [item.value.icon, item.value.color, "text-sm"];
	}
	return [];
});
</script>
