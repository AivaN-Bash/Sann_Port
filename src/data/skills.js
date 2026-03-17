/* ─── Skills data ─────────────────────────────────────────────
   Each skill has:
   - id, category, icon, name (en/ja)
   - level (0-100)
   - gradient (CSS gradient string — brand colors)
   - colorRgb (for CSS var --card-accent, used in border + glow)
   - tags (optional)
   - delay (stagger for bar animation, set dynamically in component)
──────────────────────────────────────────────────────────────── */

const SKILLS_DATA = [
  /* ── Creative Tools ─────────────────────────────────────── */
  {
    id: 'premiere',
    category: 'tools',
    icon: '🎞️',
    name: { en: 'Premiere Pro', ja: 'プレミアプロ' },
    level: 92,
    gradient: 'linear-gradient(90deg, #9999FF, #EA77FF)',
    colorRgb: '153, 153, 255',
    tags: ['Editing', 'Color', 'Export'],
  },
  {
    id: 'aftereffects',
    category: 'tools',
    icon: '✨',
    name: { en: 'After Effects', ja: 'アフターエフェクツ' },
    level: 88,
    gradient: 'linear-gradient(90deg, #9999FF, #00BFFF)',
    colorRgb: '153, 153, 255',
    tags: ['Motion', 'VFX', 'Compositing'],
  },
  {
    id: 'davinci',
    category: 'tools',
    icon: '🎨',
    name: { en: 'DaVinci Resolve', ja: 'ダビンチリゾルブ' },
    level: 85,
    gradient: 'linear-gradient(90deg, #FF6B35, #FFD700)',
    colorRgb: '255, 107, 53',
    tags: ['Grading', 'Fusion', 'Audio'],
  },
  {
    id: 'blender',
    category: 'tools',
    icon: '🌀',
    name: { en: 'Blender', ja: 'ブレンダー' },
    level: 72,
    gradient: 'linear-gradient(90deg, #EA7600, #FF9500)',
    colorRgb: '234, 118, 0',
    tags: ['3D', 'Animation', 'Rendering'],
  },
  {
    id: 'photoshop',
    category: 'tools',
    icon: '🖼️',
    name: { en: 'Photoshop', ja: 'フォトショップ' },
    level: 80,
    gradient: 'linear-gradient(90deg, #31A8FF, #0050B4)',
    colorRgb: '49, 168, 255',
    tags: ['Retouching', 'Compositing'],
  },
  {
    id: 'illustrator',
    category: 'tools',
    icon: '✏️',
    name: { en: 'Illustrator', ja: 'イラストレーター' },
    level: 75,
    gradient: 'linear-gradient(90deg, #FF7C00, #FF4800)',
    colorRgb: '255, 124, 0',
    tags: ['Vector', 'Branding', 'UI'],
  },

  /* ── Languages ───────────────────────────────────────────── */
  {
    id: 'japanese',
    category: 'languages',
    icon: '🇯🇵',
    name: { en: 'Japanese', ja: '日本語' },
    level: 55,
    gradient: 'linear-gradient(90deg, #E84855, #FF6B9D)',
    colorRgb: '232, 72, 85',
    tags: ['N3 Target', 'Studying', 'Kanji'],
  },
  {
    id: 'english',
    category: 'languages',
    icon: '🇺🇸',
    name: { en: 'English', ja: '英語' },
    level: 95,
    gradient: 'linear-gradient(90deg, #00C8FF, #7B61FF)',
    colorRgb: '0, 200, 255',
    tags: ['Native-level', 'Professional'],
  },
];

export default SKILLS_DATA;
