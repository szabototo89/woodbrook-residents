import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../app/siteMetadata';
import { GiftCardPage } from '../features/gift-cards/GiftCardPage';

const description =
  'Give a Juliet Rose Beauty Studio eGift card for beauty treatments in Stillorgan, Dublin.';

export const Route = createFileRoute('/gift-cards')({
  head: () =>
    createPageHead({ title: 'Gift Cards', description, path: '/gift-cards' }),
  component: GiftCardPage,
});
