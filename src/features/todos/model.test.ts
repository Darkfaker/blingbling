import { createId, createTodo, normalizeTitle, sortTodos, validateTitle } from './model'

describe('todo model', () => {
  it('normalizes whitespace', () => expect(normalizeTitle('  buy   milk ')).toBe('buy milk'))
  it('rejects blank and overlong titles', () => { expect(validateTitle(' ')).toBeTruthy(); expect(validateTitle('a'.repeat(121))).toBeTruthy() })
  it('uses stable caller-provided ids across retries', () => expect(createTodo('x', 1, 'same').id).toBe('same'))
  it('creates deterministic ids with injected values', () => expect(createId(1000, 0.5)).toBe(createId(1000, 0.5)))
  it('groups active before completed', () => {
    const done = { ...createTodo('done', 2, 'd'), completed: true }
    expect(sortTodos([done, createTodo('active', 1, 'a')]).map((x) => x.id)).toEqual(['a', 'd'])
  })
})
