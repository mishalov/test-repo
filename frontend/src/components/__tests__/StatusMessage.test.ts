import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusMessage from '@/components/StatusMessage.vue'

describe('StatusMessage', () => {
  it('renders success state with correct class and role', () => {
    const wrapper = mount(StatusMessage, { props: { ok: true, message: 'Ping sent!' } })
    const p = wrapper.find('p')

    expect(p.text()).toBe('Ping sent!')
    expect(p.classes()).toContain('success')
    expect(p.attributes('role')).toBe('status')
  })

  it('renders error state with correct class and role', () => {
    const wrapper = mount(StatusMessage, { props: { ok: false, message: 'Something went wrong.' } })
    const p = wrapper.find('p')

    expect(p.text()).toBe('Something went wrong.')
    expect(p.classes()).toContain('error')
    expect(p.attributes('role')).toBe('alert')
  })
})
