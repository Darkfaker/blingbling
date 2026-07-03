export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export function normalizeTitle(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function validateTitle(value: string): string | undefined {
  const title = normalizeTitle(value)
  if (!title) return '写点什么再保存'
  if (title.length > 120) return '待办最多 120 个字'
}

export function createId(now = Date.now(), random = Math.random()): string {
  return `${now.toString(36)}-${Math.floor(random * 0x100000000).toString(36).padStart(7, '0')}`
}

export function createTodo(title: string, now = Date.now(), id = createId(now)): Todo {
  const error = validateTitle(title)
  if (error) throw new Error(error)
  return { id, title: normalizeTitle(title), completed: false, createdAt: now, updatedAt: now }
}

export function sortTodos(items: readonly Todo[]): Todo[] {
  return [...items].sort((a, b) => Number(a.completed) - Number(b.completed) || b.updatedAt - a.updatedAt)
}

export function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== 'object') return false
  const v = value as Todo
  return typeof v.id === 'string' && typeof v.title === 'string' && typeof v.completed === 'boolean' && Number.isFinite(v.createdAt) && Number.isFinite(v.updatedAt)
}

export const isTodoList = (value: unknown): value is Todo[] => Array.isArray(value) && value.every(isTodo)
