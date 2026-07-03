import { readVersioned, writeVersioned, type StorageDriver } from './versioned-storage'

const valid = (v: unknown): v is { name: string } => typeof v === 'object' && v !== null && typeof (v as any).name === 'string'

describe('versioned storage', () => {
  it('round trips valid values', () => {
    const values = new Map<string, unknown>()
    const driver: StorageDriver = { get: (k) => values.get(k), set: (k, v) => void values.set(k, v), remove: (k) => void values.delete(k) }
    expect(writeVersioned(driver, 'x', 1, { name: 'bbl' })).toBe(true)
    expect(readVersioned(driver, 'x', 1, valid)).toEqual({ name: 'bbl' })
  })
  it('rejects old and damaged values', () => {
    const driver: StorageDriver = { get: () => ({ version: 0, data: { name: 'old' } }), set: () => {}, remove: () => {} }
    expect(readVersioned(driver, 'x', 1, valid)).toBeUndefined()
  })
  it('contains storage errors', () => {
    const driver: StorageDriver = { get: () => { throw new Error('broken') }, set: () => { throw new Error('full') }, remove: () => {} }
    expect(readVersioned(driver, 'x', 1, valid)).toBeUndefined()
    expect(writeVersioned(driver, 'x', 1, {})).toBe(false)
  })
})
