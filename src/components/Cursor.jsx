import React, { useEffect, useRef } from 'react';
import './Cursor.css';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const rafRef  = useRef(null);
  const posRef  = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const visibleRef = useRef(false);

  useEffect(() => {
    /* Skip on touch / no-hover devices */
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    /* ── Show cursor immediately on first mousemove ── */
    function onMouseMove(e) {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    }

    /* ── Hide when mouse leaves window ── */
    function onMouseLeave() {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
      visibleRef.current = false;
    }
    function onMouseEnter() {
      if (visibleRef.current) {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    }

    /* ── Hover state on interactive elements ── */
    function onMouseOver(e) {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        dot.classList.add('cursor--hover');
        ring.classList.add('cursor--hover');
      }
    }
    function onMouseOut(e) {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        dot.classList.remove('cursor--hover');
        ring.classList.remove('cursor--hover');
      }
    }

    /* ── RAF loop — dot: instant, ring: lerp ── */
    function lerp(a, b, t) { return a + (b - a) * t; }

    function loop() {
      const { x, y } = posRef.current;

      /* Dot snaps instantly */
      dot.style.transform = `translate(${x}px,${y}px)`;

      /* Ring lags */
      ringPos.current.x = lerp(ringPos.current.x, x, 0.11);
      ringPos.current.y = lerp(ringPos.current.y, y, 0.11);
      ring.style.transform = `translate(${ringPos.current.x}px,${ringPos.current.y}px)`;

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover',  onMouseOver);
    document.addEventListener('mouseout',   onMouseOut);

    /* Hide native cursor site-wide */
    document.documentElement.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover',  onMouseOver);
      document.removeEventListener('mouseout',   onMouseOut);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      aria-hidden="true"
      role="presentation"
      aria-roledescription="decorative cursor"
    >
      <div ref={dotRef}  className="cursor__dot"  />
      <div ref={ringRef} className="cursor__ring" />
    </div>
  );
}
