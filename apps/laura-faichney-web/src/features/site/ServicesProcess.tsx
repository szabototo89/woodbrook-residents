import { ArrowRight, Gift, MessageCircle, Paintbrush } from 'lucide-react';
import { Eyebrow } from './Eyebrow';

const steps = [
  {
    title: 'Share Your Idea',
    copy: 'Get in touch and tell me about your project, idea or event.',
    icon: MessageCircle,
  },
  {
    title: 'Discuss the Brief',
    copy: 'We’ll chat details, explore options and agree on the best approach.',
    icon: Paintbrush,
  },
  {
    title: 'Create Something Special',
    copy: 'I’ll bring your idea to life with care, creativity and attention to detail.',
    icon: Gift,
  },
];

export function ServicesProcess() {
  return (
    <section className="services-process" aria-labelledby="process-heading">
      <div className="container">
        <div className="process-heading">
          <Eyebrow>A simple process</Eyebrow>
          <h2 id="process-heading">How It Works</h2>
        </div>
        <ol className="process-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="process-icon">
                <step.icon size={34} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3>
                {index + 1}. {step.title}
              </h3>
              <p>{step.copy}</p>
              {index < steps.length - 1 && (
                <ArrowRight
                  className="process-arrow"
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
