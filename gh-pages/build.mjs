/**
 * free-linkmoa GitHub Pages builder
 * config.yml -> out/index.html
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = yaml.load(readFileSync(join(__dirname, 'config.yml'), 'utf8'));

const { profile = {}, theme = {}, hero = {}, sections = [] } = config;

const t = {
  background: '#08110f',
  text: '#edf7f2',
  muted: '#9eb3aa',
  panel: '#101c18',
  panel_alt: '#14241f',
  border: '#284238',
  accent: '#80d8b7',
  accent_2: '#f1c27d',
  ...theme,
};

const BRAND = {
  github: {
    bg: '#f4f0e8',
    fg: '#161b22',
    svg: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  linkedin: {
    bg: '#d8e8ff',
    fg: '#0a66c2',
    svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  instagram: {
    bg: '#ffe4df',
    fg: '#b8325c',
    svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  threads: {
    bg: '#f4f0e8',
    fg: '#111111',
    svg: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.868 1.205 8.621.024 12.186 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.689-2.042 1.662-1.754 1.663-3.87.031-5.621-.836-.916-2.053-1.595-3.616-2.023-.539 2.185-1.557 3.726-3.028 4.583-1.559.912-3.392.889-5.125-.07-1.567-.882-2.405-2.316-2.329-4.035.068-1.534.822-2.811 2.15-3.702 1.247-.842 2.834-1.22 4.729-1.125.637.033 1.238.101 1.8.202-.108-.977-.302-1.717-.587-2.218-.454-.794-1.198-1.2-2.219-1.207-.825.006-1.496.226-2.059.672-.509.408-.827.987-.947 1.726H4.13c.118-1.252.612-2.288 1.473-3.08 1.017-.935 2.35-1.408 3.961-1.408h.046c2.35.013 4.001.979 4.914 2.869.456.955.68 2.07.686 3.396v.208c-.006.867-.2 1.572-.602 2.197-.401.625-.992 1.071-1.773 1.353.226.279.443.596.64.944.627 1.105.69 2.265.182 3.285-.594 1.189-1.754 1.847-3.271 1.858z',
  },
  x: {
    bg: '#f4f0e8',
    fg: '#111111',
    svg: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
};

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const slugInitial = (title = '') => title
  .split(/\s|-/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0]?.toUpperCase())
  .join('') || 'K';

const iconHtml = (item) => {
  const brand = BRAND[item.icon?.toLowerCase()];
  if (brand) {
    return `<span class="mark brand" style="--mark-bg:${brand.bg};--mark-fg:${brand.fg}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${brand.svg}"/></svg></span>`;
  }
  return `<span class="mark">${esc(slugInitial(item.title))}</span>`;
};

const cardHtml = (item) => {
  const tag = item.url ? 'a' : 'article';
  const href = item.url ? ` href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"` : '';
  const disabled = item.url ? '' : ' is-disabled';
  return `<${tag}${href} class="card${disabled}">
    <div class="card-top">
      ${iconHtml(item)}
      <div class="badges">
        ${item.meta ? `<span>${esc(item.meta)}</span>` : ''}
        ${item.status ? `<span class="status">${esc(item.status)}</span>` : ''}
      </div>
    </div>
    <div class="card-body">
      <h3>${esc(item.title)}</h3>
      ${item.subtitle ? `<p class="subtitle">${esc(item.subtitle)}</p>` : ''}
      ${item.description ? `<p class="description">${esc(item.description)}</p>` : ''}
    </div>
    <div class="card-footer">
      <span>${item.url ? 'Open' : 'Preparing public note'}</span>
      ${item.url ? '<span class="arrow">↗</span>' : ''}
    </div>
  </${tag}>`;
};

const featuredItems = sections
  .flatMap((section) => (section.items || []).map((item) => ({ ...item, section: section.label })))
  .filter((item) => item.url)
  .slice(0, 6);

const featuredHtml = featuredItems
  .map((item, index) => `<a class="orbit-node node-${index + 1}" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">
    <span>${esc(item.meta || item.section)}</span>
    <strong>${esc(item.title)}</strong>
  </a>`)
  .join('\n          ');

const marqueeText = [
  'Clinical AI Builder',
  'Physical Therapist',
  'Kinelo',
  'physio_app',
  'Face Fitness',
  'Finger Tapping',
  'VisualPRM',
  'Hawkeye',
  'Hermes OS',
].join(' — ');

const navHtml = sections
  .map((section, index) => `<button class="tab${index === 0 ? ' is-active' : ''}" data-tab="${esc(section.id)}">${esc(section.label)}</button>`)
  .join('\n        ');

const editorialNav = [
  { id: 'selected-work', label: 'Selected Work' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'now', label: 'Now' },
  { id: 'about', label: 'About' },
  { id: 'connect', label: 'Connect' },
];

const topNavHtml = editorialNav
  .map((section) => `<a href="#${esc(section.id)}" data-jump-tab="${esc(section.id)}">${esc(section.label)}</a>`)
  .join('\n          ');

const sectionsHtml = sections
  .map((section, index) => `<section class="section-panel reveal-block" id="${esc(section.id)}" data-panel="${esc(section.id)}" data-section-index="${String(index + 1).padStart(2, '0')}">
    <div class="section-heading">
      <span class="section-kicker">${String(index + 1).padStart(2, '0')} / ${esc(section.label)}</span>
      <h2>${esc(section.title)}</h2>
      ${section.description ? `<p>${esc(section.description)}</p>` : ''}
    </div>
    <div class="grid">
      ${(section.items || []).map(cardHtml).join('\n      ')}
    </div>
  </section>`)
  .join('\n\n      ');

const projectItems = sections.find((section) => section.id === 'projects')?.items || [];
const researchItems = sections.find((section) => section.id === 'research')?.items || [];
const socialItems = sections.find((section) => section.id === 'social')?.items || [];
const selectedWorkItems = Array.from(new Map([
  ...projectItems.filter((item) => ['physio_app', 'Face Fitness', 'Finger Tap FX', 'VisualPRM Medical PRM'].includes(item.title)),
  ...researchItems.filter((item) => ['Hawkeye', 'VisualPRM'].includes(item.title)),
].map((item) => [item.url || item.title, item])).values()).slice(0, 6);

const workRowsHtml = selectedWorkItems
  .map((item, index) => {
    const tag = item.url ? 'a' : 'article';
    const href = item.url ? ` href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"` : '';
    return `<${tag}${href} class="work-row">
      <span>${String(index + 1).padStart(2, '0')} · ${esc(item.meta || 'Work')}</span>
      <strong>${esc(item.title)}</strong>
      <p>${esc(item.description || item.subtitle || '')}</p>
    </${tag}>`;
  })
  .join('\n        ');

const socialRowsHtml = socialItems
  .filter((item) => item.url)
  .map((item) => `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>`)
  .join('\n          ');

const editorialSectionsHtml = `
      <section class="section-panel editorial-section reveal-block" id="selected-work" data-panel="selected-work" data-section-index="01">
        <div class="section-heading">
          <span class="section-kicker">01 / Selected Work</span>
          <h2>만들고, 측정하고, 운영합니다.</h2>
          <p>최근에 몰입한 것들 — 제품, 데모, 연구, 에이전트 운영.</p>
        </div>
        <div class="work-list">
          ${workRowsHtml}
        </div>
      </section>

      <section class="section-panel editorial-section reveal-block" id="philosophy" data-panel="philosophy" data-section-index="02">
        <div class="quote-block">
          <span class="section-kicker">02 / Philosophy</span>
          <blockquote>
            <p>Movement is clinical data.</p>
            <p>좋은 평가는 환자의 움직임을 숫자로 줄이는 것이 아니라, 치료사가 다시 판단할 수 있는 상태로 만드는 일입니다.</p>
          </blockquote>
        </div>
        <div class="essay-copy">
          <p>Kinelo는 물리치료, 임상 추론, 멀티모달 AI, 에이전트 운영을 하나의 실험실로 묶는 프로젝트입니다. 목표는 치료사를 대체하는 자동화가 아니라, 관찰과 판단을 더 정확하게 기록하고 재사용하게 만드는 것입니다.</p>
        </div>
      </section>

      <section class="section-panel editorial-section reveal-block" id="now" data-panel="now" data-section-index="03">
        <div class="section-heading">
          <span class="section-kicker">03 / Now</span>
          <h2>Top of mind.</h2>
          <p>지금 운영 중인 작업과 관심사.</p>
        </div>
        <div class="now-list">
          <div><span>Product</span><strong>physio_app · Kinelo main surface</strong></div>
          <div><span>Research</span><strong>Hawkeye · VisualPRM · clinical AI copilot</strong></div>
          <div><span>Demos</span><strong>Face Fitness · Finger Tap FX · movement assessment</strong></div>
          <div><span>Ops</span><strong>Mission Control · Hermes OS · second-brain</strong></div>
          <div><span>Writing</span><strong>Clinical AI, rehab datasets, digital twin notes</strong></div>
        </div>
      </section>

      <section class="section-panel editorial-section reveal-block" id="about" data-panel="about" data-section-index="04">
        <div class="section-heading">
          <span class="section-kicker">04 / About</span>
          <h2>스펙보다 작동하는 결과물.</h2>
          <p>Physical therapy 기반으로 사람의 움직임, 재활 평가, 임상 추론을 AI 제품으로 연결합니다.</p>
        </div>
        <div class="about-grid">
          <div><span>Field</span><strong>Physical Therapy</strong></div>
          <div><span>Build</span><strong>Clinical AI Products</strong></div>
          <div><span>System</span><strong>Agent-operated workflows</strong></div>
        </div>
      </section>

      <section class="section-panel editorial-section reveal-block" id="connect" data-panel="connect" data-section-index="05">
        <div class="section-heading">
          <span class="section-kicker">05 / Connect</span>
          <h2>Clinical AI를 같이 만듭니다.</h2>
          <p>협업, 연구, 제품 피드백, 인터뷰, 프로젝트 문의는 아래 채널로 연결하세요.</p>
        </div>
        <div class="connect-links">
          ${socialRowsHtml}
        </div>
      </section>
`;

const css = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --bg: ${t.background};
    --text: ${t.text};
    --muted: ${t.muted};
    --panel: ${t.panel};
    --panel-alt: ${t.panel_alt};
    --border: ${t.border};
    --accent: ${t.accent};
    --accent-2: ${t.accent_2};
  }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(circle at 15% 5%, rgba(128,216,183,0.2), transparent 32rem),
      radial-gradient(circle at 80% 20%, rgba(241,194,125,0.15), transparent 28rem),
      linear-gradient(145deg, #07100e 0%, var(--bg) 45%, #0e1714 100%);
    color: var(--text);
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    overflow-x: hidden;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -2;
    opacity: 0.22;
    background-image:
      linear-gradient(rgba(128,216,183,0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(128,216,183,0.12) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: radial-gradient(circle at 50% 18%, black, transparent 70%);
  }
  body::after {
    content: "";
    position: fixed;
    inset: auto 8vw 8vh auto;
    width: 44vw;
    height: 44vw;
    max-width: 620px;
    max-height: 620px;
    pointer-events: none;
    z-index: -1;
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 50%, rgba(128,216,183,0.11), transparent 38%),
      conic-gradient(from 120deg, transparent, rgba(128,216,183,0.14), rgba(241,194,125,0.1), transparent);
    filter: blur(14px);
    animation: breathe 8s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { transform: scale(0.96) rotate(0deg); opacity: 0.54; }
    50% { transform: scale(1.05) rotate(18deg); opacity: 0.88; }
  }
  a { color: inherit; }
  .scroll-hud {
    position: fixed;
    right: 22px;
    bottom: 22px;
    z-index: 50;
    display: grid;
    gap: 8px;
    justify-items: end;
    pointer-events: none;
  }
  .scroll-hud strong {
    color: var(--text);
    font: 900 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.16em;
  }
  .scroll-track {
    width: 1px;
    height: 120px;
    background: rgba(255,255,255,0.18);
    position: relative;
    overflow: hidden;
  }
  .scroll-track span {
    position: absolute;
    inset: 0 0 auto;
    height: var(--scroll-progress, 0%);
    background: var(--accent-2);
    box-shadow: 0 0 22px rgba(241,194,125,0.42);
  }
  .section-rail {
    position: fixed;
    left: 22px;
    top: 50%;
    z-index: 30;
    transform: translateY(-50%);
    display: grid;
    gap: 10px;
    color: rgba(237,247,242,0.42);
    font: 900 0.68rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.16em;
    writing-mode: vertical-rl;
    text-transform: uppercase;
    pointer-events: none;
  }
  .page {
    width: min(1120px, calc(100% - 32px));
    margin: 0 auto;
    padding: 34px 0 48px;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 54px;
  }
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.045);
    color: var(--muted);
    font: 800 0.75rem/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    backdrop-filter: blur(18px);
  }
  .status-pill::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 18px var(--accent);
    animation: pulse 1.9s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(0.72); opacity: 0.55; }
    50% { transform: scale(1); opacity: 1; }
  }
  .identity {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255,255,255,0.25);
  }
  .identity strong {
    display: block;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.82rem;
  }
  .identity span {
    display: block;
    color: var(--muted);
    font: 0.82rem/1.3 ui-sans-serif, system-ui, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 56vw;
  }
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    gap: 28px;
    align-items: stretch;
    margin-bottom: 34px;
  }
  .hero-copy {
    padding: clamp(28px, 5vw, 64px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 34px;
    background: linear-gradient(135deg, rgba(16,28,24,0.92), rgba(10,18,15,0.86));
    box-shadow: 0 24px 80px rgba(0,0,0,0.28);
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }
  .hero-copy::after {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    right: -140px;
    bottom: -150px;
    border-radius: 50%;
    border: 1px solid rgba(128,216,183,0.18);
    box-shadow: inset 0 0 80px rgba(128,216,183,0.06);
  }
  .hero-copy::before {
    content: "";
    position: absolute;
    inset: -1px;
    z-index: -1;
    border-radius: inherit;
    background:
      linear-gradient(120deg, transparent 0%, rgba(128,216,183,0.18) 28%, transparent 46%),
      radial-gradient(circle at var(--mx, 30%) var(--my, 20%), rgba(241,194,125,0.14), transparent 22rem);
    opacity: 0.85;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--accent);
    font: 700 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .eyebrow::before {
    content: "";
    width: 30px;
    height: 1px;
    background: var(--accent);
  }
  h1 {
    margin: 0;
    font-size: clamp(4.8rem, 13vw, 11.5rem);
    line-height: 0.78;
    letter-spacing: -0.105em;
    max-width: 820px;
  }
  .hero-subtitle {
    margin: 24px 0 0;
    max-width: 760px;
    font-size: clamp(1.35rem, 3vw, 2.35rem);
    line-height: 1.08;
    letter-spacing: -0.035em;
  }
  .hero-description {
    margin: 22px 0 0;
    max-width: 660px;
    color: var(--muted);
    font: 1rem/1.75 ui-sans-serif, system-ui, sans-serif;
  }
  .hero-proof {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
    position: relative;
    z-index: 1;
  }
  .hero-proof span {
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    padding: 8px 10px;
    color: rgba(237,247,242,0.78);
    background: rgba(255,255,255,0.04);
    font: 800 0.72rem/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 34px;
    position: relative;
    z-index: 1;
  }
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.16);
    text-decoration: none;
    font: 700 0.88rem/1 ui-sans-serif, system-ui, sans-serif;
  }
  .button.primary {
    background: var(--accent);
    color: #07100e;
    border-color: transparent;
  }
  .button.secondary {
    background: rgba(255,255,255,0.04);
    color: var(--text);
  }
  .signal-panel {
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      linear-gradient(180deg, rgba(20,36,31,0.95), rgba(11,18,16,0.95)),
      repeating-linear-gradient(90deg, transparent 0 34px, rgba(255,255,255,0.03) 34px 35px);
    padding: 26px;
    min-height: 100%;
    display: grid;
    align-content: end;
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
  }
  .portrait-card {
    position: relative;
    min-height: 100%;
    border-radius: 34px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      linear-gradient(180deg, rgba(241,194,125,0.12), transparent 42%),
      linear-gradient(180deg, rgba(20,36,31,0.95), rgba(11,18,16,0.95));
    box-shadow: 0 24px 80px rgba(0,0,0,0.26);
    isolation: isolate;
  }
  .portrait-card::before {
    content: "";
    position: absolute;
    inset: 16px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 26px;
    z-index: 2;
    pointer-events: none;
  }
  .portrait-card img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.78) contrast(1.08);
    transform: scale(1.08);
    opacity: 0.78;
  }
  .portrait-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(180deg, rgba(8,17,15,0.08), rgba(8,17,15,0.78) 72%),
      radial-gradient(circle at 52% 34%, transparent 0 22%, rgba(8,17,15,0.34) 58%);
  }
  .portrait-copy {
    position: relative;
    z-index: 3;
    min-height: 640px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 28px;
  }
  .portrait-copy .index {
    position: absolute;
    left: 28px;
    top: 28px;
    color: var(--accent-2);
    font: 900 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.16em;
  }
  .portrait-copy h2 {
    margin: 0;
    font-size: clamp(2.2rem, 5vw, 4.8rem);
    line-height: 0.86;
    letter-spacing: -0.08em;
  }
  .portrait-copy p {
    margin: 16px 0 0;
    max-width: 330px;
    color: rgba(237,247,242,0.76);
    font: 0.95rem/1.65 ui-sans-serif, system-ui, sans-serif;
  }
  .signal-panel::before {
    content: "";
    position: absolute;
    inset: 28px 28px auto auto;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 1px solid rgba(241,194,125,0.45);
    background: radial-gradient(circle, rgba(241,194,125,0.2), transparent 65%);
  }
  .signal-panel::after {
    content: "";
    position: absolute;
    inset: 18px;
    border-radius: 28px;
    background:
      linear-gradient(90deg, rgba(128,216,183,0.08) 1px, transparent 1px),
      linear-gradient(rgba(128,216,183,0.08) 1px, transparent 1px);
    background-size: 26px 26px;
    mask-image: linear-gradient(to bottom, transparent, black 18%, transparent 88%);
    transform: perspective(520px) rotateX(60deg) translateY(70px);
    transform-origin: bottom;
    animation: scanGrid 6s linear infinite;
  }
  @keyframes scanGrid {
    from { background-position: 0 0; }
    to { background-position: 0 52px; }
  }
  .living-orbit {
    position: relative;
    min-height: 270px;
    margin-bottom: 28px;
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      radial-gradient(circle at 50% 50%, rgba(128,216,183,0.16), transparent 21%),
      linear-gradient(135deg, rgba(16,28,24,0.78), rgba(9,15,13,0.7));
    overflow: hidden;
  }
  .living-orbit::before,
  .living-orbit::after {
    content: "";
    position: absolute;
    inset: 34px;
    border-radius: 50%;
    border: 1px solid rgba(128,216,183,0.2);
    animation: rotateOrbit 18s linear infinite;
  }
  .living-orbit::after {
    inset: 68px;
    border-color: rgba(241,194,125,0.18);
    animation-direction: reverse;
    animation-duration: 24s;
  }
  @keyframes rotateOrbit {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .orbit-core {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(34vw, 280px);
    height: min(34vw, 280px);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background:
      radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), transparent 18%),
      radial-gradient(circle, rgba(128,216,183,0.28), rgba(128,216,183,0.03) 62%, transparent 70%);
    border: 1px solid rgba(128,216,183,0.22);
    box-shadow: inset 0 0 48px rgba(128,216,183,0.12), 0 0 90px rgba(128,216,183,0.18);
  }
  .orbit-core strong {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: clamp(1.3rem, 4vw, 3rem);
    letter-spacing: -0.07em;
  }
  .orbit-node {
    position: absolute;
    width: min(220px, 34vw);
    min-height: 70px;
    display: grid;
    align-content: center;
    gap: 6px;
    padding: 14px 16px;
    border-radius: 22px;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(9,15,13,0.72);
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 60px rgba(0,0,0,0.18);
    animation: floatNode 5.5s ease-in-out infinite;
  }
  .orbit-node span {
    color: var(--accent);
    font: 800 0.65rem/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .orbit-node strong {
    font: 900 0.95rem/1.08 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.03em;
  }
  .node-1 { left: 5%; top: 18%; }
  .node-2 { right: 8%; top: 13%; animation-delay: -0.7s; }
  .node-3 { left: 17%; bottom: 12%; animation-delay: -1.4s; }
  .node-4 { right: 15%; bottom: 13%; animation-delay: -2.1s; }
  .node-5 { left: 42%; top: 7%; animation-delay: -2.8s; }
  .node-6 { left: 43%; bottom: 5%; animation-delay: -3.5s; }
  @keyframes floatNode {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(0, -9px, 0); }
  }
  .signal-panel h2 {
    margin: 0 0 16px;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
  }
  .manifesto-strip {
    width: 100vw;
    margin: 0 calc(50% - 50vw) 34px;
    overflow: hidden;
    border-block: 1px solid rgba(255,255,255,0.1);
    background: rgba(241,194,125,0.08);
  }
  .manifesto-track {
    display: flex;
    width: max-content;
    animation: marquee 28s linear infinite;
  }
  .manifesto-track span {
    padding: 18px 18px;
    color: rgba(237,247,242,0.88);
    font: 900 clamp(1.1rem, 2.4vw, 2rem)/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    white-space: nowrap;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .signal-list {
    display: grid;
    gap: 10px;
    margin-top: 22px;
  }
  .signal {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 14px 0;
    border-top: 1px solid rgba(255,255,255,0.09);
    font: 0.9rem/1.3 ui-sans-serif, system-ui, sans-serif;
  }
  .signal span:first-child { color: var(--muted); }
  .tabs {
    position: sticky;
    top: 12px;
    z-index: 10;
    display: flex;
    gap: 8px;
    padding: 8px;
    margin: 0 0 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px;
    background: rgba(8,17,15,0.82);
    backdrop-filter: blur(18px);
    width: fit-content;
  }
  .tab {
    border: 0;
    border-radius: 16px;
    padding: 12px 18px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    font: 800 0.86rem/1 ui-sans-serif, system-ui, sans-serif;
  }
  .tab.is-active {
    color: #07100e;
    background: var(--accent-2);
  }
  .section-panel {
    display: block;
    padding: clamp(34px, 7vw, 86px) 0;
    border-top: 1px solid rgba(255,255,255,0.08);
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 560ms ease, transform 560ms ease;
    scroll-margin-top: 92px;
  }
  .section-panel.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @keyframes lift {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .section-heading {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 18px 34px;
    margin: 22px 0 26px;
    max-width: 980px;
  }
  .section-kicker {
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font: 800 0.72rem/1 ui-sans-serif, system-ui, sans-serif;
  }
  .section-heading h2 {
    margin: 0;
    font-size: clamp(2.8rem, 7vw, 6.4rem);
    line-height: 0.86;
    letter-spacing: -0.085em;
    grid-column: 2;
  }
  .section-heading p {
    margin: 0;
    color: var(--muted);
    font: 1rem/1.65 ui-sans-serif, system-ui, sans-serif;
    grid-column: 2;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .card {
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    padding: 20px;
    border-radius: 10px 28px 10px 28px;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.1);
    background: linear-gradient(180deg, rgba(20,36,31,0.95), rgba(14,24,21,0.92));
    box-shadow: 0 18px 48px rgba(0,0,0,0.2);
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--card-x, 50%) var(--card-y, 0%), rgba(128,216,183,0.16), transparent 38%);
    opacity: 0;
    transition: opacity 180ms ease;
  }
  .card[href]:hover {
    transform: translateY(-5px);
    border-color: rgba(128,216,183,0.5);
    background: linear-gradient(180deg, rgba(25,48,40,0.98), rgba(14,24,21,0.94));
  }
  .card[href]:hover::before { opacity: 1; }
  .card > * { position: relative; z-index: 1; }
  .card.is-disabled {
    opacity: 0.82;
  }
  .card-top,
  .card-footer,
  .badges {
    display: flex;
    align-items: center;
  }
  .card-top,
  .card-footer {
    justify-content: space-between;
    gap: 12px;
  }
  .mark {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #07100e;
    background: var(--accent);
    font: 900 0.92rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.04em;
  }
  .mark.brand {
    background: var(--mark-bg);
    color: var(--mark-fg);
  }
  .mark svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  .badges {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
  }
  .badges span {
    color: var(--muted);
    border: 1px solid rgba(255,255,255,0.11);
    border-radius: 999px;
    padding: 6px 9px;
    font: 700 0.68rem/1 ui-sans-serif, system-ui, sans-serif;
  }
  .badges .status {
    color: var(--accent-2);
  }
  .card h3 {
    margin: 0;
    font-size: 1.45rem;
    line-height: 1;
    letter-spacing: -0.04em;
  }
  .subtitle {
    margin: 10px 0 0;
    color: var(--accent);
    font: 800 0.82rem/1.4 ui-sans-serif, system-ui, sans-serif;
  }
  .description {
    margin: 16px 0 0;
    color: var(--muted);
    font: 0.93rem/1.62 ui-sans-serif, system-ui, sans-serif;
  }
  .card-footer {
    color: rgba(237,247,242,0.72);
    font: 800 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .arrow {
    color: var(--accent);
    font-size: 1.05rem;
  }
  footer {
    margin-top: 54px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: var(--muted);
    font: 0.82rem/1.6 ui-sans-serif, system-ui, sans-serif;
  }
  footer a { text-decoration: none; color: var(--text); }
  @media (max-width: 860px) {
    .hero { grid-template-columns: 1fr; }
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .topbar { margin-bottom: 28px; }
    .section-heading { grid-template-columns: 1fr; }
    .section-heading h2, .section-heading p { grid-column: auto; }
    .portrait-copy { min-height: 520px; }
    .living-orbit { min-height: 500px; }
    .orbit-node { width: min(260px, 72vw); }
    .node-1 { left: 6%; top: 8%; }
    .node-2 { right: 6%; top: 24%; }
    .node-3 { left: 6%; bottom: 25%; }
    .node-4 { right: 6%; bottom: 8%; }
    .node-5 { left: 28%; top: 43%; }
    .node-6 { display: none; }
  }
  @media (max-width: 620px) {
    .page { width: min(100% - 24px, 1120px); padding-top: 18px; }
    .hero-copy, .signal-panel { border-radius: 26px; }
    .grid { grid-template-columns: 1fr; }
    .tabs { width: 100%; overflow-x: auto; }
    .tab { flex: 1 0 auto; }
    .card { min-height: 220px; }
    .status-pill { display: none; }
    .scroll-hud, .section-rail { display: none; }
    .living-orbit { min-height: 560px; }
    .orbit-core { width: 220px; height: 220px; }
    h1 { font-size: clamp(4rem, 20vw, 6rem); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }
  }
  .topnav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(14px, 2.4vw, 28px);
    color: rgba(246,241,231,0.72);
    font: 800 0.76rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .topnav a {
    text-decoration: none;
  }
  .hero-scroll {
    position: absolute;
    left: clamp(28px, 5vw, 64px);
    bottom: 30px;
    z-index: 4;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: rgba(246,241,231,0.62);
    font: 900 0.72rem/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .hero-scroll::before {
    content: "";
    width: 42px;
    height: 1px;
    background: rgba(246,241,231,0.46);
  }
  body {
    background: #050505;
    color: #f6f1e7;
  }
  body::before {
    opacity: 0.12;
    background-size: 72px 72px;
    background-image:
      linear-gradient(rgba(246,241,231,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(246,241,231,0.08) 1px, transparent 1px);
  }
  body::after {
    background: radial-gradient(circle, rgba(246,241,231,0.12), transparent 56%);
  }
  .page {
    width: min(1280px, calc(100% - 44px));
    padding-top: 22px;
  }
  .topbar {
    position: sticky;
    top: 0;
    z-index: 60;
    margin-bottom: 16px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(246,241,231,0.1);
    background: rgba(5,5,5,0.72);
    backdrop-filter: blur(18px);
  }
  .identity strong {
    color: #f6f1e7;
  }
  .identity span,
  .status-pill {
    color: rgba(246,241,231,0.55);
  }
  .hero {
    min-height: calc(100vh - 88px);
    grid-template-columns: minmax(0, 1.02fr) minmax(340px, 0.78fr);
    align-items: stretch;
    gap: clamp(18px, 3vw, 42px);
    margin-bottom: 0;
    position: relative;
  }
  .hero-copy {
    min-height: 680px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: clamp(42px, 8vw, 96px) 0 92px;
  }
  .hero-copy::before,
  .hero-copy::after {
    display: none;
  }
  .eyebrow {
    color: #b8a37f;
    margin-bottom: 28px;
  }
  .eyebrow::before {
    background: #b8a37f;
  }
  h1 {
    font-size: clamp(4.8rem, 15vw, 14.5rem);
    line-height: 0.76;
    letter-spacing: -0.115em;
    max-width: 940px;
  }
  .hero-subtitle {
    max-width: 820px;
    font-size: clamp(1.55rem, 3.3vw, 3.1rem);
    line-height: 1.02;
    color: #f6f1e7;
  }
  .hero-description {
    max-width: 680px;
    color: rgba(246,241,231,0.66);
    font-size: 1.05rem;
  }
  .hero-proof span,
  .button,
  .status-pill {
    border-color: rgba(246,241,231,0.18);
    background: transparent;
  }
  .button.primary {
    background: #f6f1e7;
    color: #050505;
  }
  .portrait-card {
    min-height: 680px;
    border-radius: 0;
    border-color: rgba(246,241,231,0.12);
    background: #111;
  }
  .portrait-card img {
    opacity: 0.9;
    filter: grayscale(1) contrast(1.12) brightness(0.92);
  }
  .portrait-card::before {
    border-radius: 0;
  }
  .portrait-card::after {
    background:
      linear-gradient(180deg, rgba(5,5,5,0.04), rgba(5,5,5,0.78) 78%),
      linear-gradient(90deg, rgba(5,5,5,0.18), transparent 45%);
  }
  .portrait-copy h2 {
    color: #f6f1e7;
  }
  .portrait-copy p,
  .section-heading p,
  .description,
  footer {
    color: rgba(246,241,231,0.62);
  }
  .manifesto-strip {
    margin-top: 0;
    background: #f6f1e7;
    border: 0;
  }
  .manifesto-track span {
    color: #050505;
  }
  .living-orbit {
    display: none;
  }
  .tabs {
    display: none;
  }
  .section-panel {
    min-height: 82vh;
    padding: clamp(84px, 12vw, 150px) 0;
    border-top-color: rgba(246,241,231,0.14);
  }
  .section-heading {
    grid-template-columns: 220px minmax(0, 1fr);
    max-width: 1120px;
  }
  .section-kicker {
    color: #b8a37f;
  }
  .section-heading h2 {
    font-size: clamp(3.4rem, 9vw, 8.5rem);
    line-height: 0.82;
  }
  .card {
    min-height: 250px;
    border-radius: 0;
    border-color: rgba(246,241,231,0.12);
    background: transparent;
    box-shadow: none;
  }
  .card[href]:hover {
    transform: translateY(-6px);
    border-color: rgba(246,241,231,0.52);
    background: rgba(246,241,231,0.04);
  }
  .mark {
    background: #f6f1e7;
    color: #050505;
    border-radius: 0;
  }
  .badges span {
    border-color: rgba(246,241,231,0.14);
    color: rgba(246,241,231,0.58);
  }
  .badges .status,
  .subtitle,
  .arrow {
    color: #b8a37f;
  }
  @media (max-width: 860px) {
    .topnav { display: none; }
    .hero-copy,
    .portrait-card {
      min-height: 560px;
    }
    .section-heading {
      grid-template-columns: 1fr;
    }
  }
  .work-list,
  .now-list,
  .about-grid,
  .connect-links {
    display: grid;
    border-top: 1px solid rgba(246,241,231,0.16);
  }
  .work-row {
    display: grid;
    grid-template-columns: 170px minmax(220px, 0.75fr) minmax(260px, 1fr);
    gap: 24px;
    padding: 28px 0;
    border-bottom: 1px solid rgba(246,241,231,0.16);
    text-decoration: none;
    transition: color 180ms ease, transform 180ms ease;
  }
  .work-row:hover {
    color: #b8a37f;
    transform: translateX(10px);
  }
  .work-row span,
  .now-list span,
  .about-grid span {
    color: rgba(246,241,231,0.46);
    font: 900 0.72rem/1.2 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .work-row strong {
    font-size: clamp(1.6rem, 3vw, 3.2rem);
    line-height: 0.92;
    letter-spacing: -0.07em;
  }
  .work-row p {
    margin: 0;
    color: rgba(246,241,231,0.58);
    font: 1rem/1.6 ui-sans-serif, system-ui, sans-serif;
  }
  .quote-block {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 34px;
  }
  .quote-block blockquote {
    margin: 0;
  }
  .quote-block p:first-child {
    margin: 0;
    font-size: clamp(4rem, 12vw, 12rem);
    line-height: 0.78;
    letter-spacing: -0.115em;
  }
  .quote-block p:last-child {
    margin: 32px 0 0;
    max-width: 820px;
    color: rgba(246,241,231,0.68);
    font-size: clamp(1.35rem, 2.4vw, 2.4rem);
    line-height: 1.14;
    letter-spacing: -0.04em;
  }
  .essay-copy {
    margin-top: 46px;
    margin-left: min(254px, 22vw);
    max-width: 760px;
    color: rgba(246,241,231,0.62);
    font: 1.04rem/1.8 ui-sans-serif, system-ui, sans-serif;
  }
  .now-list div,
  .about-grid div {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 24px;
    padding: 24px 0;
    border-bottom: 1px solid rgba(246,241,231,0.16);
  }
  .now-list strong,
  .about-grid strong {
    font-size: clamp(1.5rem, 3vw, 3rem);
    line-height: 0.95;
    letter-spacing: -0.07em;
  }
  .connect-links {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
  }
  .connect-links a {
    min-height: 150px;
    display: flex;
    align-items: flex-end;
    padding: 22px;
    border-right: 1px solid rgba(246,241,231,0.16);
    border-bottom: 1px solid rgba(246,241,231,0.16);
    text-decoration: none;
    font-size: clamp(1.4rem, 3vw, 3rem);
    line-height: 0.95;
    letter-spacing: -0.07em;
  }
  .connect-links a:hover {
    background: #f6f1e7;
    color: #050505;
  }
  @media (max-width: 760px) {
    .work-row,
    .quote-block,
    .now-list div,
    .about-grid div {
      grid-template-columns: 1fr;
    }
    .essay-copy {
      margin-left: 0;
    }
    .connect-links {
      grid-template-columns: 1fr;
    }
  }
  .lab-hero {
    position: relative;
    min-height: 92vh;
    margin: 16px 0 44px;
    border: 1px solid rgba(246,241,231,0.12);
    overflow: hidden;
    background: #070705;
    isolation: isolate;
  }
  #lab-scene {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  .lab-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(24px, 5vw, 68px);
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(5,5,5,0.82), transparent 62%),
      linear-gradient(0deg, rgba(5,5,5,0.72), transparent 42%);
  }
  .lab-overlay h1 {
    max-width: 820px;
    margin: 0;
    font-size: clamp(4.2rem, 12vw, 12rem);
    line-height: 0.78;
    letter-spacing: -0.115em;
  }
  .lab-overlay p {
    max-width: 560px;
    margin: 22px 0 0;
    color: rgba(246,241,231,0.68);
    font: 1.02rem/1.75 ui-sans-serif, system-ui, sans-serif;
  }
  .lab-kicker {
    color: #b8a37f;
    font: 900 0.74rem/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }
  .lab-hotspots {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 760px;
  }
  .lab-hotspots a {
    pointer-events: auto;
    border: 1px solid rgba(246,241,231,0.18);
    border-radius: 999px;
    padding: 9px 12px;
    text-decoration: none;
    color: rgba(246,241,231,0.72);
    background: rgba(5,5,5,0.34);
    backdrop-filter: blur(14px);
    font: 900 0.7rem/1 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .lab-fallback {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    place-items: center;
    color: rgba(246,241,231,0.5);
    font: 900 0.8rem/1.4 ui-sans-serif, system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    background: radial-gradient(circle, rgba(184,163,127,0.16), transparent 54%);
  }
  .lab-hero.is-webgl-ready .lab-fallback {
    display: none;
  }
  @media (max-width: 860px) {
    .lab-hero {
      min-height: 78vh;
    }
    .lab-overlay {
      background: linear-gradient(0deg, rgba(5,5,5,0.88), rgba(5,5,5,0.38));
    }
  }
`.trim();

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(hero.title || profile.name)}</title>
  <meta name="description" content="${esc(hero.description || profile.bio || profile.name)}">
  <meta property="og:title" content="${esc(hero.title || profile.name)}">
  <meta property="og:description" content="${esc(hero.description || profile.bio || '')}">
  ${profile.avatar ? `<meta property="og:image" content="${esc(profile.avatar)}">` : ''}
  <style>${css}</style>
</head>
<body>
  <div class="scroll-hud" aria-hidden="true">
    <strong id="scroll-percent">00 / 100</strong>
    <div class="scroll-track"><span></span></div>
  </div>
  <div class="section-rail" id="section-rail">00 / Intro</div>
  <main class="page">
    <header class="topbar">
      <div class="identity">
        ${profile.avatar ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name)}" class="avatar">` : ''}
        <div>
          <strong>${esc(profile.name || hero.title)}</strong>
          <span>${esc(profile.eyebrow || profile.bio || '')}</span>
        </div>
      </div>
      <nav class="topnav" aria-label="Primary navigation">
          ${topNavHtml}
      </nav>
      <div class="status-pill">Live portfolio OS</div>
    </header>

    <section class="lab-hero" aria-label="Interactive Clinical AI Lab Desk">
      <canvas id="lab-scene"></canvas>
      <div class="lab-fallback">Clinical AI Lab Desk loading</div>
      <div class="lab-overlay">
        <div>
          <div class="lab-kicker">Interactive Lab Desk / Three.js MVP</div>
          <h1>Clinical AI Lab.</h1>
          <p>Explore Kinelo as a working desk: product monitor, facial analysis model, finger-tap timer, research stack, and Hermes operations node.</p>
        </div>
        <div class="lab-hotspots">
          <a href="https://physio-app-steel.vercel.app" target="_blank" rel="noopener noreferrer">physio_app</a>
          <a href="https://face-fitness.vercel.app" target="_blank" rel="noopener noreferrer">Face Fitness</a>
          <a href="https://finger-tap-fx.vercel.app" target="_blank" rel="noopener noreferrer">Finger Tap</a>
          <a href="https://github.com/Youngkwon-Lee/Hawkeye_paper" target="_blank" rel="noopener noreferrer">Hawkeye</a>
          <a href="https://github.com/Youngkwon-Lee/visualprm-medical-prm" target="_blank" rel="noopener noreferrer">VisualPRM</a>
        </div>
      </div>
    </section>

    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">${esc(profile.eyebrow || 'Clinical AI Lab')}</div>
        <h1>${esc(hero.title || profile.name)}</h1>
        ${hero.subtitle ? `<p class="hero-subtitle">${esc(hero.subtitle)}</p>` : ''}
        ${hero.description ? `<p class="hero-description">${esc(hero.description)}</p>` : ''}
        <div class="hero-proof">
          <span>Physical Therapy</span>
          <span>Clinical AI</span>
          <span>Movement Assessment</span>
          <span>Agent OS</span>
        </div>
        <div class="actions">
          ${hero.primary?.url ? `<a class="button primary" href="${esc(hero.primary.url)}" target="_blank" rel="noopener noreferrer">${esc(hero.primary.label || 'Open')}</a>` : ''}
          ${hero.secondary?.target ? `<a class="button secondary" href="#${esc(hero.secondary.target)}" data-jump-tab="${esc(hero.secondary.target)}">${esc(hero.secondary.label || 'Explore')}</a>` : ''}
        </div>
        <div class="hero-scroll">Scroll</div>
      </div>
      <aside class="portrait-card" aria-label="Youngkwon Lee portrait">
        ${profile.avatar ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name)} portrait">` : ''}
        <div class="portrait-copy">
          <span class="index">00 / INTRO</span>
          <h2>Movement data, made clinically useful.</h2>
          <p>Physical therapy background, clinical reasoning, and AI-native product building in one operating system.</p>
        </div>
      </aside>
    </section>

    <section class="manifesto-strip" aria-label="Profile signal">
      <div class="manifesto-track">
        <span>${esc(marqueeText)} — </span>
        <span>${esc(marqueeText)} — </span>
      </div>
    </section>

    <section class="living-orbit" aria-label="Featured Kinelo surfaces">
      <div class="orbit-core"><strong>Kinelo OS</strong></div>
      ${featuredHtml}
    </section>

    <div class="panels editorial-stack">
      ${editorialSectionsHtml}
    </div>

    <footer>
      <p>Kinelo is curated by Youngkwon Lee. Built with <a href="https://github.com/Youngkwon-Lee/free-linkmoa">free-linkmoa</a>.</p>
    </footer>
  </main>

  <script>
    const tabs = [...document.querySelectorAll('[data-jump-tab]')];
    const panels = [...document.querySelectorAll('[data-panel]')];
    const scrollPercent = document.getElementById('scroll-percent');
    const sectionRail = document.getElementById('section-rail');
    const activate = (id, shouldScroll = false) => {
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.jumpTab === id));
      const panel = panels.find((item) => item.dataset.panel === id);
      if (panel && sectionRail) {
        const label = tabs.find((tab) => tab.dataset.jumpTab === id)?.textContent || id;
        sectionRail.textContent = (panel.dataset.sectionIndex || '00') + ' / ' + label;
      }
      if (panel && shouldScroll) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    };
    tabs.forEach((tab) => tab.addEventListener('click', (event) => {
      event.preventDefault();
      activate(tab.dataset.jumpTab, true);
    }));
    document.querySelectorAll('[data-jump-tab]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        activate(link.dataset.jumpTab, true);
      });
    });
    const initial = location.hash.replace('#', '');
    if (initial && panels.some((panel) => panel.dataset.panel === initial)) activate(initial, true);

    const updateProgress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percent = Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100)));
      document.documentElement.style.setProperty('--scroll-progress', percent + '%');
      if (scrollPercent) scrollPercent.textContent = String(percent).padStart(2, '0') + ' / 100';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activate(entry.target.dataset.panel);
        }
      });
    }, { rootMargin: '-28% 0px -52% 0px', threshold: 0.01 });
    panels.forEach((panel) => sectionObserver.observe(panel));
    panels[0]?.classList.add('is-visible');

    const hero = document.querySelector('.hero-copy');
    hero?.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(2) + '%');
      hero.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(2) + '%');
    });

    document.querySelectorAll('.card[href]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--card-x', ((event.clientX - rect.left) / rect.width * 100).toFixed(2) + '%');
        card.style.setProperty('--card-y', ((event.clientY - rect.top) / rect.height * 100).toFixed(2) + '%');
      });
    });
  </script>
  <script type="module">
    import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

    const labHero = document.querySelector('.lab-hero');
    const canvas = document.getElementById('lab-scene');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (labHero && canvas && !reducedMotion) {
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x070705, 0.065);

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(5.2, 4.2, 8.2);
      camera.lookAt(0, 0.8, 0);

      const group = new THREE.Group();
      scene.add(group);

      const materials = {
        desk: new THREE.MeshStandardMaterial({ color: 0x2a2118, roughness: 0.8, metalness: 0.05 }),
        cream: new THREE.MeshStandardMaterial({ color: 0xf6f1e7, roughness: 0.55, metalness: 0.05 }),
        brass: new THREE.MeshStandardMaterial({ color: 0xb8a37f, roughness: 0.38, metalness: 0.35 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x7fd8b5, roughness: 0.12, metalness: 0.05, transparent: true, opacity: 0.42 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x10100e, roughness: 0.65, metalness: 0.18 }),
        pink: new THREE.MeshStandardMaterial({ color: 0xff79b8, roughness: 0.42, metalness: 0.1 }),
      };

      const addBox = (name, size, position, material) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
        mesh.name = name;
        mesh.position.set(...position);
        group.add(mesh);
        return mesh;
      };

      const addSphere = (name, radius, position, material, scale = [1, 1, 1]) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), material);
        mesh.name = name;
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        group.add(mesh);
        return mesh;
      };

      addBox('clinical desk', [7.2, 0.28, 3.8], [0, -0.15, 0], materials.desk);
      addBox('monitor base', [1.4, 0.18, 0.8], [0, 0.16, -0.78], materials.dark);
      addBox('kinelo monitor', [2.7, 1.55, 0.16], [0, 1.18, -1.05], materials.dark);
      addBox('monitor glow', [2.38, 1.2, 0.03], [0, 1.2, -0.95], materials.glass);
      addBox('paper stack 1', [1.0, 0.08, 0.72], [-2.35, 0.1, 0.35], materials.cream);
      addBox('paper stack 2', [1.05, 0.08, 0.72], [-2.32, 0.22, 0.32], materials.brass);
      addBox('hermes server', [0.8, 1.0, 0.65], [2.55, 0.52, -0.45], materials.dark);
      addBox('tap timer', [0.82, 0.2, 0.82], [1.85, 0.08, 0.82], materials.brass);
      addSphere('face model', 0.58, [-1.55, 0.62, -0.55], materials.pink, [0.82, 1.1, 0.62]);
      addSphere('finger tap node', 0.18, [1.85, 0.38, 0.82], materials.glass);
      addSphere('visual prm node', 0.16, [-2.35, 0.46, 0.36], materials.glass);
      addSphere('mission control node', 0.2, [2.55, 1.16, -0.45], materials.glass);

      const curveMaterial = new THREE.LineBasicMaterial({ color: 0xb8a37f, transparent: true, opacity: 0.42 });
      const makeLine = (points) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p)));
        const line = new THREE.Line(geometry, curveMaterial);
        group.add(line);
      };
      makeLine([[0, 1.2, -0.85], [-1.55, 0.75, -0.55], [-2.35, 0.48, 0.36]]);
      makeLine([[0, 1.2, -0.85], [1.85, 0.42, 0.82], [2.55, 1.16, -0.45]]);

      const grid = new THREE.GridHelper(8, 18, 0xb8a37f, 0x4b4233);
      grid.position.y = -0.28;
      group.add(grid);

      scene.add(new THREE.AmbientLight(0xf6f1e7, 1.2));
      const key = new THREE.DirectionalLight(0xf6f1e7, 2.6);
      key.position.set(3, 6, 4);
      scene.add(key);
      const accent = new THREE.PointLight(0x80d8b7, 3.5, 7);
      accent.position.set(-2, 2.6, 1.6);
      scene.add(accent);

      const pointer = { x: 0, y: 0 };
      labHero.addEventListener('pointermove', (event) => {
        const rect = labHero.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      });

      const resize = () => {
        const width = labHero.clientWidth;
        const height = labHero.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      const clock = new THREE.Clock();
      const animate = () => {
        const elapsed = clock.getElapsedTime();
        group.rotation.y = -0.22 + pointer.x * 0.12 + Math.sin(elapsed * 0.28) * 0.03;
        group.rotation.x = -0.02 + pointer.y * 0.04;
        group.children.forEach((child) => {
          if (child.name?.includes('node') || child.name?.includes('model')) {
            child.position.y += Math.sin(elapsed * 1.8 + child.id) * 0.0009;
          }
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      labHero.classList.add('is-webgl-ready');
      animate();
    }
  </script>
</body>
</html>`;

const outDir = join(__dirname, '..', 'out');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html, 'utf8');

const itemCount = sections.reduce((sum, section) => sum + (section.items?.length || 0), 0);
console.log('Built: out/index.html');
console.log(`profile: ${profile.name}`);
console.log(`sections: ${sections.length}`);
console.log(`items: ${itemCount}`);
