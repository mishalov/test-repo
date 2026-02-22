<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  ariaLabel?: string
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  ariaLabel: undefined,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="['btn', `btn--${variant}`]"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

/* Primary: solid background */
.btn--primary {
  padding: 10px 24px;
  background: var(--color-primary);
  color: var(--color-button-text);
  border: none;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
}

/* Outline: transparent bg, border */
.btn--outline {
  padding: 8px 12px;
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn--outline:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-button-text);
}
</style>
