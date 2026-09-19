import cormorantGaramondUrl from '@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2?url';
import dmSansUrl from '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url';
import dayPickerStyles from 'react-day-picker/style.css?raw';

import pageStyles from '../styles.css?raw';

const fontStyles = `
@font-face {
  font-family: 'Cormorant Garamond Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 300 700;
  src: url('${cormorantGaramondUrl}') format('woff2-variations');
}

@font-face {
  font-family: 'DM Sans Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 1000;
  src: url('${dmSansUrl}') format('woff2-variations');
}
`;

export const appStyles = `${fontStyles}\n${dayPickerStyles}\n${pageStyles}`;
