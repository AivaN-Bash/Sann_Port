import React from 'react';
import { useLang } from '../hooks/useLang';
import { useScrollReveal } from '../hooks/useScrollReveal';
import PROJECTS_DATA from '../data/projects';
import './Projects.css';

/* safeHref — blocks javascript: and data: URIs */
function safeHref(url) {
  if (!url) return '#';
  const lower = url.trim().toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return '#';
  if (lower.startsWith('https://') || lower.startsWith('http://') || lower.startsWith('mailto:')) return url;
  return '#';
}

const BADGE_COLORS = {
  'CM広告':          '232,0,60',
  'Short Film':      '155,89,182',
  'Motion Graphics': '0,191,255',
  'Social Media':    '212,175,55',
};

function ProjectCard({ project, lang }) {
  const badgeColor = BADGE_COLORS[project.type] ?? '119,119,119';
  const hasThumbnail = Boolean(project.thumbnail);

  return (
    <article
      className="project-card card"
      style={{ '--card-accent': badgeColor, borderLeftColor: `rgb(${badgeColor})` }}
      aria-label={project.title[lang] ?? project.title.en}
    >
      {/* ── Thumbnail ── */}
      <div
        className={`project-card__thumb${hasThumbnail ? ' project-card__thumb--img' : ''}`}
        style={{ '--thumb-color': `rgb(${badgeColor})` }}
      >
        {hasThumbnail ? (
          /* Real image */
          <img
            src={project.thumbnail}
            alt={project.thumbnailAlt?.[lang] ?? project.thumbnailAlt?.en ?? project.title.en}
            className="project-card__thumb-image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* Coloured placeholder */
          <>
            <div className="project-card__thumb-bg" aria-hidden="true" />
            <span className="project-card__thumb-icon" aria-hidden="true">{project.icon ?? '🎬'}</span>
          </>
        )}
        {/* Overlay gradient so text is always readable */}
        <div className="project-card__thumb-overlay" aria-hidden="true" />
        {/* Big number watermark */}
        <span className="project-card__thumb-num" aria-hidden="true">
          {String(project.id).padStart(2, '0')}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="project-card__body">
        <span
          className="badge project-card__badge"
          style={{
            background:  `rgba(${badgeColor}, 0.15)`,
            color:       `rgb(${badgeColor})`,
            borderColor: `rgba(${badgeColor}, 0.3)`,
          }}
        >{project.type}</span>

        <h3 className="project-card__title">
          {project.title[lang] ?? project.title.en}
        </h3>

        <p className="project-card__desc">
          {project.desc[lang] ?? project.desc.en}
        </p>

        <div className="project-card__links">
          {project.vimeo && (
            <a href={safeHref(project.vimeo)}
              className="btn btn--outline project-card__link"
              target="_blank" rel="noopener noreferrer"
              aria-label={`Watch ${project.title.en} on Vimeo`}>
              <span aria-hidden="true">▶</span> Vimeo
            </a>
          )}
          {project.youtube && (
            <a href={safeHref(project.youtube)}
              className="btn btn--ghost project-card__link"
              target="_blank" rel="noopener noreferrer"
              aria-label={`Watch ${project.title.en} on YouTube`}>
              <span aria-hidden="true">▶</span> YouTube
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { t, lang }      = useLang();
  const { containerRef } = useScrollReveal({ delay: 60 });

  return (
    <section className="projects section" ref={containerRef} aria-labelledby="projects-title">
      <div className="section__header" data-reveal>
        <span className="section__number">03</span>
        <h1 className="section__title" id="projects-title">{t('projects_title')}</h1>
        <span className="section__line" aria-hidden="true" />
      </div>

      {PROJECTS_DATA.length === 0 ? (
        <p className="projects__empty">{t('projects_empty')}</p>
      ) : (
        <div className="projects__grid">
          {PROJECTS_DATA.map((project, i) => (
            <div key={project.id} data-reveal style={{ '--reveal-delay': `${i * 60}ms` }}>
              <ProjectCard project={project} lang={lang} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
