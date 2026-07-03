export interface StorageDriver {
  get(key: string): unknown
  set(key: string, value: unknown): void
  remove(key: string): void
}

export function readVersioned<T>(driver: StorageDriver, key: string, version: number, isValid: (value: unknown) => value is T): T | undefined {
  try {
    const envelope = driver.get(key) as { version?: unknown; data?: unknown } | undefined
    return envelope?.version === version && isValid(envelope.data) ? envelope.data : undefined
  } catch {
    return undefined
  }
}

export function writeVersioned<T>(driver: StorageDriver, key: string, version: number, data: T): boolean {
  try {
    driver.set(key, { version, data })
    return true
  } catch {
    return false
  }
}
