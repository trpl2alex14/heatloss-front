<template>
	<div class="rounded-xl p-6 mb-4 border border-gray-200">
		<nav class="flex flex-col gap-2">
			<component
				:is="link"
				v-for="item in menuItems"
				:key="item.path"
				:to="item.path"
				class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
				:class="{
					'hover:text-gray-500': !isActive(item.path),
					'bg-gray-200 hover:bg-gray-200': isActive(item.path),
					'cursor-default': isActive(item.path),
				}"
			>
				<img
					v-if="item.icon"
					:src="`/src/assets/icons/${item.icon}`"
					:alt="item.title"
					class="w-5 h-5 opacity-70"
					:class="{ 'opacity-100': isActive(item.path) }"
				/>
				<span class="text-sm font-medium">{{ item.title }}</span>
			</component>
		</nav>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import type { SubMenuItem } from "@/shared/types/submenu";
import { useLink } from "@/shared/composible/useLink";

const { link } = useLink();

interface Props {
	items: SubMenuItem[];
}

const props = defineProps<Props>();

const route = useRoute();

const menuItems = computed(() => props.items);

const isActive = (path: string) => {
	return route.path === path || route.path.startsWith(path + "/");
};
</script>
