export function createMockRule(capturedCustom: Array<Function> = []): {
  rule: object
  capturedCustom: Array<Function>
} {
  const target: Record<string, unknown> = {}
  const chain = new Proxy(target, {
    get(_target, prop) {
      if (prop === 'custom') {
        return (fn: Function) => {
          capturedCustom.push(fn)
          return chain
        }
      }
      return () => chain
    },
  })
  return {rule: chain, capturedCustom}
}

export function invokeAllValidations(fields: unknown): void {
  if (!Array.isArray(fields)) {
    return
  }
  for (const field of fields) {
    if (field !== null && typeof field === 'object' && 'validation' in field) {
      const validation: unknown = field.validation
      if (typeof validation === 'function') {
        const validationFunction: Function = validation
        const {rule} = createMockRule()
        validationFunction(rule)
      }
    }
    if (field !== null && typeof field === 'object' && 'fields' in field) {
      const nested: unknown = field.fields
      if (Array.isArray(nested)) {
        invokeAllValidations(nested)
      }
    }
    if (field !== null && typeof field === 'object' && 'of' in field) {
      const members: unknown = field.of
      if (Array.isArray(members)) {
        for (const member of members) {
          if (member !== null && typeof member === 'object' && 'fields' in member) {
            invokeAllValidations((member as {fields: unknown}).fields)
          }
        }
      }
    }
  }
}

export function preparePreview(
  prepare: unknown,
  args: Record<string, unknown>,
): {title: string; subtitle: string} {
  if (typeof prepare !== 'function') {
    throw new Error('Expected preview.prepare to be a function')
  }
  const render: Function = prepare
  const result = render(args)
  if (result === null || typeof result !== 'object') {
    throw new Error('Expected preview.prepare to return an object')
  }
  if (!('title' in result) || !('subtitle' in result)) {
    throw new Error('Expected preview result to have title and subtitle')
  }
  const title = result.title
  const subtitle = result.subtitle
  if (typeof title !== 'string' || typeof subtitle !== 'string') {
    throw new Error('Expected preview title and subtitle to be strings')
  }
  return {title, subtitle}
}
