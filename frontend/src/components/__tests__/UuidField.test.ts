import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UuidField from '@/components/UuidField.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UuidField', () => {
  it('emits generated UUID when Generate button clicked', async () => {
    const fakeUuid = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
    vi.stubGlobal('crypto', { randomUUID: () => fakeUuid })

    const wrapper = mount(UuidField)
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([fakeUuid])
  })

  it('passes modelValue through to input', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const wrapper = mount(UuidField, { props: { modelValue: uuid } })

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe(uuid)
  })

  it('disables both input and button when disabled', () => {
    const wrapper = mount(UuidField, { props: { disabled: true } })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits update:modelValue when user types into the input', async () => {
    const wrapper = mount(UuidField)
    const input = wrapper.find('input')

    await input.setValue('my-typed-uuid')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['my-typed-uuid'])
  })
})
