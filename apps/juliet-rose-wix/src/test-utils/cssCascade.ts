/**
 * A blanket `.root a` color rule (specificity 0,1,1) beats single-class
 * component rules such as `.primaryButton` or `.brand` (0,1,0), turning
 * booking button text and the studio brand dark. The anchor reset must
 * stay scoped to plain navigation links instead.
 *
 * happy-dom does not apply `inherit` declarations, so this invariant is
 * asserted against the stylesheet source rather than computed styles.
 */
const BLANKET_ROOT_ANCHOR_COLOR = /(^|[}\s,])\.root\s+a\s*\{[^}]*color\s*:/;

export function blanketRootAnchorColor(cssText: string): string | null {
  const match = cssText.match(BLANKET_ROOT_ANCHOR_COLOR);
  return match ? match[0].trim() : null;
}
