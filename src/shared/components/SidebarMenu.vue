<template>
	<aside class="w-70 h-screen flex flex-col p-0">
		<nav class="flex-1 flex flex-col gap-1 px-2">
			<SidebarMenuItem
				v-for="route in topMenuRoutes"
				:key="route.path"
				:to="route.path"
				:label="route.meta.title"
				:icon-src="route.meta.iconSrc"
			/>
			<div
				class="mt-auto mb-2 flex flex-col"
				v-if="bottomMenuRoutes.length"
			>
				<SidebarMenuItem
					v-for="route in bottomMenuRoutes"
					:key="route.path"
					:to="route.path"
					:label="route.meta.title"
					:icon-src="route.meta.iconSrc"
				/>
				<slot name="footer" />
			</div>
		</nav>
	</aside>
</template>

<script setup lang="ts">
import SidebarMenuItem from "./SidebarMenuItem.vue";
import useMenu from "@shared/composables/useMenu";

const { topMenuRoutes, bottomMenuRoutes } = useMenu();
</script>
