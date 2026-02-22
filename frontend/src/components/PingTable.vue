<script setup lang="ts">
import type { Ping } from '@/types/ping'
import Button from '@/components/Button.vue'
import StatusMessage from '@/components/StatusMessage.vue'

defineProps<{
  pings: Ping[]
  loading: boolean
  error: string | null
}>()

defineEmits<{
  refresh: []
}>()
</script>

<template>
  <section class="ping-table">
    <div class="ping-table__header">
      <h2>Ping History</h2>
      <Button variant="outline" :disabled="loading" @click="$emit('refresh')">
        {{ loading ? 'Loading\u2026' : 'Refresh' }}
      </Button>
    </div>

    <StatusMessage v-if="error" :ok="false" :message="error" />

    <table v-if="pings.length" aria-label="Ping history">
      <thead>
        <tr>
          <th>UUID</th>
          <th>Battery %</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ping in pings" :key="ping.id">
          <td>{{ ping.uuid }}</td>
          <td>{{ ping.battery_percent }}</td>
          <td>{{ new Date(ping.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="loading" class="ping-table__loading">Loading pings...</p>
    <p v-else-if="!error" class="ping-table__empty">No pings yet.</p>
  </section>
</template>

<style scoped>
.ping-table {
  margin-top: 32px;
}

.ping-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  text-align: left;
}

th {
  font-weight: 600;
  font-size: 0.875rem;
}

.ping-table__empty,
.ping-table__loading {
  color: var(--color-text-muted, #666);
  font-style: italic;
}
</style>
