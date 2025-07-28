<template>
	<div class="p-0">
		<Head
			title="Оборудование"
			subtitle="Управление справочником оборудования"
		>
			<template #actions>
				<RowCounter value="45" label="Записей" />
				<BaseButton label="Добавить" icon="plus" />
			</template>
		</Head>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">Справочник оборудования</h2>
			<p class="text-gray-600">
				Здесь будет содержимое страницы оборудования
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import Head from "@/shared/components/SubHead.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
</script>
