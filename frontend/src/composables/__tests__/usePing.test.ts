import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/api/ping', () => ({
  postPing: vi.fn(),
}))

// Import after mock to ensure the module uses the mocked version
import { usePing } from '@/composables/usePing'
import { postPing } from '@/api/ping'

const mockPostPing = vi.mocked(postPing)

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'

beforeEach(() => {
  mockPostPing.mockReset()
})

describe('usePing', () => {
  it('validates input and sets error status on invalid input', async () => {
    const onSuccess = vi.fn()
    const { uuid, batteryPercent, status, sendPing } = usePing(onSuccess)
    uuid.value = ''
    batteryPercent.value = ''

    await sendPing()

    expect(status.value).toEqual({ ok: false, message: 'UUID is required.' })
    expect(mockPostPing).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('calls onSuccess and clears the form on success', async () => {
    mockPostPing.mockResolvedValue({ ok: true })

    const onSuccess = vi.fn()
    const { uuid, batteryPercent, status, sendPing } = usePing(onSuccess)
    uuid.value = VALID_UUID
    batteryPercent.value = 75

    await sendPing()

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(status.value).toBeNull()
    expect(uuid.value).toBe('')
    expect(batteryPercent.value).toBe('')
  })

  it('sets status on API error response', async () => {
    mockPostPing.mockResolvedValue({ ok: false, message: 'Something went wrong.' })

    const onSuccess = vi.fn()
    const { uuid, batteryPercent, status, sendPing } = usePing(onSuccess)
    uuid.value = VALID_UUID
    batteryPercent.value = 50

    await sendPing()

    expect(status.value).toEqual({ ok: false, message: 'Something went wrong.' })
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('sets loading to true during API call and back to false after', async () => {
    let resolveFn!: (value: any) => void
    mockPostPing.mockReturnValue(new Promise((resolve) => { resolveFn = resolve }))

    const { uuid, batteryPercent, loading, sendPing } = usePing(vi.fn())
    uuid.value = VALID_UUID
    batteryPercent.value = 50

    const promise = sendPing()
    expect(loading.value).toBe(true)

    resolveFn({ ok: true })
    await promise

    expect(loading.value).toBe(false)
  })

  it('prevents concurrent calls while loading', async () => {
    let resolveFn!: (value: any) => void
    mockPostPing.mockReturnValue(new Promise((resolve) => { resolveFn = resolve }))

    const { uuid, batteryPercent, sendPing } = usePing(vi.fn())
    uuid.value = VALID_UUID
    batteryPercent.value = 50

    const firstCall = sendPing()
    const secondResult = await sendPing()

    expect(secondResult).toBeUndefined()
    expect(mockPostPing).toHaveBeenCalledTimes(1)

    resolveFn({ ok: true })
    await firstCall
  })
})
