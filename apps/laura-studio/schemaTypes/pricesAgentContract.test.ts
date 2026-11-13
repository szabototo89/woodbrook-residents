import {expect, test} from 'vitest'
import {pricesPage} from './pricesPage'
import {priceCategoryError, priceOfferError} from '../../../shared/lauraPricing'

// This reader sees only JSON-serializable schema metadata, as a Sanity agent does.
function discoveredContract() {
  const schema = JSON.parse(JSON.stringify(pricesPage))
  expect(schema.description).toContain('options.agentEditingContract')
  expect(schema.options.agentEditingContract).toEqual(expect.any(String))
  return JSON.parse(schema.options.agentEditingContract)
}

test('schema discovery exposes identity, editing safety, full field rules and publication limits', () => {
  const contract = discoveredContract()
  expect(contract.document).toMatchObject({
    projectId: 'uag6kepo',
    dataset: 'production',
    type: 'pricesPage',
    publishedId: 'pricesPage',
    draftId: 'drafts.pricesPage',
  })
  expect(contract.currentRelease).toContain('quote-only')
  expect(contract.editing.join(' ')).toMatch(/revision/i)
  expect(contract.editing.join(' ')).toContain('_key')
  expect(contract.publishing.join(' ')).toContain('rebuild')
  expect(contract.publishing.join(' ')).toContain('unverified')
  expect(contract.categoryRules.join(' ')).toMatch(/empty.*invalid/i)
  expect(contract.categoryRules.join(' ')).toContain('published service')
  expect(contract.requiredText).toContain('introduction')
  expect(contract.seoRequiredText).toEqual(['title', 'description'])
})

test('all discoverable examples pass the real pricing validator', () => {
  const contract = discoveredContract()
  expect(Object.keys(contract.modes)).toEqual(['fixed', 'from', 'range', 'quote'])
  const modes: Record<
    string,
    {required: string[]; unset: string[]; example: Record<string, unknown>}
  > = contract.modes
  for (const [mode, definition] of Object.entries(modes)) {
    expect(definition.example.mode).toBe(mode)
    expect(definition.example._type).toBe('priceOffer')
    expect(definition.example._key).toEqual(expect.any(String))
    expect(priceOfferError(definition.example)).toBeUndefined()
    expect(
      priceCategoryError({title: 'Illustrative example', offers: [definition.example]}),
    ).toBeUndefined()
    for (const field of definition.required) {
      const incomplete = {...definition.example}
      delete incomplete[field]
      expect(priceOfferError(incomplete), `${mode} requires ${field}`).toBeDefined()
    }
    for (const field of definition.unset) {
      expect(
        priceOfferError({
          ...definition.example,
          [field]: field === 'currency' ? 'EUR' : field === 'scope' ? 'per session' : 100,
        }),
        `${mode} rejects ${field}`,
      ).toBeDefined()
    }
  }
})

test('exported mode instructions explicitly describe amounts, ordered ranges and quote-only exclusions', () => {
  const contract = discoveredContract()
  expect(contract.numericRules.join(' ')).toMatch(/positive.*finite/i)
  expect(contract.numericRules.join(' ')).toContain('maximum > minimum')
  expect(contract.modes.quote.unset).toEqual(['amount', 'minimum', 'maximum', 'currency', 'scope'])
  expect(contract.modes.range.unset).toEqual(['amount'])
  expect(contract.modes.fixed.unset).toEqual(['minimum', 'maximum'])
})

test('every Prices field has discoverable plain-language help', () => {
  function inspect(fields: unknown) {
    if (!Array.isArray(fields)) return
    for (const field of fields) {
      expect(field.description, field.name).toEqual(expect.any(String))
      expect(field.description.trim().length, field.name).toBeGreaterThan(10)
      inspect(field.fields)
      for (const member of field.of ?? []) inspect(member.fields)
    }
  }
  inspect(JSON.parse(JSON.stringify(pricesPage)).fields)
})

test('discovered currency choices all satisfy the real validator', () => {
  const contract = discoveredContract()
  expect(contract.currencyCodes).toContain('EUR')
  for (const currency of contract.currencyCodes) {
    expect(priceOfferError({...contract.modes.fixed.example, currency}), currency).toBeUndefined()
  }
})
