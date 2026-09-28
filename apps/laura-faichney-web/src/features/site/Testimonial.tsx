import { Eyebrow } from './Eyebrow';

export function Testimonial() {
  return (
    <section className="testimonial" aria-labelledby="testimonial-heading">
      <div className="container testimonial-inner">
        <div>
          <Eyebrow>Kind words</Eyebrow>
          <h2 id="testimonial-heading">What Clients Say</h2>
        </div>
        <figure className="testimonial-quote">
          <blockquote>
            “Laura created a stunning mural for our nursery. It has completely
            transformed the space and the children absolutely love it!”
          </blockquote>
          <figcaption>Sarah O’Connor · Nursery owner</figcaption>
        </figure>
      </div>
    </section>
  );
}
