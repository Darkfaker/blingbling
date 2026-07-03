export type PomodoroPhase = 'focus' | 'break'
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface PomodoroState {
  status: PomodoroStatus
  phase: PomodoroPhase
  durationMs: number
  startedAt: number | null
  elapsedBeforeStartMs: number
  completedAt: number | null
}

export type PomodoroAction =
  | { type: 'start'; now: number; durationMs?: number }
  | { type: 'pause'; now: number }
  | { type: 'resume'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'reset' }
  | { type: 'setDuration'; durationMs: number }
  | { type: 'next'; now: number; durationMs: number }

export const defaultPomodoroState = (durationMs = 25 * 60_000): PomodoroState => ({ status: 'idle', phase: 'focus', durationMs, startedAt: null, elapsedBeforeStartMs: 0, completedAt: null })

export function elapsedMs(state: PomodoroState, now: number): number {
  const active = state.status === 'running' && state.startedAt !== null ? Math.max(0, now - state.startedAt) : 0
  return Math.min(state.durationMs, Math.max(0, state.elapsedBeforeStartMs + active))
}

export function remainingMs(state: PomodoroState, now: number): number {
  return Math.max(0, state.durationMs - elapsedMs(state, now))
}

export function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'start':
      if (state.status !== 'idle') return state
      return { ...state, status: 'running', durationMs: action.durationMs ?? state.durationMs, startedAt: action.now, elapsedBeforeStartMs: 0, completedAt: null }
    case 'pause': {
      if (state.status !== 'running') return state
      const elapsed = elapsedMs(state, action.now)
      return { ...state, status: elapsed >= state.durationMs ? 'completed' : 'paused', startedAt: null, elapsedBeforeStartMs: elapsed, completedAt: elapsed >= state.durationMs ? action.now : null }
    }
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'running', startedAt: action.now } : state
    case 'tick':
      return state.status === 'running' && remainingMs(state, action.now) === 0 ? { ...state, status: 'completed', startedAt: null, elapsedBeforeStartMs: state.durationMs, completedAt: action.now } : state
    case 'reset':
      return defaultPomodoroState(state.durationMs)
    case 'setDuration':
      return state.status === 'idle' && action.durationMs > 0 ? { ...state, durationMs: action.durationMs } : state
    case 'next':
      if (state.status !== 'completed') return state
      return { status: 'running', phase: state.phase === 'focus' ? 'break' : 'focus', durationMs: action.durationMs, startedAt: action.now, elapsedBeforeStartMs: 0, completedAt: null }
  }
}

export function isPomodoroState(value: unknown): value is PomodoroState {
  if (!value || typeof value !== 'object') return false
  const v = value as PomodoroState
  return ['idle', 'running', 'paused', 'completed'].includes(v.status) && ['focus', 'break'].includes(v.phase) && Number.isFinite(v.durationMs) && v.durationMs > 0 && (v.startedAt === null || Number.isFinite(v.startedAt)) && Number.isFinite(v.elapsedBeforeStartMs)
}
