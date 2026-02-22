import { ref } from 'vue'
import { postPing } from '@/api/ping'
import { validatePingInput } from '@/utils/validatePingInput'

export function usePing(onSuccess: () => void) {
  const uuid = ref('')
  const batteryPercent = ref<string | number>('')
  const status = ref<{ ok: false; message: string } | null>(null)
  const loading = ref(false)

  async function sendPing(): Promise<void> {
    if (loading.value) return

    const result = validatePingInput(uuid.value, batteryPercent.value)
    if (!result.valid) {
      status.value = { ok: false, message: result.message }
      return
    }

    status.value = null
    loading.value = true

    try {
      const response = await postPing(result.data)

      if (response.ok) {
        uuid.value = ''
        batteryPercent.value = ''
        onSuccess()
        return
      }

      status.value = response
    } catch {
      status.value = { ok: false, message: 'Something went wrong.' }
    } finally {
      loading.value = false
    }
  }

  return {
    uuid,
    batteryPercent,
    status,
    loading,
    sendPing,
  }
}
