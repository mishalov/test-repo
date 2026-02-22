<script setup lang="ts">
import { usePingList } from '@/composables/usePingList'
import { usePing } from '@/composables/usePing'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import UuidField from '@/components/UuidField.vue'
import StatusMessage from '@/components/StatusMessage.vue'
import PingTable from '@/components/PingTable.vue'

const { pings, loading: listLoading, error: listError, loadPings } = usePingList()
const { uuid, batteryPercent, status, loading, sendPing } = usePing(loadPings)
</script>

<template>
  <main>
    <h1>Ping</h1>

    <form @submit.prevent="sendPing">
      <UuidField v-model="uuid" :disabled="loading" :aria-describedby="status ? 'form-status' : undefined" />

      <Input
        v-model="batteryPercent"
        label="Battery Percent"
        id="battery"
        type="number"
        min="0"
        max="100"
        step="1"
        placeholder="0 – 100"
        required
        :disabled="loading"
        :aria-describedby="status ? 'form-status' : undefined"
      />

      <Button type="submit" :disabled="loading">
        {{ loading ? 'Sending\u2026' : 'Send' }}
      </Button>
    </form>

    <StatusMessage v-if="status" id="form-status" :ok="status.ok" :message="status.message" />

    <PingTable
      :pings="pings"
      :loading="listLoading"
      :error="listError"
      @refresh="loadPings"
    />
  </main>
</template>

<style scoped>
main {
  max-width: 420px;
  margin: 60px auto;
  font-family: sans-serif;
}

h1 {
  margin-bottom: 24px;
}
</style>
