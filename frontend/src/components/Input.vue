<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | number
  label: string
  id: string
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  'aria-describedby'?: string
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: undefined,
  required: false,
  disabled: false,
  min: undefined,
  max: undefined,
  step: undefined,
  'aria-describedby': undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number'
    ? (Number.isNaN(target.valueAsNumber) ? '' : target.valueAsNumber)
    : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="input-wrapper" :class="{ 'input-row': $slots.append }">
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :aria-describedby="props['aria-describedby']"
        @input="onInput"
      />
      <slot name="append" />
    </div>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    min-width: 0;
  }
}

</style>
