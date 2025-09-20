<template>
	<component :is="layout">
		<router-view />
	</component>
</template>

<script setup lang="ts">
import Layout from "@layouts/MainLayout.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const layout = computed(() => route.meta.layout || Layout );
</script>
