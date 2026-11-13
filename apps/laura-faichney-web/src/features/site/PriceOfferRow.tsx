import type { PriceOffer } from '../../../../../shared/lauraPricing';

type PriceOfferRowProps = { offer: PriceOffer };
export function PriceOfferRow(props: PriceOfferRowProps) {
  const offer = props.offer;
  const money = (amount: number | undefined) =>
    new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: offer.currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount ?? 0);
  return (
    <li className="price-option">
      <div className="price-option-main">
        <div className="price-option-label">
          <span>{offer.label}</span>
          {offer.scope && <small>{offer.scope}</small>}
        </div>
        <p className="price-amount">
          {offer.mode === 'quote' ? (
            'Quote on request'
          ) : offer.mode === 'range' ? (
            <>
              <small>Guide range</small>
              {money(offer.minimum)} – {money(offer.maximum)}
            </>
          ) : (
            <>
              <small>{offer.mode === 'from' ? 'From' : 'Fixed price'}</small>
              {money(offer.amount)}
            </>
          )}
        </p>
      </div>
      {offer.inclusions && offer.inclusions.length > 0 && (
        <ul className="price-inclusions" aria-label={`${offer.label} includes`}>
          {offer.inclusions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {offer.qualifications && (
        <p className="price-qualification">{offer.qualifications}</p>
      )}
      {offer.guidance && (
        <p className="price-qualification">{offer.guidance}</p>
      )}
    </li>
  );
}
