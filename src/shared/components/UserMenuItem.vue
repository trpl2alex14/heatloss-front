<template>
	<BaseDropdownMenu
		:id="user?.id"
		:actions="menu"
		@action="onMenuAction"
	>
		<template #start>
			<div class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 rounded-none">
				<div>
					<div class="text-lg">{{shortName}}</div>
					<span v-if="user?.email" class="text-sm text-gray-500">{{user?.email}}</span>
				</div>
			</div>
			<Divider/>
		</template>
		<template #default="{open}">
			<SidebarMenuItem
				is-button
				@click="open"
				:label="shortName"
				:icon-src="userIcon"
				:disabled="!isActiveMenu"
			/>
		</template>
	</BaseDropdownMenu>
</template>

<script setup lang="ts">
import userIcon from "@assets/icons/user-round.svg";
import SidebarMenuItem from "@shared/components/SidebarMenuItem.vue";
import {BaseDropdownMenu} from "@shared/components/index.ts";
import Divider from "@shared/components/Divider.vue";
import {useAuth} from "@shared/composables/useAuth.ts";
import type {ActionDef, ActionValue} from "@shared/types/menu.ts";
import {computed} from "vue";

const {user, isLoading, shortName, logout} = useAuth();

const menu: ActionDef[] = [
	{
		label: 'Выход',
		icon: 'pi pi-exit',
		name: 'logout'
	}
];

const isActiveMenu = computed(() => {
	return !!user.value && !isLoading.value;
})

const onMenuAction = ({action}: ActionValue) => {
	switch (action){
		case 'logout':
			logout();
			break;
	}
}
</script>
