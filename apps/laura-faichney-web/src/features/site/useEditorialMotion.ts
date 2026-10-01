import { useEffect, useRef } from 'react';

export function useEditorialMotion() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (!section || preference.matches || !window.IntersectionObserver) return;

    const targets = Array.from(
      section.querySelectorAll<HTMLElement>('[data-motion]'),
    );
    const reveal = (target: HTMLElement) => {
      target.setAttribute('data-motion-state', 'revealed');
      observer.unobserve(target);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.22,
          )
          .map((entry) => {
            if (entry.target instanceof HTMLElement) reveal(entry.target);
          });
      },
      { threshold: 0.22 },
    );

    targets.map((target) => {
      target.setAttribute('data-motion-state', 'pending');
      observer.observe(target);
    });

    // Keyboard users never have to wait for a hidden action to reveal.
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-motion]');
      if (target) {
        target.setAttribute('data-motion-state', 'settled');
        observer.unobserve(target);
      }
    };
    const showEverything = () => {
      if (!preference.matches) return;
      observer.disconnect();
      targets.map((target) => {
        target.setAttribute('data-motion-state', 'settled');
      });
    };
    section.addEventListener('focusin', revealFocused);
    preference.addEventListener('change', showEverything);
    return () => {
      observer.disconnect();
      section.removeEventListener('focusin', revealFocused);
      preference.removeEventListener('change', showEverything);
    };
  }, []);

  return root;
}
