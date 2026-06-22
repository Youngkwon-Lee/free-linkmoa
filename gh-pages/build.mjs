/**
 * free-linkmoa GitHub Pages builder
 * Builds a 3D-room-first Kinelo hub from config.yml.
 */

import { cpSync, copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = yaml.load(readFileSync(join(__dirname, 'config.yml'), 'utf8'));
const { profile = {}, hero = {}, sections = [] } = config;

const esc = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const allItems = sections.flatMap((section) => (section.items || []).map((item) => ({
  ...item,
  section: section.label,
})));

const publicItems = allItems.filter((item) => item.url);
const projects = publicItems.filter((item) => ['Product', 'Demo', 'Research', 'Ops', 'Wearable', 'Personal'].includes(item.meta)).slice(0, 8);
const research = allItems.filter((item) => item.section === 'Research').slice(0, 8);
const notion = allItems.filter((item) => item.section === 'Research DBs').slice(0, 8);
const socials = publicItems.filter((item) => item.section === 'Social');

const itemLink = (item) => item.url
  ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open</a>`
  : '<span>Internal</span>';

const card = (item) => `<article class="project-card">
  <div>
    <span>${esc(item.meta || item.section || 'Kinelo')}</span>
    <h3>${esc(item.title)}</h3>
    <p>${esc(item.description || item.subtitle || '')}</p>
  </div>
  ${itemLink(item)}
</article>`;

const linkButton = (item) => `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>`;

const html = String.raw`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${esc(profile.name || 'Kinelo')} · 3D Lab Room</title>
  <meta name="description" content="${esc(hero.description || profile.bio || 'Kinelo clinical AI lab')}">
  <meta property="og:title" content="${esc(profile.name || 'Kinelo')} · 3D Lab Room">
  <meta property="og:description" content="${esc(hero.description || profile.bio || '')}">
  ${profile.avatar ? `<meta property="og:image" content="${esc(profile.avatar)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jersey+15&family=Montserrat:wght@500;700;900&family=Pixelify+Sans:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #525ceb;
      --primary-dark: #22296f;
      --paper: #f8edff;
      --soft: #d8dcff;
      --ink: #272538;
      --green: #80d8b7;
      --shadow: rgba(15, 17, 36, 0.38);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #050510;
      color: var(--ink);
      font-family: "Jersey 15", ui-monospace, monospace;
    }

    body {
      font-size: 22px;
      touch-action: none;
    }

    button,
    a {
      font: inherit;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .portfolio {
      position: fixed;
      inset: 0;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 15%, rgba(82, 92, 235, 0.34), transparent 28%),
        radial-gradient(circle at 82% 75%, rgba(128, 216, 183, 0.2), transparent 26%),
        #050510;
    }

    #portfolio-canvas {
      width: 100%;
      height: 100%;
      display: block;
      cursor: grab;
    }

    #portfolio-canvas:active {
      cursor: grabbing;
    }

    .loading {
      z-index: 200;
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding: 24px;
      color: var(--primary);
      text-align: center;
      background: var(--paper);
    }

    .loading h2 {
      font-size: clamp(3.4rem, 10vw, 8rem);
      line-height: 0.9;
      letter-spacing: -0.03em;
    }

    .loading p {
      max-width: 560px;
      font-family: "Montserrat", sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: rgba(39, 37, 56, 0.72);
    }

    .hidden {
      display: none !important;
    }

    .top-hud {
      z-index: 50;
      position: fixed;
      top: 22px;
      left: 22px;
      right: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: none;
    }

    .brand-chip,
    .hint-chip {
      display: flex;
      align-items: center;
      gap: 12px;
      border: 2px solid var(--primary);
      border-radius: 999px;
      padding: 9px 14px;
      color: var(--primary);
      background: rgba(248, 237, 255, 0.92);
      box-shadow: 0 18px 40px var(--shadow);
      pointer-events: auto;
    }

    .brand-chip img {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      border: 2px solid var(--primary);
      background: #fff;
    }

    .brand-chip strong,
    .hint-chip strong {
      display: block;
      font-size: 1.3rem;
      line-height: 1;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .brand-chip span,
    .hint-chip span {
      display: block;
      font-family: "Montserrat", sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      color: rgba(39, 37, 56, 0.62);
    }

    .dock {
      z-index: 50;
      position: fixed;
      left: 50%;
      bottom: 24px;
      display: flex;
      gap: 10px;
      transform: translateX(-50%);
      padding: 12px;
      border: 2px solid var(--primary);
      border-radius: 999px;
      background: rgba(248, 237, 255, 0.92);
      box-shadow: 0 20px 50px var(--shadow);
    }

    .dock button,
    .dock a {
      border: 2px solid var(--primary);
      border-radius: 999px;
      padding: 10px 15px;
      color: var(--primary);
      background: #fff;
      cursor: pointer;
      transition: transform 160ms ease, background 160ms ease, color 160ms ease;
    }

    .dock button:hover,
    .dock a:hover {
      color: var(--paper);
      background: var(--primary);
      transform: translateY(-3px);
    }

    .welcome,
    .popup {
      z-index: 100;
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      overflow-y: auto;
      background: rgba(3, 4, 16, 0.78);
      backdrop-filter: blur(4px);
    }

    .welcome-content,
    .popup-content {
      position: relative;
      width: min(880px, 100%);
      max-height: 90vh;
      overflow-y: auto;
      border: 3px solid var(--primary);
      background: var(--paper);
      box-shadow: 12px 12px 0 var(--primary-dark);
    }

    .welcome-content {
      width: min(720px, 100%);
    }

    .popup-close {
      position: sticky;
      top: 12px;
      left: calc(100% - 48px);
      z-index: 2;
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 2px solid var(--primary);
      color: var(--paper);
      background: var(--primary);
      cursor: pointer;
    }

    .popup-body {
      padding: 24px;
    }

    .hero-title {
      margin-bottom: 18px;
      color: var(--primary);
      font-size: clamp(4rem, 12vw, 8rem);
      line-height: 0.8;
      letter-spacing: -0.04em;
      text-transform: uppercase;
    }

    .lead {
      max-width: 720px;
      margin-bottom: 22px;
      font-family: "Montserrat", sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.75;
      color: rgba(39, 37, 56, 0.78);
    }

    .portfolio-section {
      margin-top: 18px;
      border: 2px solid var(--soft);
      padding: 18px;
      background: rgba(255, 255, 255, 0.45);
    }

    .portfolio-section h2 {
      margin-bottom: 14px;
      border-bottom: 3px solid var(--primary);
      padding-bottom: 9px;
      color: var(--primary);
      font-size: 2.3rem;
      text-transform: uppercase;
    }

    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 14px;
    }

    .project-card {
      display: flex;
      min-height: 210px;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      border: 2px solid var(--primary);
      padding: 14px;
      background: #fff;
    }

    .project-card span {
      color: var(--primary);
      font-size: 1rem;
      text-transform: uppercase;
    }

    .project-card h3 {
      margin: 5px 0 8px;
      color: var(--ink);
      font-size: 1.8rem;
      line-height: 1;
    }

    .project-card p {
      font-family: "Montserrat", sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1.55;
      color: rgba(39, 37, 56, 0.68);
    }

    .project-card a,
    .project-card > span {
      width: max-content;
      border: 2px solid var(--primary);
      padding: 6px 12px;
      color: var(--primary);
      background: var(--paper);
    }

    .social-links,
    .quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .social-links a,
    .quick-links a {
      border: 2px solid var(--primary);
      padding: 9px 13px;
      color: var(--primary);
      background: #fff;
    }

    .credit {
      margin-top: 16px;
      font-family: "Montserrat", sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      line-height: 1.6;
      color: rgba(39, 37, 56, 0.58);
    }

    .credit a {
      color: var(--primary);
      text-decoration: underline;
    }

    @media (max-width: 760px) {
      body {
        font-size: 18px;
      }

      .top-hud {
        align-items: flex-start;
      }

      .hint-chip {
        display: none;
      }

      .brand-chip {
        max-width: calc(100vw - 44px);
      }

      .dock {
        left: 12px;
        right: 12px;
        bottom: 12px;
        transform: none;
        overflow-x: auto;
        justify-content: flex-start;
        border-radius: 20px;
      }

      .dock button,
      .dock a {
        white-space: nowrap;
      }

      .popup-body {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="portfolio">
    <canvas id="portfolio-canvas"></canvas>
  </div>

  <div id="loading" class="loading">
    <h2>Loading Kinelo Room...</h2>
    <p>3D clinical AI lab을 불러오는 중입니다. 모델, 카메라, 링크 오브젝트를 한 번에 로드합니다.</p>
  </div>

  <div class="top-hud">
    <button id="brand-open" class="brand-chip" type="button">
      ${profile.avatar ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name)}">` : ''}
      <span><strong>${esc(profile.name || 'Youngkwon Lee')}</strong><span>${esc(profile.eyebrow || 'Clinical AI Lab')}</span></span>
    </button>
    <div class="hint-chip">
      <strong>Click the room</strong>
      <span id="object-status">Computer, GitHub, book, mug, chair objects are active</span>
    </div>
  </div>

  <nav class="dock" aria-label="Kinelo shortcuts">
    <button id="open-portfolio" type="button">Portfolio</button>
    ${hero.primary?.url ? `<a href="${esc(hero.primary.url)}" target="_blank" rel="noopener noreferrer">Kinelo</a>` : ''}
    ${projects.slice(1, 4).map(linkButton).join('')}
  </nav>

  <div id="welcome" class="welcome">
    <div class="welcome-content">
      <button id="welcome-exit-button" class="popup-close" type="button">&times;</button>
      <div class="popup-body">
        <h1 class="hero-title">Kinelo Lab Room</h1>
        <p class="lead">${esc(hero.description || profile.bio || '')}</p>
        <p class="lead">이 창을 닫은 다음 방 안의 컴퓨터, Portfolio 간판, GitHub 아이콘, 책, 머그컵, 의자를 직접 클릭할 수 있습니다.</p>
        <div class="quick-links">
          ${projects.slice(0, 5).map(linkButton).join('')}
        </div>
        <p class="credit">이 페이지는 open-source 3D room portfolio 구조를 Kinelo hub로 재구성했습니다. Base room model: <a href="https://github.com/Rowobin/3D-Room-Portfolio" target="_blank" rel="noopener noreferrer">Rowobin/3D-Room-Portfolio</a>.</p>
      </div>
    </div>
  </div>

  <div id="popup" class="popup hidden">
    <div class="popup-content">
      <button id="popup-exit-button" class="popup-close" type="button">&times;</button>
      <div class="popup-body">
        <h1 class="hero-title">Youngkwon<br>Lee.</h1>
        <p class="lead">${esc(hero.subtitle || profile.bio || '')}</p>

        <section class="portfolio-section">
          <h2>Main Projects</h2>
          <div class="project-grid">
            ${projects.map(card).join('')}
          </div>
        </section>

        <section class="portfolio-section">
          <h2>Research</h2>
          <div class="project-grid">
            ${research.map(card).join('')}
          </div>
        </section>

        <section class="portfolio-section">
          <h2>Notion DB</h2>
          <div class="project-grid">
            ${notion.map(card).join('')}
          </div>
        </section>

        <section class="portfolio-section">
          <h2>Social</h2>
          <div class="social-links">
            ${socials.map(linkButton).join('')}
          </div>
        </section>
      </div>
    </div>
  </div>

  <script type="importmap">
    {
      "imports": {
        "three": "./assets/three/three.module.js",
        "three/addons/": "./assets/three/addons/"
      }
    }
  </script>
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    const canvas = document.getElementById('portfolio-canvas');
    const loading = document.getElementById('loading');
    const popup = document.getElementById('popup');
    const welcome = document.getElementById('welcome');
    const openPortfolio = document.getElementById('open-portfolio');
    const brandOpen = document.getElementById('brand-open');
    const closePopupButton = document.getElementById('popup-exit-button');
    const closeWelcomeButton = document.getElementById('welcome-exit-button');
    const objectStatus = document.getElementById('object-status');

    const objectActions = {
      Portfolio: () => popup.classList.toggle('hidden'),
      Table: () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      ComputerHotspot: () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      'PC Screen': () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      Mousepad: () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      Keyboard: () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      Mouse: () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      'PC Tower': () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      Github: () => window.open('https://github.com/Youngkwon-Lee', '_blank', 'noopener,noreferrer'),
      TwitterX: () => window.open('https://x.com/Yoonjun_dev', '_blank', 'noopener,noreferrer'),
      Book: () => window.open('https://github.com/Youngkwon-Lee/Hawkeye_paper', '_blank', 'noopener,noreferrer'),
      Backpack: () => window.open('https://physio-app-steel.vercel.app', '_blank', 'noopener,noreferrer'),
      Mug: () => window.open('https://face-fitness.vercel.app', '_blank', 'noopener,noreferrer'),
      Name: () => popup.classList.toggle('hidden'),
    };

    const objectLabels = {
      Portfolio: 'Portfolio panel',
      Table: 'Computer desk -> physio_app',
      ComputerHotspot: 'Computer -> physio_app',
      'PC Screen': 'Computer -> physio_app',
      Mousepad: 'Mousepad -> physio_app',
      Keyboard: 'Keyboard -> physio_app',
      Mouse: 'Mouse -> physio_app',
      'PC Tower': 'PC tower -> physio_app',
      Github: 'GitHub -> Youngkwon-Lee',
      TwitterX: 'X -> Yoonjun_dev',
      Book: 'Book -> Hawkeye research',
      Backpack: 'Backpack -> Kinelo',
      Mug: 'Mug -> Face Fitness',
      Name: 'Name plate -> Portfolio',
      Chair: 'Chair -> spin',
    };

    const jumpNames = new Set(['Backpack', 'Book', 'Cactus', 'Can1', 'Can2', 'Can3', 'Mat', 'Mug', 'Name', 'Pokeball', 'Rubix Cube', 'Skateboard']);
    const intersectObjectsNames = new Set([...Object.keys(objectActions), ...jumpNames, 'Chair']);
    const intersectObjects = [];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8edff);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch (error) {
      loading.querySelector('h2').textContent = 'WebGL is unavailable';
      loading.querySelector('p').textContent = '현재 브라우저에서 3D 렌더링 컨텍스트를 만들 수 없습니다.';
      console.error('Kinelo 3D room renderer failed', error);
      throw error;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(14.7, 8.2, 6.1);

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.target.set(-1, 3, -1.5);
    controls.update();

    function setupLights() {
      scene.add(new THREE.AmbientLight(0xd0d0ff, 0.3));

      const sun = new THREE.DirectionalLight(0xffffeb, 1.5);
      sun.position.set(15, 25, 10);
      sun.castShadow = true;
      sun.shadow.camera.near = 0.1;
      sun.shadow.camera.far = 50;
      sun.shadow.camera.left = -10;
      sun.shadow.camera.right = 10;
      sun.shadow.camera.top = 10;
      sun.shadow.camera.bottom = -10;
      sun.shadow.mapSize.width = 2048;
      sun.shadow.mapSize.height = 2048;
      sun.shadow.bias = -0.001;
      scene.add(sun);

      const fill = new THREE.DirectionalLight(0xddefff, 0.5);
      fill.position.set(-8, 12, 0);
      scene.add(fill);
    }

    function addComputerHotspot(model) {
      const parts = ['PC Screen', 'Keyboard', 'Mouse', 'Mousepad', 'PC Tower']
        .map((name) => model.getObjectByName(name))
        .filter(Boolean);
      if (!parts.length) return;

      const box = new THREE.Box3();
      parts.forEach((part) => box.expandByObject(part));
      box.expandByScalar(0.35);

      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const hotspot = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.001,
          depthWrite: false,
        }),
      );
      hotspot.name = 'ComputerHotspot';
      hotspot.position.copy(center);
      model.add(hotspot);
      intersectObjects.push(hotspot);
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    function jumpObject(object) {
      const start = object.position.y;
      const startedAt = performance.now();
      const duration = 620;
      const tick = (now) => {
        const t = Math.min(1, (now - startedAt) / duration);
        object.position.y = start + Math.sin(t * Math.PI) * 0.5;
        if (t < 1) requestAnimationFrame(tick);
        else object.position.y = start;
      };
      requestAnimationFrame(tick);
    }

    function spinObject(object) {
      const start = object.rotation.y;
      const startedAt = performance.now();
      const duration = 900;
      const tick = (now) => {
        const t = Math.min(1, (now - startedAt) / duration);
        object.rotation.y = start + Math.PI * 2 * (1 - Math.pow(1 - t, 3));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    function resolveInteractable(object) {
      let current = object;
      while (current) {
        if (intersectObjectsNames.has(current.name)) return current;
        current = current.parent;
      }
      return object;
    }

    function intersectFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(intersectObjects, true);
    }

    function handleHover(event) {
      if (!welcome.classList.contains('hidden') || !popup.classList.contains('hidden')) {
        canvas.style.cursor = 'grab';
        return;
      }
      const intersects = intersectFromEvent(event);
      const target = intersects.length ? resolveInteractable(intersects[0].object) : null;
      const label = target ? objectLabels[target.name] : '';
      canvas.style.cursor = label ? 'pointer' : 'grab';
      if (objectStatus) {
        objectStatus.textContent = label || 'Computer, GitHub, book, mug, chair objects are active';
      }
    }

    function handlePointer(event) {
      if (!welcome.classList.contains('hidden') || !popup.classList.contains('hidden')) return;
      const intersects = intersectFromEvent(event);
      if (!intersects.length) return;

      const target = resolveInteractable(intersects[0].object);
      const name = target.name;
      if (objectActions[name]) {
        objectActions[name]();
      } else if (name === 'Chair') {
        spinObject(target);
      } else {
        jumpObject(target);
      }
    }

    const loader = new GLTFLoader();
    loader.load(
      './assets/portfolio_room.glb',
      (glb) => {
        glb.scene.traverse((child) => {
          if (intersectObjectsNames.has(child.name)) intersectObjects.push(child);
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        addComputerHotspot(glb.scene);
        scene.add(glb.scene);
        window.KINELO_ROOM = { scene, camera, controls, intersectObjects };
        setupLights();
        loading.classList.add('hidden');
      },
      undefined,
      (error) => {
        loading.querySelector('h2').textContent = 'Model load failed';
        loading.querySelector('p').textContent = '3D room model을 불러오지 못했습니다. 네트워크와 asset 경로를 확인해야 합니다.';
        console.error('Kinelo 3D room model failed', error);
      },
    );

    openPortfolio.addEventListener('click', () => popup.classList.toggle('hidden'));
    brandOpen.addEventListener('click', () => welcome.classList.toggle('hidden'));
    closePopupButton.addEventListener('click', () => popup.classList.add('hidden'));
    closeWelcomeButton.addEventListener('click', () => welcome.classList.add('hidden'));
    window.addEventListener('pointerdown', handlePointer);
    window.addEventListener('pointermove', handleHover);
    window.addEventListener('resize', resize);

    function animate() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    animate();
  </script>
</body>
</html>`;

const outDir = join(__dirname, '..', 'out');
mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, 'assets'), { recursive: true });

const roomModelPath = join(__dirname, 'assets', 'portfolio_room.glb');
if (existsSync(roomModelPath)) {
  copyFileSync(roomModelPath, join(outDir, 'assets', 'portfolio_room.glb'));
}

const threeRuntimePath = join(__dirname, 'assets', 'three');
if (existsSync(threeRuntimePath)) {
  cpSync(threeRuntimePath, join(outDir, 'assets', 'three'), { recursive: true });
}

writeFileSync(join(outDir, 'index.html'), html, 'utf8');

console.log('Built: out/index.html');
console.log(`profile: ${profile.name}`);
console.log(`projects: ${projects.length}`);
console.log(`research: ${research.length}`);
