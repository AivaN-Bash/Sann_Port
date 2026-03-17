import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from '../hooks/useRouter';
import { useTheme, THEMES } from '../hooks/useTheme';
import { useLang } from '../hooks/useLang';
import './Nav.css';

const NAV_PAGES = ['home', 'skills', 'projects', 'experience', 'contact'];
const NAV_KEYS  = ['nav_home', 'nav_skills', 'nav_projects', 'nav_experience', 'nav_contact'];
const THEME_ICONS = { phantom:'🔴', velvet:'🟣', monochrome:'⚪', sakura:'🌸' };

export default function Nav() {
  const { page, navigate }               = useRouter();
  const { theme, setTheme, themeLabels } = useTheme();
  const { lang, setLang, t }             = useLang();

  const [menuOpen,  setMenuOpen]  = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  const themeMenuRef = useRef(null);

  /* Pre-computed nav handlers */
  const navHandlers = useMemo(() => NAV_PAGES.reduce((acc, p) => {
    acc[p] = () => { navigate(p); setMenuOpen(false); };
    return acc;
  }, {}), [navigate]);

  /* Scroll */
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.classList.toggle('scroll-locked', menuOpen);
    return () => document.body.classList.remove('scroll-locked');
  }, [menuOpen]);

  /* Close theme picker on outside click */
  useEffect(() => {
    if (!themeOpen) return;
    function handler(e) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target))
        setThemeOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [themeOpen]);

  /* Escape key */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setMenuOpen(false); setThemeOpen(false); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ja' : 'en');
  }, [lang, setLang]);

  return (
    <>
      {/* ── Nav bar ── */}
      <header
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        role="banner"
      >
        <nav className="nav__inner" aria-label="Main navigation">

          {/* Logo */}
          <button className="nav__logo" onClick={navHandlers.home} aria-label="Go to homepage">
            <span className="nav__logo-text">SN</span>
            <span className="nav__logo-dot" aria-hidden="true" />
          </button>

          {/* Desktop links */}
          <ul className="nav__links" role="list">
            {NAV_PAGES.map((p, i) => (
              <li key={p}>
                <button
                  className={`nav__link${page === p ? ' nav__link--active' : ''}`}
                  onClick={navHandlers[p]}
                  aria-current={page === p ? 'page' : undefined}
                >
                  <span className="nav__link-num" aria-hidden="true">0{i+1}</span>
                  <span className="nav__link-label">{t(NAV_KEYS[i])}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div className="nav__controls">

            {/* Lang */}
            <button
              className="nav__lang-btn"
              onClick={toggleLang}
              aria-label={t('aria_lang')}
              aria-pressed={lang === 'ja'}
            >
              <span className={lang === 'en' ? 'nav__lang-opt--active' : ''}>EN</span>
              <span className="nav__lang-sep" aria-hidden="true">/</span>
              <span className={lang === 'ja' ? 'nav__lang-opt--active' : ''}>日本語</span>
            </button>

            {/* Theme */}
            <div className="nav__theme-wrap" ref={themeMenuRef}>
              <button
                className="nav__theme-btn"
                onClick={() => setThemeOpen(o => !o)}
                aria-label={t('aria_theme')}
                aria-expanded={themeOpen}
                aria-haspopup="listbox"
              >
                <span aria-hidden="true">{THEME_ICONS[theme]}</span>
              </button>
              {themeOpen && (
                <ul className="nav__theme-menu" role="listbox" aria-label="Select theme">
                  {THEMES.map(th => (
                    <li key={th} role="option" aria-selected={theme === th}>
                      <button
                        className={`nav__theme-option${theme === th ? ' nav__theme-option--active' : ''}`}
                        onClick={() => { setTheme(th); setThemeOpen(false); }}
                      >
                        <span aria-hidden="true">{THEME_ICONS[th]}</span>
                        <span>{themeLabels[th]?.[lang] ?? themeLabels[th]?.en}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Burger */}
            <button
              className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? t('aria_menu_close') : t('aria_menu_open')}
              aria-expanded={menuOpen}
              aria-controls="fullscreen-menu"
            >
              <span className="nav__burger-line" aria-hidden="true" />
              <span className="nav__burger-line" aria-hidden="true" />
              <span className="nav__burger-line" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Full-screen menu — rendered at top level, no z-index parent trap ── */}
      <div
        id="fullscreen-menu"
        className={`fs-menu${menuOpen ? ' fs-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {/* P5 diagonal slash accent */}
        <div className="fs-menu__slash" aria-hidden="true" />
        <div className="fs-menu__slash fs-menu__slash--2" aria-hidden="true" />

        {/* Close button */}
        <button
          className="fs-menu__close"
          onClick={() => setMenuOpen(false)}
          aria-label={t('aria_menu_close')}
          tabIndex={menuOpen ? 0 : -1}
        >
          ✕
        </button>

        {/* Logo watermark */}
        <span className="fs-menu__watermark" aria-hidden="true">SN</span>

        {/* Links */}
        <nav className="fs-menu__nav" aria-label="Full screen navigation">
          <ul role="list">
            {NAV_PAGES.map((p, i) => (
              <li key={p} className="fs-menu__item">
                <button
                  className={`fs-menu__link${page === p ? ' fs-menu__link--active' : ''}`}
                  onClick={navHandlers[p]}
                  aria-current={page === p ? 'page' : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                  style={{ '--i': i }}
                >
                  <span className="fs-menu__num" aria-hidden="true">0{i+1}</span>
                  <span className="fs-menu__label">{t(NAV_KEYS[i])}</span>
                  {page === p && <span className="fs-menu__active-dot" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom bar */}
        <div className="fs-menu__bottom">
          <button
            className="fs-menu__lang"
            onClick={toggleLang}
            aria-label={t('aria_lang')}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
            <span className="fs-menu__lang-sep">/</span>
            <span className={lang === 'ja' ? 'active' : ''}>日本語</span>
          </button>
          <span className="fs-menu__tagline" aria-hidden="true">
            {lang === 'ja' ? '東京を目指して' : 'Japan-bound →'}
          </span>
        </div>
      </div>
    </>
  );
}
