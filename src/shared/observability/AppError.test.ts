import { AppError, toAppError } from './AppError'

describe('toAppError', () => {
  it('preserves app errors', () => { const error = new AppError('STORAGE', 'x', false); expect(toAppError(error)).toBe(error) })
  it('maps permission errors', () => expect(toAppError(new Error('permission denied')).code).toBe('FORBIDDEN'))
  it('maps network errors', () => expect(toAppError(new Error('network timeout')).retryable).toBe(true))
})
