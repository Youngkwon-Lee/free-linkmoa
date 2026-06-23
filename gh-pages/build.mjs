/**
 * free-linkmoa GitHub Pages builder
 * Builds a lightweight SNS-only profile page from config.yml.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = yaml.load(readFileSync(join(__dirname, 'config.yml'), 'utf8'));
const { profile = {}, theme = {}, links = [] } = config;

const esc = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const enabledLinks = links.filter((link) => link.enabled !== false && link.url);

const iconMap = {
  github: 'GH',
  instagram: 'IG',
  linkedin: 'IN',
  threads: 'TH',
  x: 'X',
  twitter: 'X',
  youtube: 'YT',
  email: '@',
  link: '↗',
};

const t = {
  background: '#0c1412',
  text: '#f3f7f4',
  muted: '#9fb0a8',
  card: '#12201b',
  card_alt: '#172823',
  border: '#29443a',
  accent: '#8bd8bd',
  accent_2: '#f2c179',
  ...theme,
};

const linkCards = enabledLinks.map((link, index) => {
  const icon = iconMap[String(link.icon || 'link').toLowerCase()] || '↗';
  return `<a class="link-card" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" style="--delay:${index * 70}ms">
    <span class="link-icon">${esc(icon)}</span>
    <span class="link-copy">
      <strong>${esc(link.title)}</strong>
      <small>${esc(link.label || link.url)}</small>
    </span>
    <span class="link-arrow">Open</span>
  </a>`;
}).join('\n      ');

const profileMark = `<svg class="profile-mark" viewBox="0 0 180 180" role="img" aria-label="Youngkwon Lee signal mark">
  <defs>
    <linearGradient id="markGradient" x1="20" y1="18" x2="158" y2="162" gradientUnits="userSpaceOnUse">
      <stop stop-color="${esc(t.accent)}"/>
      <stop offset="1" stop-color="${esc(t.accent_2)}"/>
    </linearGradient>
    <filter id="markGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.55 0 0 0 0 0.85 0 0 0 0 0.74 0 0 0 0.55 0"/>
      <feBlend in="SourceGraphic"/>
    </filter>
  </defs>
  <rect x="15" y="15" width="150" height="150" rx="42" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)"/>
  <path d="M48 118C58 82 76 61 103 55c15-3 29 1 39 9" fill="none" stroke="url(#markGradient)" stroke-width="9" stroke-linecap="round" filter="url(#markGlow)"/>
  <path d="M48 118c23-9 44-9 63 0 13 6 23 15 31 28" fill="none" stroke="rgba(243,247,244,0.7)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="62" cy="95" r="6" fill="${esc(t.accent_2)}"/>
  <circle cx="103" cy="55" r="7" fill="${esc(t.accent)}"/>
  <circle cx="142" cy="64" r="5" fill="${esc(t.accent_2)}"/>
  <text x="90" y="105" text-anchor="middle" font-family="Archivo, sans-serif" font-size="34" font-weight="800" fill="${esc(t.text)}" letter-spacing="-3">YK</text>
</svg>`;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(profile.name || 'Youngkwon Lee')} · Links</title>
  <meta name="description" content="${esc(profile.bio || 'Youngkwon Lee social links')}">
  <meta property="og:title" content="${esc(profile.name || 'Youngkwon Lee')} · Links">
  <meta property="og:description" content="${esc(profile.bio || '')}">
  ${profile.avatar ? `<meta property="og:image" content="${esc(profile.avatar)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Noto+Sans+KR:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: ${t.background};
      --text: ${t.text};
      --muted: ${t.muted};
      --card: ${t.card};
      --card-alt: ${t.card_alt};
      --border: ${t.border};
      --accent: ${t.accent};
      --accent-2: ${t.accent_2};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      min-height: 100%;
      background: var(--bg);
    }

    body {
      min-height: 100vh;
      color: var(--text);
      font-family: "Archivo", "Noto Sans KR", sans-serif;
      background:
        radial-gradient(circle at 18% 0%, rgba(139, 216, 189, 0.18), transparent 32rem),
        radial-gradient(circle at 82% 12%, rgba(242, 193, 121, 0.14), transparent 26rem),
        linear-gradient(145deg, #09100e 0%, var(--bg) 54%, #101815 100%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .shell {
      width: min(100%, 520px);
      margin: 0 auto;
      padding: 34px 18px 42px;
    }

    .profile {
      position: relative;
      overflow: hidden;
      padding: 28px;
      border: 1px solid color-mix(in srgb, var(--border), white 8%);
      border-radius: 34px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015)),
        var(--card);
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
      animation: rise 520ms ease both;
    }

    .profile::before {
      content: "";
      position: absolute;
      inset: -40% -15% auto auto;
      width: 220px;
      height: 220px;
      border-radius: 999px;
      background: rgba(139, 216, 189, 0.14);
      filter: blur(6px);
    }

    .profile-mark {
      position: absolute;
      right: -22px;
      bottom: -34px;
      width: 180px;
      height: 180px;
      opacity: 0.58;
      transform: rotate(-7deg);
      pointer-events: none;
    }

    .avatar-row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .avatar {
      width: 82px;
      height: 82px;
      border: 2px solid rgba(139, 216, 189, 0.72);
      border-radius: 28px;
      object-fit: cover;
      background: #fff;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
    }

    .identity {
      display: grid;
      gap: 5px;
    }

    .handle {
      width: fit-content;
      padding: 5px 9px;
      border: 1px solid rgba(139, 216, 189, 0.32);
      border-radius: 999px;
      color: var(--accent);
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      background: rgba(139, 216, 189, 0.08);
    }

    h1 {
      font-size: clamp(2.4rem, 13vw, 4.4rem);
      line-height: 0.9;
      letter-spacing: -0.08em;
    }

    .bio {
      position: relative;
      max-width: 34ch;
      color: var(--muted);
      font-family: "Noto Sans KR", sans-serif;
      font-size: 0.98rem;
      line-height: 1.72;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }

    .pill {
      padding: 8px 11px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      color: rgba(243, 247, 244, 0.82);
      font-size: 0.78rem;
      background: rgba(255, 255, 255, 0.045);
    }

    .links {
      display: grid;
      gap: 12px;
      margin-top: 18px;
    }

    .link-card {
      display: grid;
      grid-template-columns: 54px minmax(0, 1fr) auto;
      align-items: center;
      gap: 14px;
      min-height: 76px;
      padding: 11px 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.015)),
        var(--card-alt);
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.22);
      transform: translateY(12px);
      opacity: 0;
      animation: rise 500ms ease forwards;
      animation-delay: var(--delay);
      transition: border-color 180ms ease, transform 180ms ease, background 180ms ease;
    }

    .link-card:hover {
      border-color: rgba(139, 216, 189, 0.55);
      background:
        linear-gradient(135deg, rgba(139, 216, 189, 0.11), rgba(255, 255, 255, 0.02)),
        var(--card-alt);
      transform: translateY(-2px);
    }

    .link-icon {
      display: grid;
      place-items: center;
      width: 54px;
      height: 54px;
      border-radius: 18px;
      color: #0b1411;
      font-size: 0.95rem;
      font-weight: 800;
      background: linear-gradient(145deg, var(--accent), var(--accent-2));
    }

    .link-copy {
      display: grid;
      min-width: 0;
      gap: 3px;
    }

    .link-copy strong {
      font-size: 1.05rem;
      letter-spacing: -0.02em;
    }

    .link-copy small {
      overflow: hidden;
      color: var(--muted);
      font-family: "Noto Sans KR", sans-serif;
      font-size: 0.82rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .link-arrow {
      padding: 8px 10px;
      border-radius: 999px;
      color: rgba(243, 247, 244, 0.78);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.055);
    }

    .footer {
      margin-top: 22px;
      color: rgba(243, 247, 244, 0.46);
      font-size: 0.78rem;
      text-align: center;
    }

    .footer strong {
      color: rgba(139, 216, 189, 0.82);
      font-weight: 800;
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 420px) {
      .shell {
        padding: 18px 12px 32px;
      }

      .profile {
        padding: 22px;
        border-radius: 28px;
      }

      .avatar {
        width: 72px;
        height: 72px;
        border-radius: 24px;
      }

      .link-card {
        grid-template-columns: 48px minmax(0, 1fr);
      }

      .link-icon {
        width: 48px;
        height: 48px;
      }

      .link-arrow {
        display: none;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="profile" aria-label="Youngkwon Lee profile">
      ${profileMark}
      <div class="avatar-row">
        ${profile.avatar ? `<img class="avatar" src="${esc(profile.avatar)}" alt="${esc(profile.name || 'Youngkwon Lee')}">` : '<div class="avatar"></div>'}
        <div class="identity">
          ${profile.handle ? `<span class="handle">${esc(profile.handle)}</span>` : ''}
          <h1>${esc(profile.name || 'Youngkwon Lee')}</h1>
        </div>
      </div>
      ${profile.bio ? `<p class="bio">${esc(profile.bio)}</p>` : ''}
      <div class="meta">
        ${profile.location ? `<span class="pill">${esc(profile.location)}</span>` : ''}
        <span class="pill">Clinical AI</span>
        <span class="pill">Movement Assessment</span>
      </div>
    </section>

    <nav class="links" aria-label="social links">
      ${linkCards}
    </nav>

    <p class="footer"><strong>free-linkmoa</strong> · SNS links only · SVG signal mark</p>
  </main>
</body>
</html>`;

const outDir = join(__dirname, '..', 'out');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html, 'utf8');

console.log('Built: out/index.html');
console.log(`Profile: ${profile.name || 'Youngkwon Lee'}`);
console.log(`Links: ${enabledLinks.length}`);
