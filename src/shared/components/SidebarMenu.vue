<template>
  <aside class="w-64 h-screen flex flex-col p-0">
    <nav class="flex-1 flex flex-col gap-1 px-2">
      <SidebarMenuItem
        v-for="route in topMenuRoutes"
        :key="route.path"
        :to="route.path"
        :label="route.meta && route.meta.title ? route.meta.title : route.name"
        :icon-src="route.meta && route.meta.icon ? iconUrls[route.meta.icon] : 'layout-list'"
      />
      <div class="mt-auto mb-2 flex flex-col" v-if="bottomMenuRoutes.length">        
        <SidebarMenuItem
          v-for="route in bottomMenuRoutes"
          :key="route.path"
          :to="route.path"
          :label="route.meta && route.meta.title ? route.meta.title : route.name"
          :icon-src="route.meta && route.meta.icon ? iconUrls[route.meta.icon] : 'layout-list'"
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

<script setup>
import { useRouter } from 'vue-router'
import { computed, reactive, onMounted } from 'vue'
import { loadIcon } from '@shared/utils/iconLoader'
import SidebarMenuItem from './SidebarMenuItem.vue'
import Divider from './Divider.vue'
import userIcon from '@assets/icons/user-round.svg'

const router = useRouter()

const allMenuRoutes = computed(() =>
  router.options.routes.filter(r => r.name && r.meta && r.meta.title)
)

const topMenuRoutes = computed(() =>
  allMenuRoutes.value.filter(r => !r.meta.bottom)
)

const bottomMenuRoutes = computed(() =>
  allMenuRoutes.value.filter(r => r.meta.bottom)
)

const iconUrls = reactive({})

onMounted(async () => {
  for (const route of allMenuRoutes.value) {    
    if (route.meta && route.meta.icon) {      
      iconUrls[route.meta.icon] = await loadIcon(route.meta.icon)      
    }
  }
})
</script> 