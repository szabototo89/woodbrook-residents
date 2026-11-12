/** The same publishing rules run in Laura Studio and the website build. */
export type PriceOffer = {
  label: string;
  mode: 'fixed' | 'from' | 'range' | 'quote';
  amount?: number;
  minimum?: number;
  maximum?: number;
  currency?: string;
  scope?: string;
  inclusions?: string[];
  qualifications?: string;
  guidance?: string;
};
export const PRICE_ICONS = [
  'palette',
  'wall',
  'window',
  'smile',
  'tuition',
] as const;
export type PriceCategory = {
  title: string;
  description?: string;
  icon?: (typeof PRICE_ICONS)[number];
  serviceSlug?: string;
  offers?: PriceOffer[];
};
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
export function priceOfferError(value: unknown): string | undefined {
  if (!record(value)) return 'Enter a price option.';
  if (!text(value.label)) return 'label: Enter an option name.';
  if (!['fixed', 'from', 'range', 'quote'].includes(String(value.mode)))
    return 'mode: Choose fixed, from, range or quote.';
  if (
    value.inclusions != null &&
    (!Array.isArray(value.inclusions) || !value.inclusions.every(text))
  )
    return 'inclusions: Use non-empty text entries.';
  const invalidText = ['qualifications', 'guidance'].find(
    (field) => value[field] != null && typeof value[field] !== 'string',
  );
  if (invalidText) return `${invalidText}: Use text.`;
  if (value.mode === 'quote') {
    if (!text(value.guidance))
      return 'guidance: Explain what is needed for a quote.';
    if (
      ['amount', 'minimum', 'maximum', 'currency', 'scope'].some(
        (field) => value[field] != null && value[field] !== '',
      )
    )
      return 'Quote options cannot contain numeric prices, currency or scope. Clear unused fields.';
    return undefined;
  }
  if (!text(value.scope))
    return 'scope: Explain the size, duration or unit covered.';
  if (
    !text(value.currency) ||
    !Intl.supportedValuesOf('currency').includes(value.currency)
  )
    return 'currency: Enter a valid ISO currency code, for example EUR.';
  if (value.mode === 'range') {
    if (
      !positive(value.minimum) ||
      !positive(value.maximum) ||
      value.maximum <= value.minimum
    )
      return 'minimum/maximum: Enter positive bounds with maximum greater than minimum.';
    if (value.amount != null)
      return 'amount: Clear the fixed amount when using a range.';
  } else {
    if (!positive(value.amount))
      return 'amount: Enter a positive finite price.';
    if (value.minimum != null || value.maximum != null)
      return 'minimum/maximum: Clear range bounds for a fixed or starting price.';
  }
  return undefined;
}
export function priceCategoryError(value: unknown): string | undefined {
  if (!record(value) || !text(value.title))
    return 'title: Enter a pricing category name.';
  if (value.icon != null && !PRICE_ICONS.some((icon) => icon === value.icon))
    return 'icon: Choose a supported symbol.';
  if (value.description != null && typeof value.description !== 'string')
    return 'description: Use text.';
  if (value.offers == null) return undefined;
  if (!Array.isArray(value.offers) || value.offers.length === 0)
    return 'offers: Add at least one price option, or remove the list to show quote guidance.';
  return value.offers
    .map((offer, index) => {
      const error = priceOfferError(offer);
      return error ? `offers.${index}.${error}` : undefined;
    })
    .find(Boolean);
}
