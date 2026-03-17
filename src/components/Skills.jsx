import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SKILLS_DATA from '../data/skills';
import './Skills.css';

/* ── Animated skill bar — standalone, self-observing ── */
function SkillBar({ level, gradient, colorRgb, delay }) {
  const barRef      = useRef(null);
  const obsRef      = useRef(null);
  const timerRef    = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Reset every time props change (tab/lang switch)
    bar.classList.remove('filled');
    bar.style.setProperty('--fill-pct', '0%');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bar.style.setProperty('--fill-pct', `${level}%`);
      bar.classList.add('filled');
      return;
    }

    if (obsRef.current) obsRef.current.disconnect();

    obsRef.current = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      timerRef.current = setTimeout(() => {
        bar.style.setProperty('--fill-pct', `${level}%`);
        bar.classList.add('filled');
      }, delay ?? 0);
      obsRef.current?.unobserve(bar);
    }, { threshold: 0.3 });

    obsRef.current.observe(bar);

    return () => {
      if (obsRef.current)   { obsRef.current.disconnect(); obsRef.current = null; }
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    };
  }, [level, delay]);

  return (
    <div className="skill-bar"
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={barRef}
        className="skill-bar__fill"
        style={{ '--gradient': gradient, '--fill-pct': '0%' }}
      />
    </div>
  );
}

/* ── Skill card ── */
function SkillCard({ skill, lang }) {
  return (
    <article
      className="skill-card card"
      style={{
        '--card-accent': skill.colorRgb,
        borderLeftColor: `rgb(${skill.colorRgb})`,
      }}
      aria-label={`${skill.name[lang] ?? skill.name.en}: ${skill.level}%`}
    >
      <div className="skill-card__inner">
        <div className="skill-card__header">
          <span className="skill-card__icon" aria-hidden="true">{skill.icon}</span>
          <span className="skill-card__name">{skill.name[lang] ?? skill.name.en}</span>
          <span className="skill-card__pct" aria-hidden="true">{skill.level}%</span>
        </div>

        <SkillBar
          level={skill.level}
          gradient={skill.gradient}
          colorRgb={skill.colorRgb}
          delay={skill.delay ?? 0}
        />

        {skill.tags && (
          <div className="skill-card__tags">
            {skill.tags.map(tag => (
              <span key={tag} className="badge skill-card__tag" style={{
                background:   `rgba(${skill.colorRgb}, 0.12)`,
                color:        `rgb(${skill.colorRgb})`,
                borderColor:  `rgba(${skill.colorRgb}, 0.25)`,
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ── Skills page ── */
export default function Skills() {
  const { t, lang }       = useLang();
  const { containerRef }  = useScrollReveal({ delay: 60 });
  const [activeTab, setActiveTab] = useState('tools');

  const tools     = SKILLS_DATA.filter(s => s.category === 'tools');
  const languages = SKILLS_DATA.filter(s => s.category === 'languages');
  const displayed = activeTab === 'tools' ? tools : languages;

  return (
    <section
      className="skills section"
      ref={containerRef}
      aria-labelledby="skills-title"
    >
      <div className="section__header" data-reveal>
        <span className="section__number">02</span>
        <h1 className="section__title" id="skills-title">{t('skills_title')}</h1>
        <span className="section__line" aria-hidden="true" />
      </div>

      {/* Tabs */}
      <div className="skills__tabs" role="tablist" data-reveal>
        {['tools','languages'].map(tab => (
          <button
            key={tab}
            className={`skills__tab${activeTab === tab ? ' skills__tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'tools' ? t('skills_tab_tools') : t('skills_tab_languages')}
          </button>
        ))}
      </div>

      {/* Grid — key forces full remount on tab OR lang change so bars re-animate */}
      <div
        key={`${activeTab}-${lang}`}
        className="skills__grid"
        role="tabpanel"
      >
        {displayed.map((skill, i) => (
          <div key={skill.id} data-reveal>
            <SkillCard skill={{ ...skill, delay: i * 90 }} lang={lang} />
          </div>
        ))}
      </div>
    </section>
  );
}
