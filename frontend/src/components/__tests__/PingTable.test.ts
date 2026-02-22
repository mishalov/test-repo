import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PingTable from '@/components/PingTable.vue'
import type { Ping } from '@/types/ping'

const makePing = (id: number): Ping => ({
  id,
  uuid: `uuid-${id}`,
  battery_percent: id * 10,
  created_at: '2024-01-01T00:00:00Z',
})

describe('PingTable', () => {
  it('renders table rows from pings array', () => {
    const pings = [makePing(1), makePing(2)]
    const wrapper = mount(PingTable, { props: { pings, loading: false, error: null } })
    const rows = wrapper.findAll('tbody tr')

    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('uuid-1')
    expect(rows[0].text()).toContain('10')
    expect(rows[1].text()).toContain('uuid-2')
  })

  it('displays formatted created_at timestamp for each ping', () => {
    const pings = [makePing(1)]
    const wrapper = mount(PingTable, { props: { pings, loading: false, error: null } })
    const row = wrapper.findAll('tbody tr')[0]
    const expectedTime = new Date('2024-01-01T00:00:00Z').toLocaleString()

    expect(row.text()).toContain(expectedTime)
  })

  it('shows empty state when no pings and not loading', () => {
    const wrapper = mount(PingTable, { props: { pings: [], loading: false, error: null } })

    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No pings yet.')
  })

  it('shows loading state when pings is empty and loading is true', () => {
    const wrapper = mount(PingTable, { props: { pings: [], loading: true, error: null } })

    expect(wrapper.text()).toContain('Loading pings...')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('shows error message when error is set', () => {
    const wrapper = mount(PingTable, {
      props: { pings: [], loading: false, error: 'Failed to load.' },
    })
    // StatusMessage renders a <p role="alert"> with the error text
    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toBe('Failed to load.')
  })

  it('emits refresh when Refresh button clicked', async () => {
    const wrapper = mount(PingTable, { props: { pings: [], loading: false, error: null } })
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('refresh')).toBeTruthy()
  })
})
