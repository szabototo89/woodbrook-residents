import {expect, test} from 'vitest'

import {StudioLogo} from './StudioLogo'

function flattenText(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (node !== null && typeof node === 'object' && 'props' in node) {
    const holder: {props?: unknown} = node
    if (holder.props !== null && typeof holder.props === 'object' && 'children' in holder.props) {
      const childrenHolder: {children?: unknown} = holder.props
      return flattenText(childrenHolder.children)
    }
    return ''
  }
  return ''
}

test('studio logo renders the Woodbrook brand mark', () => {
  const element = StudioLogo()
  expect(element.type).toBe('span')
  expect(flattenText(element)).toContain('W')
  expect(flattenText(element)).toContain('Woodbrook Residents')
})
