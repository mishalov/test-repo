<script setup lang="ts">
import Input from './Input.vue'
import Button from './Button.vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  disabled?: boolean
  id?: string
  'aria-describedby'?: string
}>(), {
  modelValue: '',
  disabled: false,
  id: 'uuid',
  'aria-describedby': undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function generateUuid() {
  emit('update:modelValue', crypto.randomUUID())
}

function onUpdate(value: string | number) {
  emit('update:modelValue', String(value))
}
</script>

<template>
  <Input
    :model-value="modelValue"
    label="UUID"
    :id="id"
    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
    required
    :disabled="disabled"
    :aria-describedby="props['aria-describedby']"
    @update:model-value="onUpdate"
  >
    <template #append>
      <Button
        variant="outline"
        :disabled="disabled"
        aria-label="Generate UUID"
        @click="generateUuid"
      >
        Generate
      </Button>
    </template>
  </Input>
</template>
