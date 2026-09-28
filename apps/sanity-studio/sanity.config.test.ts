import {expect, test} from 'vitest'

import config from './sanity.config'
import {StudioLogo} from './components/StudioLogo'
import {schemaTypes} from './schemaTypes'

class MockNode {
  titles: Array<string> = []
  ids: Array<string> = []
  filters: Array<string> = []
  children: Array<unknown> = []
  itemList: Array<unknown> = []
  schemaTypeValue?: string
  documentIdValue?: string
  documentType?: string

  title(value: string) {
    this.titles.push(value)
    return this
  }

  id(value: string) {
    this.ids.push(value)
    return this
  }

  child(value: unknown) {
    this.children.push(value)
    return this
  }

  items(value: Array<unknown>) {
    this.itemList = value
    return this
  }

  schemaType(value: string) {
    this.schemaTypeValue = value
    return this
  }

  documentId(value: string) {
    this.documentIdValue = value
    return this
  }

  filter(value: string) {
    this.filters.push(value)
    return this
  }
}

function createStructureBuilder() {
  const created: Array<MockNode> = []
  const make = () => {
    const node = new MockNode()
    created.push(node)
    return node
  }
  const documentTypeListItem = (type: string) => {
    const node = make()
    node.documentType = type
    return node
  }
  const documentTypeList = (type: string) => {
    const node = make()
    node.documentType = type
    return node
  }
  return {
    created,
    builder: {
      list: () => make(),
      listItem: () => make(),
      document: () => make(),
      documentList: () => make(),
      documentTypeListItem,
      documentTypeList,
      divider: () => make(),
    },
  }
}

function collectTitles(node: unknown, into: Array<string> = []): Array<string> {
  if (node instanceof MockNode) {
    into.push(...node.titles)
    for (const child of node.children) collectTitles(child, into)
    for (const item of node.itemList) collectTitles(item, into)
  }
  return into
}

function collectFilters(node: unknown, into: Array<string> = []): Array<string> {
  if (node instanceof MockNode) {
    into.push(...node.filters)
    for (const child of node.children) collectFilters(child, into)
    for (const item of node.itemList) collectFilters(item, into)
  }
  return into
}

function getStructure(): Function {
  const plugins: unknown = config.plugins
  if (!Array.isArray(plugins) || plugins.length === 0) {
    throw new Error('Expected studio plugins')
  }
  const first = plugins[0]
  if (first === null || typeof first !== 'object' || !('tools' in first)) {
    throw new Error('Expected structure tool')
  }
  const tools: unknown = first.tools
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error('Expected structure tools')
  }
  const tool = tools[0]
  if (tool === null || typeof tool !== 'object' || !('options' in tool)) {
    throw new Error('Expected structure options')
  }
  const options: unknown = tool.options
  if (options === null || typeof options !== 'object' || !('structure' in options)) {
    throw new Error('Expected structure function')
  }
  const structure: unknown = options.structure
  expect(typeof structure).toBe('function')
  if (typeof structure !== 'function') {
    throw new Error('Expected structure to be a function')
  }
  const structureFunction: Function = structure
  return structureFunction
}

test('studio config pins the Woodbrook project and brand', () => {
  expect(config.name).toBe('default')
  expect(config.title).toBe('Woodbrook Residents')
  expect(config.projectId).toBe('ca34quae')
  expect(config.dataset).toBe('production')
  expect(config.studio?.components?.logo).toBe(StudioLogo)
  expect(config.schema?.types).toBe(schemaTypes)
  expect(schemaTypes).toHaveLength(9)
  expect(config.plugins).toHaveLength(2)
})

test('studio desk mirrors the public site navigation', () => {
  const structure = getStructure()
  const {builder} = createStructureBuilder()
  const root = structure(builder)
  const titles = collectTitles(root)
  for (const expected of [
    'Content',
    'Updates',
    'Events',
    'Projects',
    'Consultations',
    'Directory',
    'All updates',
    'All events',
    'All projects',
    'All consultations',
    'All directory entries',
    'Site setting',
    'Issue reports (private)',
  ]) {
    expect(titles).toContain(expected)
  }
})

test('studio desk keeps editorial filtered lists and the private singleton', () => {
  const structure = getStructure()
  const {builder, created} = createStructureBuilder()
  const root = structure(builder)
  const titles = collectTitles(root)
  for (const expected of [
    'Featured updates',
    'Updates missing source data',
    'Upcoming events',
    'Past events',
    'Featured events',
    'Featured projects',
    'Projects missing source data',
    'Open consultations',
    'Featured entries',
  ]) {
    expect(titles).toContain(expected)
  }

  const filters = collectFilters(root)
  expect(filters.some((filter) => filter.includes('featured == true'))).toBe(true)
  expect(filters.some((filter) => filter.includes('startsAt >= now()'))).toBe(true)
  expect(filters.some((filter) => filter.includes('stage == "open"'))).toBe(true)

  const singleton = created.find((node) => node.schemaTypeValue === 'siteSetting')
  expect(singleton?.documentIdValue).toBe('siteSetting')
})
