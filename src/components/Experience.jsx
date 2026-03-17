import React from 'react';
import { useLang } from '../hooks/useLang';
import { useScrollReveal } from '../hooks/useScrollReveal';
import EXPERIENCE_DATA from '../data/experience';
import './Experience.css';

function ExperienceCard({ item, lang, index }) {
  const isEven = index % 2 === 0;

  return (
    <div className={`exp-item${isEven ? ' exp-item--left' : ' exp-item--right'}`} data-reveal>
      <div className="exp-dot" aria-hidden="true">
        <span className="exp-dot__inner" />
        <span className="exp-dot__ring" />
      </div>

      <article className="exp-card card clip-diagonal-sm"
        aria-label={item.role[lang] ?? item.role.en}>

        <div className="exp-card__period">
          <span className="badge exp-card__badge">
            {item.start} — {item.current
              ? (lang === 'ja' ? '現在' : 'Present')
              : item.end}
          </span>
          {item.current && <span className="exp-card__live" aria-label="Currently working here">● LIVE</span>}
        </div>

        <h3 className="exp-card__role">{item.role[lang] ?? item.role.en}</h3>

        <div className="exp-card__company">
          <span className="exp-card__company-name">{item.company[lang] ?? item.company.en}</span>
          {item.location && (
            <span className="exp-card__location">📍 {item.location}</span>
          )}
        </div>

        <p className="exp-card__desc">{item.desc[lang] ?? item.desc.en}</p>

        {item.tags && (
          <div className="exp-card__tags">
            {item.tags.map(tag => <span key={tag} className="badge">{tag}</span>)}
          </div>
        )}

        {/* P5 decorative number */}
        <span className="exp-card__num" aria-hidden="true">
          {String(index + 1).padStart(2,'0')}
        </span>
      </article>
    </div>
  );
}

export default function Experience() {
  const { t, lang }      = useLang();
  const { containerRef } = useScrollReveal({ delay: 100 });

  return (
    <section className="experience section" ref={containerRef} aria-labelledby="experience-title">
      <div className="section__header" data-reveal>
        <span className="section__number" aria-hidden="true">04</span>
        <h1 className="section__title" id="experience-title">{t('experience_title')}</h1>
        <span className="section__line" aria-hidden="true" />
      </div>

      <div className="exp-timeline" role="list">
        <div className="exp-timeline__line" aria-hidden="true" />
        {EXPERIENCE_DATA.map((item, i) => (
          <div key={item.id} role="listitem">
            <ExperienceCard item={item} lang={lang} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
