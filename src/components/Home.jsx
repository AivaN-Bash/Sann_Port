import React, { useMemo, memo } from 'react';
import { useRouter } from '../hooks/useRouter';
import { useLang } from '../hooks/useLang';
import { useTyping } from '../hooks/useTyping';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useRipple } from '../hooks/useRipple';
import './Home.css';

const CURRENT_YEAR = new Date().getFullYear();

const FLOAT_CHARS = ['映','動','創','編','夢','光','影','色','音','瞬','幻','術'];

const STAT_BARS = [
  { key: 'stat_creativity',   value: 95, color: 'var(--accent)'  },
  { key: 'stat_precision',    value: 88, color: 'var(--gold)'    },
  { key: 'stat_storytelling', value: 92, color: 'var(--purple)'  },
];

/* Floating chars — memoised so they never re-render */
const FloatChars = memo(function FloatChars() {
  return (
    <div className="home__float-chars" aria-hidden="true">
      {FLOAT_CHARS.map((ch, i) => (
        <span key={ch} className="home__float-char"
          style={{ '--i': i, '--total': FLOAT_CHARS.length }}>
          {ch}
        </span>
      ))}
    </div>
  );
});

export default function Home() {
  const { navigate }              = useRouter();
  const { t, lang }               = useLang();
  const { containerRef }          = useScrollReveal({ delay: 80 });
  const { rippleRef, createRipple } = useRipple();

  const phrases = useMemo(() =>
    lang === 'ja'
      ? ['ビデオエディター', 'モーションデザイナー', '日本語学習中']
      : ['Video Editor', 'Motion Designer', 'Studying Japanese'],
  [lang]);

  const { text: typedText } = useTyping(phrases, { speed: 75, pause: 2200 });

  return (
    <div className="home" ref={containerRef}>
      <FloatChars />

      {/* ── Hero ── */}
      <section className="home__hero" aria-label="Hero introduction">
        <div className="home__hero-inner">

          <div className="home__label" aria-hidden="true">
            <span className="home__label-line" />
            <span className="home__label-text">— PORTFOLIO {CURRENT_YEAR}</span>
          </div>

          <h1 className="home__name">
            <span className="home__name-first">SAAN</span>
            <span className="home__name-last">NIZE</span>
          </h1>

          <div className="home__role" aria-live="polite" aria-atomic="true">
            <span className="home__role-prefix" aria-hidden="true">&gt;&nbsp;</span>
            <span>{typedText}</span>
            <span className="home__role-cursor" aria-hidden="true">█</span>
          </div>

          <p className="home__subtitle">{t('hero_cta_sub')}</p>

          <div className="home__ctas">
            <button
              className="btn btn--primary home__cta-main"
              ref={rippleRef}
              onMouseDown={createRipple}
              onTouchStart={createRipple}
              onClick={() => navigate('projects')}
              aria-label={t('hero_cta')}
            >
              <span aria-hidden="true">▶</span>
              {t('hero_cta')}
            </button>
            <button className="btn btn--outline" onClick={() => navigate('contact')}>
              {t('nav_contact')}
            </button>
          </div>
        </div>

        {/* P5 stat bars */}
        <aside className="home__stats" aria-label="Skills overview">
          <div className="home__stats-label" aria-hidden="true">// STATS</div>
          {STAT_BARS.map(({ key, value, color }) => (
            <div key={key} className="home__stat">
              <div className="home__stat-header">
                <span className="home__stat-name">{t(key)}</span>
                <span className="home__stat-value" aria-label={`${value} percent`}>{value}</span>
              </div>
              <div className="home__stat-track"
                role="progressbar" aria-valuenow={value}
                aria-valuemin={0} aria-valuemax={100} aria-label={t(key)}>
                <div className="home__stat-fill"
                  style={{ '--stat-pct': `${value}%`, '--stat-color': color }} />
              </div>
            </div>
          ))}
        </aside>
      </section>

      {/* ── About ── */}
      <section className="home__about section" aria-labelledby="about-title">
        <div className="section__header">
          <span className="section__number" aria-hidden="true">01</span>
          <h2 className="section__title" id="about-title">{t('about_title')}</h2>
          <span className="section__line" aria-hidden="true" />
        </div>

        <div className="home__about-grid">
          <div className="home__about-text" data-reveal>
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>

            {/* Decorative skill pills */}
            <div className="home__skill-pills" aria-hidden="true">
              {['After Effects','Premiere Pro','DaVinci','Blender','日本語学習中'].map(s => (
                <span key={s} className="home__skill-pill">{s}</span>
              ))}
            </div>
          </div>

          <div className="home__about-card card clip-diagonal" data-reveal data-reveal-dir="right">
            <div className="home__about-card-inner">
              {[
                { big:'3+',  label: lang==='ja' ? '年間の経験' : 'Years Experience' },
                { big:'50+', label: lang==='ja' ? '完成プロジェクト' : 'Projects Done' },
                { big:'🇯🇵',  label: lang==='ja' ? '日本就職活動中' : 'Japan-bound' },
              ].map(({ big, label }) => (
                <div key={label} className="home__about-stat">
                  <span className="home__about-big">{big}</span>
                  <span className="home__about-label">{label}</span>
                </div>
              ))}
            </div>
            {/* Card decorative corner */}
            <span className="home__card-corner" aria-hidden="true">SN</span>
          </div>
        </div>
      </section>
    </div>
  );
}
