<template>
  <div class="flex min-h-screen bg-gray-100 text-black">
    <div class="flex flex-col items-center justify-start w-64 h-screen p-0">
      <div class="flex items-center justify-center mt-6 mb-8 p-3 border border-gray-200 rounded-xl">
        <img src="@assets/images/logo.png" alt="Гревольт" class="h-12" />
      </div>
      <SidebarMenu />
    </div>
    <main class="flex-1 p-6 my-3 mr-3 bg-white border-r border-gray-200 rounded-xl shadow-xl">
      <slot />      
      <div class="px-8 pb-4 pt-2 text-xs text-gray-400">© grevolt.ru, 2008–2025</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from '@shared/components/SidebarMenu.vue'
</script> 