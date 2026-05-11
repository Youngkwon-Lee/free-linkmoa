/**
 * free-linkmoa GitHub Pages 빌드 스크립트
 * config.yml → out/index.html 정적 HTML 생성
 *
 * 사용: node build.mjs
 * 출력: ../out/index.html
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config 로드 ──────────────────────────────────────────────────────────────
const config = yaml.load(readFileSync(join(__dirname, 'config.yml'), 'utf8'));

const { profile = {}, theme = {}, links = [] } = config;

// ── 기본 테마 ────────────────────────────────────────────────────────────────
const t = {
  background: '#0a0f1e',
  text: '#f8fafc',
  button_bg: '#0f2044',
  button_text: '#f8fafc',
  button_hover: '#1a3a6e',
  accent: '#3b82f6',
  ...theme,
};

// ── 브랜드 아이콘 맵 (인라인 SVG — 외부 CDN 의존 없음) ───────────────────────
const BRAND = {
  instagram: {
    bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  github: {
    bg: '#24292e',
    svg: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  linkedin: {
    bg: '#0A66C2',
    svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  youtube: {
    bg: '#FF0000',
    svg: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
  },
  twitter: {
    bg: '#000000',
    svg: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  x: {
    bg: '#000000',
    svg: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  threads: {
    bg: '#000000',
    svg: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.868 1.205 8.621.024 12.186 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.689-2.042 1.662-1.754 1.663-3.87.031-5.621-.836-.916-2.053-1.595-3.616-2.023-.539 2.185-1.557 3.726-3.028 4.583-1.559.912-3.392.889-5.125-.07-1.567-.882-2.405-2.316-2.329-4.035.068-1.534.822-2.811 2.15-3.702 1.247-.842 2.834-1.22 4.729-1.125.637.033 1.238.101 1.8.202-.108-.977-.302-1.717-.587-2.218-.454-.794-1.198-1.2-2.219-1.207-.825.006-1.496.226-2.059.672-.509.408-.827.987-.947 1.726H4.13c.118-1.252.612-2.288 1.473-3.08 1.017-.935 2.35-1.408 3.961-1.408h.046c2.35.013 4.001.979 4.914 2.869.456.955.68 2.07.686 3.396v.208c-.006.867-.2 1.572-.602 2.197-.401.625-.992 1.071-1.773 1.353.226.279.443.596.64.944.627 1.105.69 2.265.182 3.285-.594 1.189-1.754 1.847-3.271 1.858z',
  },
  tiktok:  { bg: '#000000', svg: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  discord: { bg: '#5865F2', svg: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' },
  facebook: { bg: '#1877F2', svg: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
};

// 이모지 폴백 (브랜드 맵에 없는 아이콘용)
const EMOJI = { email: '📧', blog: '📝', link: '🔗', carrot: '🥕', huggingface: '🤗', inflearn: '🎓', home: '🏠' };
const icon = (name) => EMOJI[name?.toLowerCase()] ?? '🔗';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── HTML 조각 생성 ───────────────────────────────────────────────────────────
const avatarHtml = profile.avatar
  ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name)}" class="avatar">`
  : `<div class="avatar-placeholder">😊</div>`;

const bioHtml = profile.bio ? `<p class="bio">${esc(profile.bio)}</p>` : '';

const linksHtml = links
  .filter((l) => l.enabled !== false)
  .map((l) => {
    const brand = BRAND[l.icon?.toLowerCase()];
    const thumbHtml = l.thumbnail
      ? `<div class="link-thumb"><img src="${esc(l.thumbnail)}" alt="${esc(l.title)}" class="thumb-img"></div>`
      : brand
        ? `<div class="link-thumb" style="background:${brand.bg}"><svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-label="${esc(l.icon)}"><path d="${brand.svg}"/></svg></div>`
        : `<div class="link-thumb thumb-emoji"><span>${icon(l.icon)}</span></div>`;
    return (
      `<a href="${esc(l.url)}" class="link-btn" target="_blank" rel="noopener noreferrer">` +
      thumbHtml +
      `<span class="link-title">${esc(l.title)}</span>` +
      `<span class="link-arrow">›</span>` +
      `</a>`
    );
  })
  .join('\n      ');

// ── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${t.background};
    color: ${t.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3rem 1rem 4rem;
  }
  .page { width: 100%; max-width: 580px; }
  .profile { text-align: center; margin-bottom: 2.25rem; }
  .avatar {
    width: 96px; height: 96px; border-radius: 50%;
    object-fit: cover; display: block; margin: 0 auto 1rem;
    border: 3px solid ${t.accent};
  }
  .avatar-placeholder {
    width: 96px; height: 96px; border-radius: 50%;
    background: ${t.button_bg}; margin: 0 auto 1rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; border: 3px solid ${t.accent};
  }
  h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
  .bio { opacity: 0.7; font-size: 0.95rem; line-height: 1.6; }
  .links { display: flex; flex-direction: column; gap: 0.75rem; }

  /* ── 3D 카드 ── */
  .link-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.25rem 0.85rem 0.85rem;
    background: ${t.button_bg};
    color: ${t.button_text};
    text-decoration: none;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow:
      0 4px 16px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.07);
    transition:
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.25s ease,
      border-color 0.25s ease;
    transform-style: preserve-3d;
    will-change: transform;
    cursor: pointer;
  }
  /* 유리 반짝임 오버레이 */
  .link-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }
  .link-btn:hover::before { opacity: 1; }
  .link-btn:active {
    transform: perspective(600px) translateY(-1px) scale(0.98) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
  }

  /* ── 썸네일 ── */
  .link-thumb {
    width: 52px; height: 52px;
    border-radius: 12px;
    flex-shrink: 0;
    overflow: hidden;
    background: rgba(255,255,255,0.09);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .thumb-img {
    width: 100%; height: 100%;
    object-fit: cover;
  }
  .link-thumb svg { display: block; }
  .thumb-emoji span {
    font-size: 2rem;
    line-height: 1;
  }

  .link-title { flex: 1; }
  .link-arrow {
    font-size: 1.4rem;
    opacity: 0.35;
    transition: opacity 0.2s, transform 0.2s;
  }
  .link-btn:hover .link-arrow {
    opacity: 0.85;
    transform: translateX(4px);
  }

  footer { text-align: center; margin-top: 3rem; font-size: 0.78rem; opacity: 0.35; }
  footer p { margin: 0.45rem 0 0; }
  footer a { color: inherit; text-decoration: none; }
`.trim();

// ── 최종 HTML ────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(profile.name)}</title>
  <meta name="description" content="${esc(profile.bio || profile.name)}">
  <meta property="og:title" content="${esc(profile.name)}">
  <meta property="og:description" content="${esc(profile.bio || '')}">
  ${profile.avatar ? `<meta property="og:image" content="${esc(profile.avatar)}">` : ''}
  <style>${css}</style>
</head>
<body>
  <div class="page">
    <div class="profile">
      ${avatarHtml}
      <h1>${esc(profile.name)}</h1>
      ${bioHtml}
    </div>
    <div class="links">
      ${linksHtml}
    </div>
    <footer>
      <a href="https://github.com/baryonlabs/free-linkmoa">Powered by free-linkmoa</a>
      <p>
        이 프로젝트는 <a href="https://ai-native.vibecamp.us">ai-native.vibecamp.us</a>에서 소개하고 있습니다.
        자세히 배우고 싶은 팀이나 조직은 컨택해 주세요.
      </p>
    </footer>
  </div>

  <!-- 마우스 추적 3D 틸트 효과 -->
  <script>
    document.querySelectorAll('.link-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = \`perspective(600px) rotateY(\${x * 14}deg) rotateX(\${-y * 8}deg) translateY(-5px) scale(1.01)\`;
        btn.style.boxShadow = \`\${-x * 12}px \${(-y * 10) + 22}px 40px rgba(0,0,0,0.5), 0 8px 20px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)\`;
        btn.style.borderColor = 'rgba(255,255,255,0.18)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
        btn.style.borderColor = '';
      });
    });
  </script>
</body>
</html>`;

// ── 파일 저장 ────────────────────────────────────────────────────────────────
const outDir = join(__dirname, '..', 'out');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html, 'utf8');

console.log('✅ Built: out/index.html');
console.log(`   profile: ${profile.name}`);
console.log(`   links: ${links.filter((l) => l.enabled !== false).length}개`);
