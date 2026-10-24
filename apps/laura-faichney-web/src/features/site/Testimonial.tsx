import { Eyebrow } from './Eyebrow';
import type { HomeData } from './lauraSanity';

type TestimonialProps = { testimonial: HomeData['testimonial'] };

export function Testimonial(props: TestimonialProps) {
  const { testimonial } = props;
  return (
    <section className="testimonial" aria-labelledby="testimonial-heading">
      <div className="container testimonial-inner">
        <div>
          <Eyebrow>Kind words</Eyebrow>
          <h2 id="testimonial-heading">What Clients Say</h2>
        </div>
        <figure className="testimonial-quote">
          <blockquote>“{testimonial.quote}”</blockquote>
          <figcaption>
            {testimonial.author} · {testimonial.role}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
