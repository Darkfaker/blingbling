export const toolIds = ['todos', 'pomodoro', 'qrcode', 'reading'] as const
export type ToolId = (typeof toolIds)[number]
export type ToolAvailability = 'ready' | 'beta' | 'disabled'

/**
 * icon 字段：视觉资源 key，对应 @/components/Icon 的 IconName。
 * 历史版本曾用 emoji；现统一为 SVG key，渲染由 Icon 组件负责。
 */
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
  { id: 'todos', title: '待办', description: '在晨光里写下今天的第一件事', icon: 'icon-todos', route: '/features/todos/pages/index', availability: 'ready', dataScope: 'private-cloud' },
  { id: 'pomodoro', title: '番茄钟', description: '和番茄一起专注的二十五分钟', icon: 'icon-pomodoro', route: '/features/pomodoro/pages/index', availability: 'ready', dataScope: 'local' },
  { id: 'qrcode', title: '二维码', description: '把文字变成一条清晰的通道', icon: 'icon-qrcode', route: '/features/qrcode/pages/index', availability: 'ready', dataScope: 'local' },
  { id: 'reading', title: '阅读', description: '黄昏时分的安静阅读时光', icon: 'icon-reading', route: '/features/reading/pages/list', availability: 'beta', dataScope: 'public-cloud' },
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

export const appPages = [
  'pages/home/index',
  'pages/settings/index',
  'features/todos/pages/index',
  'features/pomodoro/pages/index',
  'features/qrcode/pages/index',
  'features/reading/pages/list',
  'features/reading/pages/detail',
] as const
