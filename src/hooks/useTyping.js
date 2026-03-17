import { useState, useEffect, useRef } from 'react';

const DEFAULT_SPEED   = 80;  /* ms per character (typing) */
const DEFAULT_DELETE  = 40;  /* ms per character (deleting) */
const DEFAULT_PAUSE   = 2200; /* ms hold at full phrase */
const DEFAULT_GAP     = 500;  /* ms pause between phrases */

/**
 * useTyping
 * Cycles through an array of phrases with a typewriter effect.
 * Cleans up all timers on unmount.
 *
 * @param {string[]} phrases  - array of strings to cycle through
 * @param {object}   options  - speed, deleteSpeed, pause, gap
 * @returns {{ text: string, isDeleting: boolean, phraseIndex: number }}
 */
export function useTyping(phrases = [], options = {}) {
  const speed       = options.speed       ?? DEFAULT_SPEED;
  const deleteSpeed = options.deleteSpeed ?? DEFAULT_DELETE;
  const pause       = options.pause       ?? DEFAULT_PAUSE;
  const gap         = options.gap         ?? DEFAULT_GAP;

  const [text,        setText]        = useState('');
  const [isDeleting,  setIsDeleting]  = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const timerRef  = useRef(null);
  const stateRef  = useRef({ text: '', isDeleting: false, phraseIndex: 0 });

  useEffect(() => {
    if (!phrases.length) return;

    /* Respect prefers-reduced-motion — show full first phrase, stop */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(phrases[0]);
      return;
    }

    function tick() {
      const { text: cur, isDeleting: del, phraseIndex: idx } = stateRef.current;
      const target = phrases[idx] ?? '';

      let next = cur;
      let delay;

      if (!del) {
        /* Typing */
        next  = target.slice(0, cur.length + 1);
        delay = speed;
        if (next === target) {
          /* Finished typing — pause then start deleting */
          delay = pause;
          stateRef.current = { text: next, isDeleting: true, phraseIndex: idx };
        } else {
          stateRef.current = { text: next, isDeleting: false, phraseIndex: idx };
        }
      } else {
        /* Deleting */
        next  = cur.slice(0, cur.length - 1);
        delay = deleteSpeed;
        if (next === '') {
          /* Finished deleting — move to next phrase */
          const nextIdx = (idx + 1) % phrases.length;
          delay = gap;
          stateRef.current = { text: '', isDeleting: false, phraseIndex: nextIdx };
          setPhraseIndex(nextIdx);
        } else {
          stateRef.current = { text: next, isDeleting: true, phraseIndex: idx };
        }
      }

      setText(next);
      setIsDeleting(stateRef.current.isDeleting);
      timerRef.current = setTimeout(tick, delay);
    }

    timerRef.current = setTimeout(tick, gap);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phrases, speed, deleteSpeed, pause, gap]); // eslint-disable-line react-hooks/exhaustive-deps

  return { text, isDeleting, phraseIndex };
}
