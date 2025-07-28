<template>	
	<slot name="header" />	
	<div class="flex gap-6">
		<div class="w-80 flex-shrink-0">
			<SubMenu :items="subMenuItems" />
		</div>
		<div class="flex-1">
			<router-view />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SubMenu from "@/shared/components/SubMenu.vue";

const route = useRoute();
const router = useRouter();

const subMenuItems = computed(() => {
	const currentRoute = router
		.getRoutes()
		.filter((child) => child.meta?.title)
		.find((r) => r.path === route.matched[0].path);

	if (!currentRoute?.children) {
		return [];
	}

	return currentRoute.children
		.filter((child) => child.meta?.title)
		.map((child) => ({
			path: `${currentRoute.path}/${child.path}`,
			title: child.meta?.title as string,
			icon: child.meta?.icon as string,
		}));
});
</script>
