import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import type { Ping } from '@/types/ping'

vi.mock('@/api/ping', () => ({
  fetchPings: vi.fn(),
}))

// Import after mock to ensure the module uses the mocked version
import { usePingList } from '@/composables/usePingList'
import { fetchPings } from '@/api/ping'

const mockFetchPings = vi.mocked(fetchPings)

const makePing = (id: number): Ping => ({
  id,
  uuid: `uuid-${id}`,
  battery_percent: id * 10,
  created_at: '2024-01-01T00:00:00Z',
})

beforeEach(() => {
  mockFetchPings.mockReset()
})

describe('usePingList', () => {
  it('loads pings on instantiation', async () => {
    const initialPings = [makePing(1), makePing(2)]
    mockFetchPings.mockResolvedValue(initialPings)

    const { pings, error } = usePingList()
    await flushPromises()

    expect(pings.value).toEqual(initialPings)
    expect(error.value).toBeNull()
  })

  it('sets error when fetchPings throws', async () => {
    mockFetchPings.mockRejectedValue(new Error('Server unavailable'))

    const { pings, error } = usePingList()
    await flushPromises()

    expect(pings.value).toEqual([])
    expect(error.value).toBe('Something went wrong.')
  })

  it('sets loading to true during fetch and back to false after', async () => {
    let resolveFn!: (value: any) => void
    mockFetchPings.mockReturnValue(new Promise((resolve) => { resolveFn = resolve }))

    const { loading } = usePingList()
    expect(loading.value).toBe(true)

    resolveFn([makePing(1)])
    await flushPromises()

    expect(loading.value).toBe(false)
  })

  it('prevents concurrent loadPings calls while already loading', async () => {
    let resolveFn!: (value: any) => void
    mockFetchPings.mockReturnValue(new Promise((resolve) => { resolveFn = resolve }))

    const { loadPings } = usePingList()
    // usePingList() already calls loadPings() on init, so it's loading now
    expect(mockFetchPings).toHaveBeenCalledTimes(1)

    // Calling loadPings again while the first is in-flight should be a no-op
    loadPings()
    expect(mockFetchPings).toHaveBeenCalledTimes(1)

    resolveFn([makePing(1)])
    await flushPromises()
  })

  it('reloads pings when loadPings is called after initial load', async () => {
    const initialPings = [makePing(1)]
    const refreshedPings = [makePing(1), makePing(2)]
    mockFetchPings
      .mockResolvedValueOnce(initialPings)
      .mockResolvedValueOnce(refreshedPings)

    const { pings, loadPings } = usePingList()
    await flushPromises()

    expect(pings.value).toEqual(initialPings)

    await loadPings()

    expect(pings.value).toEqual(refreshedPings)
    expect(mockFetchPings).toHaveBeenCalledTimes(2)
  })
})
