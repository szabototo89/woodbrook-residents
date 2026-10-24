import { List } from 'lucide-react';
import { useEffect, useState } from 'react';

type HandoffOutlineProps = { slug: string };

export function HandoffOutline(props: HandoffOutlineProps) {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
  useEffect(() => {
    setHeadings(
      Array.from(
        document.querySelectorAll<HTMLHeadingElement>('.handoff-document h2'),
      ),
    );
  }, [props.slug]);
  return (
    <nav className="handoff-outline" aria-label="On this page">
      <p>
        <List size={12} aria-hidden="true" />
        On this page
      </p>
      <div>
        {headings.map((heading, index) => (
          <button
            type="button"
            key={index}
            onClick={() => heading.scrollIntoView({ block: 'start' })}
          >
            {heading.textContent}
          </button>
        ))}
      </div>
    </nav>
  );
}
