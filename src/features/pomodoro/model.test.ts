import { defaultPomodoroState, pomodoroReducer, remainingMs } from './model'

describe('pomodoro model', () => {
  it('derives time from absolute timestamps', () => {
    const running = pomodoroReducer(defaultPomodoroState(60_000), { type: 'start', now: 1_000 })
    expect(remainingMs(running, 31_000)).toBe(30_000)
  })
  it('survives pause and resume', () => {
    let state = pomodoroReducer(defaultPomodoroState(60_000), { type: 'start', now: 1_000 })
    state = pomodoroReducer(state, { type: 'pause', now: 21_000 })
    expect(remainingMs(state, 999_000)).toBe(40_000)
    state = pomodoroReducer(state, { type: 'resume', now: 50_000 })
    expect(remainingMs(state, 60_000)).toBe(30_000)
  })
  it('completes only from running', () => {
    let state = pomodoroReducer(defaultPomodoroState(10_000), { type: 'start', now: 1_000 })
    state = pomodoroReducer(state, { type: 'tick', now: 20_000 })
    expect(state.status).toBe('completed')
    expect(pomodoroReducer(state, { type: 'tick', now: 30_000 })).toBe(state)
  })
  it('handles clock rollback without negative elapsed time', () => {
    const state = pomodoroReducer(defaultPomodoroState(10_000), { type: 'start', now: 5_000 })
    expect(remainingMs(state, 1_000)).toBe(10_000)
  })
  it('changes duration without starting', () => {
    const state = pomodoroReducer(defaultPomodoroState(), { type: 'setDuration', durationMs: 5_000 })
    expect(state.status).toBe('idle')
    expect(state.durationMs).toBe(5_000)
  })
})
