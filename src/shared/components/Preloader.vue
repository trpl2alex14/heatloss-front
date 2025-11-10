<template>
	<div class="w-auto flex gap-4 flex-col">
		<div class="w-full h-50 rounded-xl bg"></div>
		<div class="w-full h-200 rounded-xl bg"></div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.bg {
	position: relative;
	overflow: hidden;
}

.bg:before,
.bg:after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.bg:before {
	background: #fafafa;
}

.bg:after {
	display: block;
	width: 150px;
	background: linear-gradient(to right, transparent 0%, #f1f1f1 50%, transparent 100%);
	animation: load 2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
}

@keyframes load {
	from {
		left: -150px;
	}
	to {
		left: 100%;
	}
}
</style>
