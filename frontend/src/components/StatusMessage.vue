<script setup lang="ts">
defineProps<{
  ok: boolean
  message: string
  id?: string
}>()
</script>

<template>
  <p :id="id" :class="ok ? 'success' : 'error'" :role="ok ? 'status' : 'alert'">
    {{ message }}
  </p>
</template>

<style scoped>
p {
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 4px;
}

.success {
  color: var(--color-success-text);
  background: var(--color-success-bg);
}

.error {
  color: var(--color-error-text);
  background: var(--color-error-bg);
}
</style>
