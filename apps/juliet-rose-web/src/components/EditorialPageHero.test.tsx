import { CalendarDays, CircleCheck, Sparkles } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { EditorialPageHero } from './EditorialPageHero';

test('renders an editorial page introduction from typed page content', () => {
  const markup = renderToStaticMarkup(
    <EditorialPageHero
      eyebrow="Book your visit"
      title="Request an appointment"
      description="Choose a service and tell us when suits you."
      scriptLines={['Time', 'for', 'you']}
      highlights={[
        {
          title: 'Choose a treatment',
          description: 'Compare services and prices',
          Icon: Sparkles,
        },
        {
          title: 'Pick a preferred date',
          description: 'Monday to Friday availability',
          Icon: CalendarDays,
        },
        {
          title: 'Await confirmation',
          description: 'Juliet Rose confirms with you',
          Icon: CircleCheck,
        },
      ]}
    />,
  );

  expect(markup).toContain('class="editorial-page-hero"');
  expect(markup).toContain('Book your visit');
  expect(markup).toContain('Request an appointment');
  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('lucide-calendar-days');
  expect(markup).toContain('aria-hidden="true"');
});
