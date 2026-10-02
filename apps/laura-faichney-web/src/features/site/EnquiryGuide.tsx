import {
  CalendarDays,
  Lightbulb,
  MapPin,
  Maximize,
  Paintbrush,
  Send,
} from 'lucide-react';

const guidance = [
  {
    title: 'Type of service',
    copy: 'e.g. painting, mural, facepainting, art tutoring, etc.',
    icon: Paintbrush,
  },
  {
    title: 'Desired size or space',
    copy: 'e.g. canvas size, wall dimensions, number of guests, etc.',
    icon: Maximize,
  },
  {
    title: 'Preferred timeframe',
    copy: 'e.g. your event date or when you’d like the artwork completed.',
    icon: CalendarDays,
  },
  {
    title: 'Location / venue',
    copy: 'e.g. the area or venue for your project or event.',
    icon: MapPin,
  },
  {
    title: 'Any inspiration or ideas',
    copy: 'Feel free to share colour preferences, inspiration or a general vision.',
    icon: Lightbulb,
  },
];

export function EnquiryGuide() {
  return (
    <aside
      className="enquiry-guide contact-panel"
      aria-labelledby="guide-heading"
    >
      <h2 id="guide-heading">What to Include</h2>
      <p>
        To help me understand your project and give you the best possible
        response, it’s helpful to include:
      </p>
      <ul>
        {guidance.map((item) => (
          <li key={item.title}>
            <span className="contact-icon">
              <item.icon size={28} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="guide-note">
        <Send size={28} strokeWidth={1.5} aria-hidden="true" /> A little detail
        helps bring your idea to life.
      </p>
    </aside>
  );
}
