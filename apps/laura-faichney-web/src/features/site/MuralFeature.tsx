import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { botanical } from './siteContent';

export function MuralFeature() {
  return (
    <section className="mural-feature">
      <div className="container mural-inner">
        <div className="mural-copy">
          <Eyebrow>Transform spaces</Eyebrow>
          <h2>Murals that bring spaces to life</h2>
          <p>
            From homes and nurseries to businesses and events, a hand-painted
            mural adds colour and character to a space.
          </p>
          <a className="button button-secondary" href="/contact">
            Enquire about a mural <Arrow />
          </a>
        </div>
      </div>
      <div className="mural-art">
        <img
          src={botanical}
          alt="Large pink painted flower with green leaves"
          width="1254"
          height="1254"
          loading="lazy"
        />
      </div>
    </section>
  );
}
