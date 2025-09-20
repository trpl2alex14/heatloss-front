<template>
	<div class="flex min-h-screen bg-gray-100 text-black">
		<main
			class="flex-1 p-6 my-3 mx-3 pb-14 bg-white border-r border-gray-200 rounded-xl shadow-xl relative"
		>	
			<Toast position="bottom-right" />
			<DynamicDialog />
			<slot />
			<div class="text-xs text-gray-400 absolute bottom-6">
				© grevolt.ru, 2008–2025
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import DynamicDialog from "primevue/dynamicdialog";
</script>
