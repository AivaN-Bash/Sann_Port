import { useEffect, useRef, useCallback } from 'react';

const MAX_TILT  = 8;   /* degrees */
const MAX_SHINE = 0.25; /* opacity */

/**
 * useTilt
 * Attaches a RAF-throttled 3D card tilt effect to a ref element.
 * Automatically reads the card's border-color for the shine overlay.
 * Disabled on touch devices (@media hover:none).
 *
 * @returns {{ tiltRef: React.RefObject }}
 */
export function useTilt() {
  const tiltRef       = useRef(null);
  const rafRef        = useRef(null);
  const boundsRef     = useRef(null);
  const observerRef   = useRef(null);   /* ResizeObserver */
  const mutationRef   = useRef(null);   /* MutationObserver */
  const shineColorRef = useRef('255,255,255');

  /* Read accent colour from element's computed style */
  const readShineColor = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    const color = getComputedStyle(el)
      .getPropertyValue('--card-accent')
      .trim();
    if (color) shineColorRef.current = color;
  }, []);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    /* Skip on touch devices */
    if (window.matchMedia('(hover: none)').matches) return;

    /* Create shine overlay */
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    shine.setAttribute('aria-hidden', 'true');
    el.appendChild(shine);

    /* Initial bounds */
    boundsRef.current = el.getBoundingClientRect();
    readShineColor();

    /* ResizeObserver — refresh bounds when card resizes */
    observerRef.current = new ResizeObserver(() => {
      boundsRef.current = el.getBoundingClientRect();
    });
    observerRef.current.observe(el);

    /* MutationObserver — refresh colour when data-theme changes on root */
    mutationRef.current = new MutationObserver(readShineColor);
    mutationRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    function onMouseMove(e) {
      if (rafRef.current) return; /* throttle to 1 RAF per event batch */
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const bounds = boundsRef.current;
        if (!bounds) return;

        const cx  = bounds.left + bounds.width  / 2;
        const cy  = bounds.top  + bounds.height / 2;
        const dx  = (e.clientX - cx) / (bounds.width  / 2);
        const dy  = (e.clientY - cy) / (bounds.height / 2);

        const rotX = -dy * MAX_TILT;
        const rotY =  dx * MAX_TILT;

        el.style.setProperty('will-change', 'transform');
        el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

        const shineX = ((dx + 1) / 2) * 100;
        const shineY = ((dy + 1) / 2) * 100;
        const dist   = Math.hypot(dx, dy);
        const alpha  = (1 - Math.min(dist, 1)) * MAX_SHINE;

        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(${shineColorRef.current},${alpha}), transparent 70%)`;
        shine.style.opacity = '1';
      });
    }

    function onMouseLeave() {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      el.style.transform = '';
      shine.style.opacity = '0';
      /* Clear will-change after transition */
      const clearTimerRef = setTimeout(() => {
        el.style.removeProperty('will-change');
      }, 400);
      el._tiltClearRef = clearTimerRef;
    }

    function onMouseEnter() {
      boundsRef.current = el.getBoundingClientRect();
    }

    el.addEventListener('mousemove',  onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseenter', onMouseEnter);

    return () => {
      el.removeEventListener('mousemove',  onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseenter', onMouseEnter);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (mutationRef.current) {
        mutationRef.current.disconnect();
        mutationRef.current = null;
      }
      if (el._tiltClearRef) {
        clearTimeout(el._tiltClearRef);
        el._tiltClearRef = null;
      }
      if (el.contains(shine)) el.removeChild(shine);
    };
  }, [readShineColor]);

  return { tiltRef };
}
