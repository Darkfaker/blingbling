import { tools, validateTools } from '../src/features/registry'
import { appPages } from '../src/routes'

const errors = validateTools(tools)
const pages = new Set(appPages.map((page) => `/${page}`))
for (const tool of tools) {
  if (!pages.has(tool.route)) errors.push(`Manifest route is missing from app.config.ts: ${tool.route}`)
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Validated ${tools.length} tool manifests.`)
}
