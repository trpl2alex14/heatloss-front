<template>
 	<component v-if="component" :is="component" v-bind="props" v-on="actions">
	</component>
</template>

<script setup lang="ts">
import { inject, onMounted, type Ref, ref, markRaw } from "vue";
import type { ProxyDialog } from "../types/ui";

const dialogRef = inject("dialogRef") as Ref<ProxyDialog>;

const component = ref();
const props = ref();
const actions = ref({});

onMounted(() => {
	if (dialogRef && dialogRef.value?.data) {
		component.value = markRaw(dialogRef.value.data.component);
		props.value = dialogRef.value.data.props;
		actions.value = dialogRef.value.data.actions || {}		
	}
});

</script>