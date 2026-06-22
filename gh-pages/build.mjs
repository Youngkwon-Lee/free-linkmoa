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

const sectionsHtml = sections
  .map((section, index) => `<section class="section-panel${index === 0 ? ' is-active' : ''}" id="${esc(section.id)}" data-panel="${esc(section.id)}">
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
    display: none;
    padding-top: 10px;
  }
  .section-panel.is-active {
    display: block;
    animation: lift 0.36s ease both;
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
  <main class="page">
    <header class="topbar">
      <div class="identity">
        ${profile.avatar ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name)}" class="avatar">` : ''}
        <div>
          <strong>${esc(profile.name || hero.title)}</strong>
          <span>${esc(profile.eyebrow || profile.bio || '')}</span>
        </div>
      </div>
      <div class="status-pill">Live portfolio OS</div>
    </header>

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
      </div>
      <aside class="signal-panel" aria-label="Kinelo summary">
        <div>
          <h2>Movement data, made clinically useful.</h2>
          <div class="signal-list">
            <div class="signal"><span>Core product</span><strong>physio_app</strong></div>
            <div class="signal"><span>Assessment demos</span><strong>Face · Finger · Motion</strong></div>
            <div class="signal"><span>Research tracks</span><strong>Clinical AI · Digital Twin</strong></div>
          </div>
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

    <nav class="tabs" aria-label="Content sections">
      ${navHtml}
    </nav>

    <div class="panels">
      ${sectionsHtml}
    </div>

    <footer>
      <p>Kinelo is curated by Youngkwon Lee. Built with <a href="https://github.com/Youngkwon-Lee/free-linkmoa">free-linkmoa</a>.</p>
    </footer>
  </main>

  <script>
    const tabs = [...document.querySelectorAll('[data-tab]')];
    const panels = [...document.querySelectorAll('[data-panel]')];
    const activate = (id) => {
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === id));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === id));
      history.replaceState(null, '', '#' + id);
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.tab)));
    document.querySelectorAll('[data-jump-tab]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        activate(link.dataset.jumpTab);
        document.querySelector('.tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    const initial = location.hash.replace('#', '');
    if (initial && panels.some((panel) => panel.dataset.panel === initial)) activate(initial);

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
