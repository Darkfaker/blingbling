import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const id = process.argv[2]

if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error('Usage: pnpm create:tool <lowercase-id> [中文标题]')
  process.exit(1)
}
const title = process.argv.slice(3).join(' ') || id

const root = path.resolve(process.cwd(), 'src/features', id)
if (existsSync(root)) {
  console.error(`Refusing to overwrite existing tool: ${root}`)
  process.exit(1)
}

const pages = path.join(root, 'pages')
mkdirSync(pages, { recursive: true })
writeFileSync(path.join(pages, 'index.config.ts'), `export default definePageConfig({ navigationBarTitleText: ${JSON.stringify(title)} })\n`)
writeFileSync(path.join(pages, 'index.tsx'), `import { Text, View } from '@tarojs/components'\n\nexport default function ${toPascal(id)}Page() {\n  return <View className='page'><View className='card'><Text>${escapeText(title)} 已准备好</Text></View></View>\n}\n`)
writeFileSync(path.join(root, 'model.ts'), `export interface ${toPascal(id)}State { schemaVersion: 1 }\n`)
writeFileSync(path.join(root, 'model.test.ts'), `import type { ${toPascal(id)}State } from './model'\n\ndescribe('${id} model', () => {\n  it('starts at schema version 1', () => {\n    const state: ${toPascal(id)}State = { schemaVersion: 1 }\n    expect(state.schemaVersion).toBe(1)\n  })\n})\n`)

console.log(`Created ${path.relative(process.cwd(), root)}`)
console.log(`Next: add /features/${id}/pages/index to src/routes.ts and a typed manifest to src/features/registry.ts, then run pnpm check.`)

function toPascal(value: string): string {
  return value.split('-').map((part) => part[0]!.toUpperCase() + part.slice(1)).join('')
}

function escapeText(value: string): string {
  return value.replace(/[<>{}]/g, '')
}
