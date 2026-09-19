import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to all elements matching `selector`
 * inside `containerRef`. Adds the class `revealedClass` when they enter
 * the viewport. Supports a `data-delay` attribute (ms) for stagger.
 *
 * Usage:
 *   const containerRef = useRef(null);
 *   useScrollReveal(containerRef);
 *   // In JSX: <div ref={containerRef}><p className="reveal">...</p></div>
 */
export function useScrollReveal(
  containerRef,
  {
    selector = '.reveal, .reveal-up',
    revealedClass = 'revealed',
    threshold = 0.12,
    rootMargin = '0px 0px -40px 0px',
  } = {}
) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const elements = root.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || '0';
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add(revealedClass);
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
