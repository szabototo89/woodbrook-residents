import { CalendarDays, CircleCheck, Sparkles } from 'lucide-react';

import { EditorialPageHero } from './EditorialPageHero';

export default (
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
  />
);
