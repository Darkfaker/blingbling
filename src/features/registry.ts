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
  { id: 'todos', title: '待办', description: '像樱花一样轻轻飘落的日常', icon: '🌸', route: '/features/todos/pages/index', availability: 'ready', dataScope: 'private-cloud' },
  { id: 'pomodoro', title: '番茄钟', description: '和番茄精灵一起专注吧', icon: '🍅', route: '/features/pomodoro/pages/index', availability: 'ready', dataScope: 'local' },
  { id: 'qrcode', title: '二维码', description: '把文字变成闪亮的魔法阵', icon: '✨', route: '/features/qrcode/pages/index', availability: 'ready', dataScope: 'local' },
  { id: 'reading', title: '阅读', description: '在树荫下安静地翻阅', icon: '📖', route: '/features/reading/pages/list', availability: 'beta', dataScope: 'public-cloud' },
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

