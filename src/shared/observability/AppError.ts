export type AppErrorCode = 'NETWORK' | 'FORBIDDEN' | 'INVALID_DATA' | 'STORAGE' | 'UNKNOWN'

export class AppError extends Error {
  public readonly originalCause: unknown
  constructor(public readonly code: AppErrorCode, public readonly userMessage: string, public readonly retryable: boolean, options?: { cause?: unknown }) {
    super(userMessage)
    this.name = 'AppError'
    this.originalCause = options?.cause
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) return new AppError('FORBIDDEN', '没有访问这份数据的权限', false, { cause: error })
  if (message.includes('network') || message.includes('timeout') || message.includes('fail')) return new AppError('NETWORK', '网络暂时不可用，请稍后重试', true, { cause: error })
  return new AppError('UNKNOWN', '出了点小状况，请稍后重试', true, { cause: error })
}
