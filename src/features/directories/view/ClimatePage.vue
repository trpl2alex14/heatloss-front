<template>
	<div class="p-0">
		<Head
			title="Климатология"
			subtitle="Управление справочником климатических данных"
		>
			<template #actions>
				<RowCounter value="67" label="Регионов" />
				<BaseButton label="Добавить" icon="plus" />
			</template>
		</Head>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">Справочник климатологии</h2>
			<p class="text-gray-600">
				Здесь будет содержимое страницы климатологии
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import Head from "@/shared/components/SubHead.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
</script>
