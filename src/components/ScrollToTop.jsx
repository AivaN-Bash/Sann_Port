import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { useRipple } from '../hooks/useRipple';
import './ScrollToTop.css';

const SHOW_THRESHOLD = 400;

export default function ScrollToTop() {
  const { t }                      = useLang();
  const { rippleRef, createRipple } = useRipple();

  const [visible, setVisible]      = useState(false);
  const prevVisibleRef             = useRef(false);

  /* Passive scroll — only setState when value actually changes */
  useEffect(() => {
    function handleScroll() {
      const shouldShow = window.scrollY > SHOW_THRESHOLD;
      if (shouldShow !== prevVisibleRef.current) {
        prevVisibleRef.current = shouldShow;
        setVisible(shouldShow);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      className={`scroll-top${visible ? ' scroll-top--visible' : ''}`}
      onClick={scrollToTop}
      onMouseDown={createRipple}
      onTouchStart={createRipple}
      ref={rippleRef}
      aria-label={t('aria_scroll_top')}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="scroll-top__icon" aria-hidden="true">↑</span>
    </button>
  );
}
