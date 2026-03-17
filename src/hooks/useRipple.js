import { useRef, useCallback } from 'react';

/**
 * useRipple
 * Spawns a CSS ripple element on click or touch.
 * Each ripple removes itself via animationend, preventing DOM leak.
 *
 * @returns {{ rippleRef: React.RefObject, createRipple: function }}
 */
export function useRipple() {
  const rippleRef = useRef(null);

  const createRipple = useCallback((e) => {
    const el = rippleRef.current;
    if (!el) return;

    const bounds = el.getBoundingClientRect();

    /* Use touch or mouse coordinates */
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    const diameter = Math.max(bounds.width, bounds.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    ripple.style.cssText = `
      width: ${diameter}px;
      height: ${diameter}px;
      left: ${x - diameter / 2}px;
      top: ${y - diameter / 2}px;
    `;
    ripple.setAttribute('aria-hidden', 'true');

    /* Self-remove on animationend — no timer leak */
    function cleanup() {
      ripple.removeEventListener('animationend', cleanup);
      if (el.contains(ripple)) el.removeChild(ripple);
    }
    ripple.addEventListener('animationend', cleanup);

    el.appendChild(ripple);
  }, []);

  return { rippleRef, createRipple };
}
