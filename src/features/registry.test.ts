import { findTool, tools, validateTools, type ToolManifest } from './registry'

describe('tool registry', () => {
  it('contains valid unique tools', () => expect(validateTools(tools)).toEqual([]))
  it('rejects duplicate ids', () => expect(validateTools([tools[0], tools[0]])).toContain('Duplicate tool id: todos'))
  it('rejects unsafe routes', () => {
    const bad = { ...tools[0], route: '/../oops' } as ToolManifest
    expect(validateTools([bad])).toContain('Invalid route: /../oops')
  })
  it('ignores unknown tools', () => expect(findTool('gone')).toBeUndefined())
})
