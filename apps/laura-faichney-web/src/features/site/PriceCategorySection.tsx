import {
  BrickWall,
  GraduationCap,
  Palette,
  Smile,
  PanelsTopLeft,
} from 'lucide-react';
import type { PriceCategory } from '../../../../../shared/lauraPricing';
import { Arrow } from './Arrow';
import { PriceOfferRow } from './PriceOfferRow';

const icons = {
  palette: Palette,
  wall: BrickWall,
  window: PanelsTopLeft,
  smile: Smile,
  tuition: GraduationCap,
};
type PriceCategorySectionProps = {
  category: PriceCategory;
  fallbackQuote: string;
  fallbackGuidance: string;
  enquiryLabel: string;
};
export function PriceCategorySection(props: PriceCategorySectionProps) {
  const { category } = props;
  const Icon = icons[category.icon ?? 'palette'];
  return (
    <section className="price-category" aria-label={category.title}>
      <div className="price-category-heading">
        <Icon aria-hidden="true" strokeWidth={1.35} />
        <div>
          <h2>{category.title}</h2>
          {category.description && <p>{category.description}</p>}
        </div>
      </div>
      {category.offers?.length ? (
        <ul className="price-options">
          {category.offers.map((offer, index) => (
            <PriceOfferRow offer={offer} key={index} />
          ))}
        </ul>
      ) : (
        <div className="price-fallback">
          <p className="price-amount">{props.fallbackQuote}</p>
          <p>{props.fallbackGuidance}</p>
        </div>
      )}
      <a
        className="price-enquiry"
        href={
          category.serviceSlug
            ? `/contact?service=${encodeURIComponent(category.serviceSlug)}#enquiry`
            : '/contact#enquiry'
        }
        aria-label={`${props.enquiryLabel} about ${category.title}`}
      >
        {props.enquiryLabel} <Arrow />
      </a>
    </section>
  );
}
