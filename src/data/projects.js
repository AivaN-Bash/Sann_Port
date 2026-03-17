/* ─── Projects data ─────────────────────────────────────────────────
   To add your own thumbnail:
   1. Put your image in  public/images/  (e.g. public/images/project1.jpg)
   2. Set  thumbnail: process.env.PUBLIC_URL + '/images/project1.jpg'
   3. If thumbnail is null/undefined the card shows the coloured placeholder
──────────────────────────────────────────────────────────────────── */

const PROJECTS_DATA = [
  {
    id: 1,
    type: 'CM広告',
    icon: '📺',
    thumbnail: null,   // ← replace with: process.env.PUBLIC_URL + '/images/your-image.jpg'
    thumbnailAlt: { en: 'Urban Pulse TV commercial thumbnail', ja: 'アーバンパルスCMサムネイル' },
    title: { en: 'Urban Pulse — TV Commercial',       ja: 'アーバンパルス — テレビCM' },
    desc:  {
      en: 'A 30-second commercial for a Thai urban lifestyle brand. Fast cuts, kinetic typography, and vibrant color grading.',
      ja: 'タイのアーバンライフスタイルブランドの30秒CM。スピードカット、キネティックタイポグラフィ、鮮やかなカラーグレーディング。',
    },
    vimeo:   'https://vimeo.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 2,
    type: 'Short Film',
    icon: '🎬',
    thumbnail: null,
    thumbnailAlt: { en: 'Between Seasons short film thumbnail', ja: '季節の間で短編映画サムネイル' },
    title: { en: 'Between Seasons',  ja: '季節の間で' },
    desc:  {
      en: 'A contemplative short film exploring transition and identity. Winner of a regional indie festival award.',
      ja: '変化とアイデンティティを探る瞑想的な短編映画。地域のインディーフェスティバルで受賞。',
    },
    vimeo:   'https://vimeo.com',
    youtube: null,
  },
  {
    id: 3,
    type: 'Motion Graphics',
    icon: '⚡',
    thumbnail: null,
    thumbnailAlt: { en: 'Brand identity reveal thumbnail', ja: 'ブランドアイデンティティリビールサムネイル' },
    title: { en: 'Brand Identity Reveal',              ja: 'ブランドアイデンティティリビール' },
    desc:  {
      en: 'Logo animation and full brand reveal package for a tech startup. Built in After Effects with custom expressions.',
      ja: 'テックスタートアップのロゴアニメーションとブランドリビールパッケージ。カスタムエクスプレッションで制作。',
    },
    vimeo:   'https://vimeo.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 4,
    type: 'Social Media',
    icon: '📱',
    thumbnail: null,
    thumbnailAlt: { en: 'Reels and shorts pack thumbnail', ja: 'リールショーツパックサムネイル' },
    title: { en: 'Reels & Shorts Pack',                ja: 'リール・ショーツパック' },
    desc:  {
      en: 'A series of 15 vertical video edits for social media campaigns. Optimised for Instagram Reels and YouTube Shorts.',
      ja: 'ソーシャルメディアキャンペーン用の縦型動画15本。InstagramリールとYouTubeショーツ対応。',
    },
    vimeo:   null,
    youtube: 'https://youtube.com',
  },
  {
    id: 5,
    type: 'Motion Graphics',
    icon: '🌊',
    thumbnail: null,
    thumbnailAlt: { en: 'Data in motion thumbnail', ja: 'データインモーションサムネイル' },
    title: { en: 'Data in Motion',                     ja: 'データインモーション' },
    desc:  {
      en: 'Data visualisation animations for a corporate report. Complex charts brought to life with spring-based transitions.',
      ja: '企業レポート向けデータビジュアライゼーションアニメーション。スプリングトランジションで複雑なチャートを演出。',
    },
    vimeo:   'https://vimeo.com',
    youtube: null,
  },
  {
    id: 6,
    type: 'CM広告',
    icon: '🍜',
    thumbnail: null,
    thumbnailAlt: { en: 'Noodle House promo thumbnail', ja: 'ヌードルハウスプロモサムネイル' },
    title: { en: 'Noodle House — Promo',               ja: 'ヌードルハウス — プロモーション' },
    desc:  {
      en: 'Food commercial with appetising close-up cinematography and warm colour palette. DaVinci Resolve colour grade.',
      ja: 'クローズアップ撮影とウォームカラーパレットによる食品CM。DaVinci Resolveでカラーグレーディング。',
    },
    vimeo:   'https://vimeo.com',
    youtube: 'https://youtube.com',
  },
];

export default PROJECTS_DATA;
