import calendar from '../assets/icons/calendar.png';
import clock from '../assets/icons/clock.png';
import community from '../assets/icons/community.png';
import council from '../assets/icons/council.png';
import health from '../assets/icons/health.png';
import home from '../assets/icons/home.png';
import info from '../assets/icons/info.png';
import more from '../assets/icons/more.png';
import news from '../assets/icons/news.png';
import parks from '../assets/icons/parks.png';
import pin from '../assets/icons/pin.png';
import search from '../assets/icons/search.png';
import transport from '../assets/icons/transport.png';

const icons = {
  calendar,
  clock,
  community,
  council,
  health,
  home,
  info,
  more,
  news,
  parks,
  pin,
  search,
  transport,
};
export type IconName = keyof typeof icons;

type Props = { name: IconName };

/** Bundled line artwork keeps decorative icons independent of host fonts. */
export function LineIcon(props: Props) {
  return (
    <image
      className="line-icon"
      src={icons[props.name]}
      mode="aspectFit"
      accessibility-element={false}
    />
  );
}
