export const toolIds = ['todos', 'pomodoro', 'qrcode', 'reading'] as const
export type ToolId = (typeof toolIds)[number]
export type ToolAvailability = 'ready' | 'beta' | 'disabled'

export interface ToolManifest {
  id: ToolId
  title: string
  description: string
  icon: string
  route: `/${string}`
  availability: ToolAvailability
  dataScope: 'local' | 'private-cloud' | 'public-cloud'
}

export const tools = [
  { id: 'todos', title: '待办', description: '记下并完成重要小事', icon: '✓', route: '/features/todos/pages/index', availability: 'ready', dataScope: 'private-cloud' },
  { id: 'pomodoro', title: '番茄钟', description: '专注一段完整时间', icon: '◷', route: '/features/pomodoro/pages/index', availability: 'ready', dataScope: 'local' },
  { id: 'qrcode', title: '二维码', description: '把文本变成二维码', icon: '▦', route: '/features/qrcode/pages/index', availability: 'ready', dataScope: 'local' },
  { id: 'reading', title: '阅读', description: '稍后安静读一点东西', icon: '文', route: '/features/reading/pages/list', availability: 'beta', dataScope: 'public-cloud' },
] as const satisfies readonly ToolManifest[]

export function validateTools(items: readonly ToolManifest[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const item of items) {
    if (ids.has(item.id)) errors.push(`Duplicate tool id: ${item.id}`)
    ids.add(item.id)
    if (!item.route.startsWith('/') || item.route.includes('..')) errors.push(`Invalid route: ${item.route}`)
  }
  return errors
}

export function findTool(id: string | null | undefined): ToolManifest | undefined {
  return (tools as readonly ToolManifest[]).find((tool) => tool.id === id && tool.availability !== 'disabled')
}
