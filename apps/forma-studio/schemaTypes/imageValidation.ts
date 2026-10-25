// Requiredness belongs to the parent field: guide images may be absent.
// A supplied image must have an asset; alt text is checked by its own field.
export function validateImageSelection(value: unknown): true | string {
  if (value === undefined || value === null) return true;
  if (
    typeof value === 'object' &&
    'asset' in value &&
    value.asset !== null &&
    typeof value.asset === 'object' &&
    '_ref' in value.asset &&
    typeof value.asset._ref === 'string' &&
    value.asset._ref.trim().length > 0
  )
    return true;
  return 'Choose an image or remove this optional image.';
}
