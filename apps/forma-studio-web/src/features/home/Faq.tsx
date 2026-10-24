import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Card } from '../../components/Card';
import { faqs } from './homeContent';

export function Faq() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <Card
      variant="panel"
      padding="md"
      className="faq-card"
      id="faqs"
      aria-labelledby="faq-title"
    >
      <div className="faq-heading">
        <h2 id="faq-title">Frequently asked questions</h2>
      </div>
      {faqs.map((faq, index) => (
        <div className="faq-item" key={faq.question}>
          <h3>
            <button
              id={`faq-question-${index}`}
              type="button"
              aria-expanded={expanded === index}
              aria-controls={`faq-answer-${index}`}
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              {faq.question}
              {expanded === index ? (
                <Minus size={16} aria-hidden="true" />
              ) : (
                <Plus size={16} aria-hidden="true" />
              )}
            </button>
          </h3>

          <div
            id={`faq-answer-${index}`}
            hidden={expanded !== index}
            role="region"
            aria-labelledby={`faq-question-${index}`}
          >
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
