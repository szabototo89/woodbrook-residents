import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { ArtworkAvailability } from './ArtworkAvailability';

test.each(['none', undefined] as const)(
  'does not render a badge for %s',
  (status) => {
    expect(renderToStaticMarkup(<ArtworkAvailability status={status} />)).toBe(
      '',
    );
  },
);
