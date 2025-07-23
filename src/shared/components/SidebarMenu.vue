<template>
	<aside class="w-64 h-screen flex flex-col p-0">
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
				<Divider />
				<SidebarMenuItem
					is-button
					@click="console.log('show user menu')"
					label="Пользователь"
					:icon-src="userIcon"
				/>
			</div>
		</nav>
	</aside>
</template>

<script setup lang="ts">
import SidebarMenuItem from "./SidebarMenuItem.vue";
import Divider from "./Divider.vue";
import userIcon from "@assets/icons/user-round.svg";
import useMenu from "@shared/composible/useMenu";

const { topMenuRoutes, bottomMenuRoutes } = useMenu();
</script>
