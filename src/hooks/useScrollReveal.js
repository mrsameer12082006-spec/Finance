import { useEffect } from 'react';

/**
 * Hook to trigger scroll entrance reveals for elements marked with .reveal-on-scroll
 * using an IntersectionObserver with cubic-bezier(.16, 1, .3, 1) transitions.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
