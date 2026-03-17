import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* ─── TRANSLATIONS ───────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    nav_home:'Home', nav_skills:'Skills', nav_projects:'Projects',
    nav_experience:'Experience', nav_contact:'Contact', nav_lang_label:'Language',
    hero_greeting:'SAAN NIZE', hero_subtitle:'Video Editor / Motion Designer / Studying Japanese',
    hero_cta:'Watch Showreel', hero_cta_sub:'Available for work in Japan',
    hero_scroll:'Scroll to explore',
    stat_creativity:'CREATIVITY', stat_precision:'PRECISION', stat_storytelling:'STORYTELLING',
    about_title:'About',
    about_p1:"I craft cinematic stories through motion — cutting-edge video editing and dynamic motion design that moves audiences. Currently levelling up in Japanese to bring my work to the Japanese market.",
    about_p2:'Based between Bangkok and Tokyo-bound, I blend editorial precision with a passion for visual storytelling.',
    skills_title:'Skills', skills_tab_tools:'Creative Tools', skills_tab_languages:'Languages', skills_level_label:'Proficiency',
    projects_title:'Projects', projects_vimeo:'Vimeo', projects_youtube:'YouTube', projects_view:'View Project', projects_empty:'More projects coming soon.',
    experience_title:'Experience', experience_present:'Present',
    contact_title:'Contact', contact_honorific:'Hi!',
    contact_intro:"I'm currently open to video editing and motion design opportunities in Japan and beyond.",
    contact_name:'Your Name', contact_email:'Email Address', contact_message:'Message',
    contact_send:'Send Message', contact_sending:'Sending…', contact_sent:'Message Sent!',
    contact_error:'Please fill in all fields correctly.', contact_email_label:'Email', contact_social:'Find me online',
    loading_text:'Loading…', scroll_top:'Back to top',
    footer_copy:'© {year} Saan Nize. All rights reserved.', footer_made:'Made with precision & coffee',
    aria_menu_open:'Open navigation menu', aria_menu_close:'Close navigation menu',
    aria_theme:'Change theme', aria_lang:'Switch language', aria_cursor:'Custom cursor', aria_scroll_top:'Scroll to top of page',
  },
  ja: {
    nav_home:'ホーム', nav_skills:'スキル', nav_projects:'プロジェクト',
    nav_experience:'経歴', nav_contact:'お問い合わせ', nav_lang_label:'言語',
    hero_greeting:'SAAN NIZE', hero_subtitle:'ビデオエディター / モーションデザイナー / 日本語学習中',
    hero_cta:'ショールールを見る', hero_cta_sub:'日本での仕事を求めています',
    hero_scroll:'スクロールして探索',
    stat_creativity:'クリエイティビティ', stat_precision:'プレシジョン', stat_storytelling:'ストーリーテリング',
    about_title:'自己紹介',
    about_p1:'モーションを通じて映画のようなストーリーを紡ぎます。最先端のビデオ編集とダイナミックなモーションデザインで観客を魅了します。現在、日本市場で活躍するため日本語を猛勉強中です。',
    about_p2:'バンコクを拠点に、東京を目指しています。編集の精密さとビジュアルストーリーテリングへの情熱を融合させています。',
    skills_title:'スキル', skills_tab_tools:'クリエイティブツール', skills_tab_languages:'言語', skills_level_label:'習熟度',
    projects_title:'プロジェクト', projects_vimeo:'Vimeo', projects_youtube:'YouTube', projects_view:'プロジェクトを見る', projects_empty:'近日公開予定です。',
    experience_title:'経歴', experience_present:'現在',
    contact_title:'お問い合わせ', contact_honorific:'はじめまして！',
    contact_intro:'現在、日本および海外でのビデオ編集・モーションデザインの機会を探しています。',
    contact_name:'お名前', contact_email:'メールアドレス', contact_message:'メッセージ',
    contact_send:'送信する', contact_sending:'送信中…', contact_sent:'送信完了！',
    contact_error:'入力内容をご確認ください。', contact_email_label:'メール', contact_social:'SNSで見つける',
    loading_text:'読み込み中…', scroll_top:'トップへ戻る',
    footer_copy:'© {year} サーン・ナイズ. All rights reserved.', footer_made:'精密さとコーヒーで制作',
    aria_menu_open:'ナビゲーションメニューを開く', aria_menu_close:'ナビゲーションメニューを閉じる',
    aria_theme:'テーマを変更', aria_lang:'言語を切り替える', aria_cursor:'カスタムカーソル', aria_scroll_top:'ページトップへスクロール',
  },
};

/* ─── THEMES ─────────────────────────────────────────────────── */
export const THEMES = ['phantom', 'velvet', 'monochrome', 'sakura'];
const THEME_LABELS = {
  phantom:    { en:'Phantom',    ja:'ファントム' },
  velvet:     { en:'Velvet',     ja:'ベルベット' },
  monochrome: { en:'Monochrome', ja:'モノクロ'   },
  sakura:     { en:'Sakura',     ja:'桜'          },
};

/* ─── VALID PAGES ────────────────────────────────────────────── */
const VALID_PAGES = ['home','skills','projects','experience','contact'];

const PAGE_TITLES = {
  en: { home:'Saan Nize | Video Editor · Motion Designer', skills:'Skills | Saan Nize', projects:'Projects | Saan Nize', experience:'Experience | Saan Nize', contact:'Contact | Saan Nize' },
  ja: { home:'サーン・ナイズ | ビデオエディター', skills:'スキル | サーン・ナイズ', projects:'プロジェクト | サーン・ナイズ', experience:'経歴 | サーン・ナイズ', contact:'お問い合わせ | サーン・ナイズ' },
};

function getPageFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    if (VALID_PAGES.includes(segments[i])) return segments[i];
  }
  return 'home';
}

/* ─── CONTEXT ────────────────────────────────────────────────── */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ── Router ── */
  const [page, setPage] = useState(() => getPageFromPath(window.location.pathname));
  const pageRef = useRef(page);
  pageRef.current = page;

  /* ── Theme ── */
  const [theme, setThemeState] = useState(() => {
    try {
      const s = localStorage.getItem('saan-theme');
      if (s && THEMES.includes(s)) return s;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'sakura';
    } catch(_) {}
    return 'phantom';
  });

  /* ── Lang ── */
  const [lang, setLangState] = useState(() => {
    try {
      const s = localStorage.getItem('saan-lang');
      if (s === 'ja' || s === 'en') return s;
    } catch(_) {}
    return 'en';
  });

  /* Apply theme to DOM */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* Apply lang to DOM */
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'ja' ? 'ja' : 'en');
  }, [lang]);

  /* setPageTitle */
  const setPageTitle = useCallback((pageName, currentLang) => {
    const l = currentLang || lang;
    document.title = PAGE_TITLES[l]?.[pageName] ?? PAGE_TITLES.en[pageName] ?? 'Saan Nize';
  }, [lang]);

  /* navigate */
  const navigate = useCallback((target) => {
    if (!VALID_PAGES.includes(target)) return;
    if (target === pageRef.current) return;
    const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    const newPath = target === 'home' ? `${base}/` : `${base}/${target}`;
    window.history.pushState({ page: target }, '', newPath);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* popstate */
  useEffect(() => {
    function handlePop() {
      const p = getPageFromPath(window.location.pathname);
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  /* setTheme */
  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    try { localStorage.setItem('saan-theme', next); } catch(_) {}
    setThemeState(next);
  }, []);

  /* setLang */
  const setLang = useCallback((next) => {
    if (next !== 'en' && next !== 'ja') return;
    try { localStorage.setItem('saan-lang', next); } catch(_) {}
    setLangState(next);
  }, []);

  /* t() translation helper */
  const t = useMemo(() => (key) => {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({
    /* router */
    page, navigate, setPageTitle,
    /* theme */
    theme, setTheme, themes: THEMES, themeLabels: THEME_LABELS,
    /* lang */
    lang, setLang, t, TRANSLATIONS,
  }), [page, navigate, setPageTitle, theme, setTheme, lang, setLang, t]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ─── Custom hooks that read from context ───────────────────── */
export function useRouter()  { return useContext(AppContext); }
export function useTheme()   { return useContext(AppContext); }
export function useLang()    { return useContext(AppContext); }
