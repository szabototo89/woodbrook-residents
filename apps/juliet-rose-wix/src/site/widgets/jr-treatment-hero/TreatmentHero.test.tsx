import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { TreatmentHero } from './TreatmentHero';

test('treatment hero presents the treatments page introduction and benefits', () => {
  const view = renderUi(<TreatmentHero />);

  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Treatments & prices',
  );
  expect(view.container.querySelectorAll('li')).toHaveLength(3);
  expect(view.container.textContent).toContain('Relax & unwind');
  expect(view.container.textContent).toContain('Natural radiance');
  expect(view.container.textContent).toContain('A more confident you');
  view.unmount();
});

test('treatment hero honours editable headline properties', () => {
  const view = renderUi(
    <TreatmentHero
      eyebrow="Bespoke care"
      title="Choose your ritual"
      description="Treatments shaped around you."
    />,
  );

  expect(view.container.textContent).toContain('Bespoke care');
  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Choose your ritual',
  );
  expect(view.container.textContent).toContain('Treatments shaped around you.');
  view.unmount();
});
