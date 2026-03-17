import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_OPTIONS = {
  threshold:  0.12,
  rootMargin: '0px 0px -32px 0px',
  delay:      0,
};

/**
 * useScrollReveal — MutationObserver watches for NEW [data-reveal] elements
 * so tab-switching / language-switching always works.
 */
export function useScrollReveal(options = {}) {
  const opts        = { ...DEFAULT_OPTIONS, ...options };
  const containerRef = useRef(null);
  const observerRef  = useRef(null);   // IntersectionObserver
  const mutationRef  = useRef(null);   // MutationObserver
  const timerRef     = useRef(null);

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const revealEl = useCallback((el, delay = 0) => {
    if (prefersReduced) { el.classList.add('revealed'); return; }
    el.style.setProperty('will-change', 'transform, opacity');
    const t = setTimeout(() => {
      el.classList.add('revealed');
      const t2 = setTimeout(() => el.style.removeProperty('will-change'), 800);
      el._clearWC = t2;
    }, delay);
    el._revealTimer = t;
  }, [prefersReduced]);

  const observeAll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !observerRef.current) return;
    const els = container.querySelectorAll('[data-reveal]');
    els.forEach((el, i) => {
      if (!el._observed) {
        el._observed = true;
        observerRef.current.observe(el);
      }
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReduced) {
      container.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
      return;
    }

    // IntersectionObserver — reveals each element as it enters viewport
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const index = Array.from(container.querySelectorAll('[data-reveal]')).indexOf(el);
        revealEl(el, opts.delay + index * 70);
        observerRef.current?.unobserve(el);
      });
    }, { threshold: opts.threshold, rootMargin: opts.rootMargin });

    // Initial observation
    observeAll();

    // MutationObserver — watches for NEW elements added (tab switch, lang switch)
    mutationRef.current = new MutationObserver(() => {
      // Small delay so React finishes rendering
      timerRef.current = setTimeout(observeAll, 30);
    });
    mutationRef.current.observe(container, { childList: true, subtree: true });

    return () => {
      if (observerRef.current)  { observerRef.current.disconnect();  observerRef.current = null; }
      if (mutationRef.current)  { mutationRef.current.disconnect();  mutationRef.current = null; }
      if (timerRef.current)     { clearTimeout(timerRef.current);    timerRef.current = null; }
      // Clean up per-element timers
      container.querySelectorAll('[data-reveal]').forEach(el => {
        if (el._revealTimer) { clearTimeout(el._revealTimer); el._revealTimer = null; }
        if (el._clearWC)     { clearTimeout(el._clearWC);     el._clearWC = null; }
        el._observed = false;
      });
    };
  }, [opts.delay, opts.threshold, opts.rootMargin, observeAll, revealEl, prefersReduced]);

  return { containerRef };
}
