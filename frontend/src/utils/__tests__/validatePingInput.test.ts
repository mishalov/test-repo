import { describe, it, expect } from 'vitest'
import { validatePingInput } from '@/utils/validatePingInput'

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'

describe('validatePingInput', () => {
  it('returns valid data for correct inputs', () => {
    const result = validatePingInput(VALID_UUID, '75')
    expect(result).toEqual({
      valid: true,
      data: { uuid: VALID_UUID, battery_percent: 75 },
    })
  })

  it('rejects empty UUID', () => {
    const result = validatePingInput('   ', '50')
    expect(result).toEqual({ valid: false, message: 'UUID is required.' })
  })

  it('rejects UUID with invalid format', () => {
    const result = validatePingInput('not-a-uuid', '50')
    expect(result).toEqual({ valid: false, message: 'UUID must be a valid UUID format.' })
  })

  it('accepts UUID with valid format', () => {
    const result = validatePingInput(VALID_UUID, '50')
    expect(result).toEqual({
      valid: true,
      data: { uuid: VALID_UUID, battery_percent: 50 },
    })
  })

  it('rejects empty battery percent', () => {
    const result = validatePingInput(VALID_UUID, '')
    expect(result).toEqual({ valid: false, message: 'Battery percent is required.' })
  })

  it('rejects battery percent outside 0-100', () => {
    const below = validatePingInput(VALID_UUID, '-1')
    expect(below).toEqual({ valid: false, message: 'Battery percent must be between 0 and 100.' })

    const above = validatePingInput(VALID_UUID, '101')
    expect(above).toEqual({ valid: false, message: 'Battery percent must be between 0 and 100.' })
  })

  it('rejects non-numeric battery percent', () => {
    const result = validatePingInput(VALID_UUID, 'abc')
    expect(result).toEqual({ valid: false, message: 'Battery percent must be a valid number.' })
  })

  it('rejects fractional battery percent', () => {
    const result = validatePingInput(VALID_UUID, '75.5')
    expect(result).toEqual({ valid: false, message: 'Battery percent must be a whole number.' })
  })
})
