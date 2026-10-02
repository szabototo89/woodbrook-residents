import { transform } from 'lightningcss';

export function inlineStyles(stylesheets: string[]): string {
  const styles = stylesheets
    .map((stylesheet) => stylesheet.replace(/@import\s+[^;]+;/g, ''))
    .join('\n');
  return transform({
    filename: 'laura-inline.css',
    code: Buffer.from(styles),
    minify: true,
  }).code.toString();
}
