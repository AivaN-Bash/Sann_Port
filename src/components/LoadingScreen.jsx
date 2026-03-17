import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

let hasShown = false;

export default function LoadingScreen({ children }) {
  const [phase, setPhase] = useState(hasShown ? 'done' : 'loading');
  // phases: loading → exit → done
  const t1 = useRef(null);
  const t2 = useRef(null);

  useEffect(() => {
    if (hasShown) return;
    // Bar fills in 0.55s via CSS, then we exit at 600ms
    t1.current = setTimeout(() => setPhase('exit'), 600);
    t2.current = setTimeout(() => { setPhase('done'); hasShown = true; }, 950);
    return () => { clearTimeout(t1.current); clearTimeout(t2.current); };
  }, []);

  if (phase === 'done') return <>{children}</>;

  return (
    <>
      <div className="ls-site-wrap">{children}</div>

      <div className={`ls ls--${phase}`} role="status" aria-label="Loading" aria-live="polite">
        {/* Top progress bar — NProgress style */}
        <div className="ls__topbar" aria-hidden="true">
          <div className="ls__topbar-fill" />
          <div className="ls__topbar-glow" />
        </div>

        {/* Center card */}
        <div className="ls__card">
          {/* P5 diagonal slash */}
          <div className="ls__slash" aria-hidden="true" />

          <div className="ls__content">
            <div className="ls__logo-row">
              <span className="ls__sn">SN</span>
              <div className="ls__divider" aria-hidden="true" />
              <div className="ls__title-col">
                <span className="ls__name">SAAN NIZE</span>
                <span className="ls__role">VIDEO EDITOR · MOTION DESIGNER</span>
              </div>
            </div>

            {/* Bottom bar + percent */}
            <div className="ls__bottom" aria-hidden="true">
              <div className="ls__bar-track">
                <div className="ls__bar-fill" />
              </div>
              <span className="ls__pct">
                <span className="ls__pct-num">▮▮▮▮▮</span>
              </span>
            </div>
          </div>
        </div>

        {/* Corners */}
        <div className="ls__corner ls__corner--tl" aria-hidden="true">01 / PORTFOLIO</div>
        <div className="ls__corner ls__corner--br" aria-hidden="true">東京へ — 2026</div>
      </div>
    </>
  );
}
