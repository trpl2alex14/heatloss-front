<template>
  <component 
    :is="isButton ? 'button' : 'router-link'" 
    v-bind="componentProps"
    :class="[
      'flex items-center gap-2 my-1 mx-5 text-lg rounded-md font-medium transition-colors duration-300',
      isActive ? 'text-(--my-color-gray)' : 'hover:bg-gray-200'
    ]">
    <div 
      v-if="iconSrc" 
      class="w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-300"
      :class="isActive ? 'bg-gray-700' : 'bg-none'"
    >
      <img 
        :src="iconSrc" 
        class="w-6 h-6" 
        :class="isActive ? 'filter brightness-0 invert' : ''" 
      />
    </div>
    <span>{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  to?: string
  label: string
  iconSrc?: string
  isButton?: boolean
  userIcon?: string
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => props.to && route.path === props.to)

const componentProps = computed(() => {  
  return props.isButton ? {} : { to: props.to }
})
</script>