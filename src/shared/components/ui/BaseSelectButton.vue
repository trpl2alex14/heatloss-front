<template>
  <SelectButton
    v-model="modelValueProxy"
    :options="options"
    :option-label="optionLabel"
    :option-value="optionValue"
    :multiple="multiple"
    :disabled="disabled"
    :aria-labelledby="ariaLabelledby"
    :class="computedClass"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import SelectButton from 'primevue/selectbutton';

interface Option {
  label: string;
  value: any;
  [key: string]: any;
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: undefined,
  },
  options: {
    type: Array as () => Option[],
    required: true,
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ariaLabelledby: {
    type: String,
    default: undefined,
  },
  className: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const computedClass = computed(() =>
  [
   // 'flex gap-2',
   // 'bg-gray-100 rounded-lg p-1',    
//'h-[34px]',
    props.className,
  ].join(' ')
);
</script> 