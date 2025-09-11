<template>
	<div class="">
		<h3 class="text-base font-medium border-b border-gray-200 pb-2 mb-2">Последние расчёты</h3>
		<div v-for="(item, index) in history" :key="item.key">
			<div				
				class=" flex justify-between items-end cursor-pointer"
				:class="{ 
					'text-gray-500': item.key === props.openKey,					
					'hover:opacity-50': item.key !== props.openKey
				 }"
				@click="emit('open', item.key)"
			>
				<div class="text-sm font-normal">{{ index + 1 }}. {{ item.label || item.key }}</div>
				<div class="text-gray-500 text-xs">
					{{ new Date(item.createdAt).toLocaleDateString() }}
					{{ new Date(item.createdAt).toLocaleTimeString() }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { LocalHistory } from "../composables/useLocalHistory";

const emit = defineEmits(["open"]);

const props = defineProps<{
	openKey?: string;
	history: LocalHistory[];
}>();

</script>
