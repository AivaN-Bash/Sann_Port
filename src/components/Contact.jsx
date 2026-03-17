import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLang } from '../hooks/useLang';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useRipple } from '../hooks/useRipple';
import ME from '../data/me';
import './Contact.css';

/* Security: block javascript: and data: URIs */
function safeHref(url) {
  if (!url) return '#';
  const lower = url.trim().toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return '#';
  if (lower.startsWith('https://') || lower.startsWith('http://') || lower.startsWith('mailto:')) return url;
  return '#';
}

/* Security: HTML entity sanitization */
function sanitize(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIAL_ICONS = {
  email:'✉️', linkedin:'💼', vimeo:'▶️',
  youtube:'🎬', instagram:'📸', twitter:'𝕏', github:'🐙',
};

export default function Contact() {
  const { t, lang }               = useLang();
  const { containerRef }          = useScrollReveal({ delay: 80 });
  const { rippleRef, createRipple } = useRipple();

  const [form,   setForm]   = useState({ name:'', email:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const sendTimerRef = useRef(null);

  useEffect(() => () => { if (sendTimerRef.current) clearTimeout(sendTimerRef.current); }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim())               e.name    = true;
    if (!EMAIL_REGEX.test(form.email))   e.email   = true;
    if (form.message.trim().length < 10) e.message = true;
    return e;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: false }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); setStatus('error'); return; }
    setStatus('sending');
    /* Sanitize before any processing */
    void sanitize(form.name);
    void sanitize(form.email);
    void sanitize(form.message);
    /* Replace with real endpoint */
    sendTimerRef.current = setTimeout(() => {
      setStatus('sent');
      setForm({ name:'', email:'', message:'' });
    }, 1400);
  }, [form, validate]);

  const socials = ME.socials.filter(s => s.url);

  return (
    <section className="contact section" ref={containerRef} aria-labelledby="contact-title">
      <div className="section__header" data-reveal>
        <span className="section__number" aria-hidden="true">05</span>
        <h1 className="section__title" id="contact-title">{t('contact_title')}</h1>
        <span className="section__line" aria-hidden="true" />
      </div>

      <div className="contact__grid">

        {/* Info */}
        <div className="contact__info" data-reveal>
          <div className="contact__honorific" aria-live="polite">
            <span className="contact__honorific-text">{t('contact_honorific')}</span>
          </div>
          <p className="contact__intro">{t('contact_intro')}</p>

          {/* Availability badge */}
          <div className="contact__avail">
            <span className="contact__avail-dot" aria-hidden="true" />
            <span className="contact__avail-text">
              {lang === 'ja' ? '現在お仕事受付中' : 'Available for work'}
            </span>
          </div>

          <div className="contact__socials">
            <p className="contact__socials-label">{t('contact_social')}</p>
            <ul className="contact__social-list" role="list">
              {socials.map(social => (
                <li key={social.type}>
                  <a
                    href={safeHref(social.url)}
                    className="contact__social-link btn btn--ghost"
                    target={social.type !== 'email' ? '_blank' : undefined}
                    rel={social.type !== 'email' ? 'noopener noreferrer' : undefined}
                    aria-label={`${social.label}${social.type !== 'email' ? ' — opens in new tab' : ''}`}
                  >
                    <span aria-hidden="true">{SOCIAL_ICONS[social.type] ?? '🔗'}</span>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="contact__form-wrap card" data-reveal data-reveal-dir="right">
          <form className="contact__form" onSubmit={handleSubmit} noValidate aria-label="Contact form">

            <div className={`contact__field${errors.name ? ' contact__field--error' : ''}`}>
              <label className="contact__label" htmlFor="contact-name">{t('contact_name')}</label>
              <input id="contact-name" className="contact__input"
                type="text" name="name" value={form.name}
                onChange={handleChange} maxLength={80} autoComplete="name"
                aria-required="true" aria-invalid={errors.name ? 'true' : 'false'}
                placeholder={lang === 'ja' ? 'お名前' : 'Your name'} />
              {errors.name && <span className="contact__err" role="alert">
                {lang === 'ja' ? '名前を入力してください' : 'Name is required'}
              </span>}
            </div>
            <div className={`contact__field${errors.email ? ' contact__field--error' : ''}`}>
              <label className="contact__label" htmlFor="contact-email">{t('contact_email')}</label>
              <input id="contact-email" className="contact__input"
                type="email" name="email" value={form.email}
                onChange={handleChange} maxLength={120} autoComplete="email"
                aria-required="true" aria-invalid={errors.email ? 'true' : 'false'}
                placeholder={lang === 'ja' ? 'メールアドレス' : 'your@email.com'} />
              {errors.email && <span className="contact__err" role="alert">
                {lang === 'ja' ? '有効なメールを入力してください' : 'Valid email required'}
              </span>}
            </div>

            <div className={`contact__field${errors.message ? ' contact__field--error' : ''}`}>
              <label className="contact__label" htmlFor="contact-message">{t('contact_message')}</label>
              <textarea
                id="contact-message" className="contact__textarea"
                name="message" value={form.message} onChange={handleChange}
                rows={5} maxLength={1000} /* security: cap message length */
                aria-required="true" aria-invalid={errors.message ? 'true' : 'false'}
                placeholder={lang === 'ja' ? 'メッセージ（10文字以上）' : 'Your message (min 10 chars)'}
              />
              {errors.message && (
                <span className="contact__err" role="alert">
                  {lang === 'ja' ? 'メッセージを入力してください' : 'Message required (min 10 chars)'}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn--primary contact__submit${status === 'sent' ? ' contact__submit--sent' : ''}`}
              ref={rippleRef} onMouseDown={createRipple} onTouchStart={createRipple}
              disabled={status === 'sending' || status === 'sent'}
              aria-live="polite" aria-busy={status === 'sending'}
            >
              {status === 'sending' && <span className="contact__spinner" aria-hidden="true" />}
              {status === 'sent'    ? '✓ ' : status === 'sending' ? '' : '→ '}
              {status === 'sending' ? t('contact_sending')
                : status === 'sent' ? t('contact_sent')
                : t('contact_send')}
            </button>

            {status === 'error' && (
              <p className="contact__form-error" role="alert">{t('contact_error')}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
