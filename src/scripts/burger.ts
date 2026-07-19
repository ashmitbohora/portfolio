import * as THREE from 'three';

// The burger scrollytelling scene, photo-layer edition. Each layer is a
// photoreal cutout (fal.ai flux + birefnet, generated 2026-07-18, in
// /public/burger-layers/) mounted on an unlit plane; the scroll-explode
// mechanic is unchanged. Planes are flat, so there is no free 3D spin:
// drag gives a small z-tilt instead. This whole module stays lazy-loaded.
export function initBurger(stack: HTMLElement, reduced: boolean) {
  const canvas = document.getElementById('burgerCanvas') as HTMLCanvasElement;
  const pane = canvas.parentElement as HTMLElement;
  const chapters = [...document.querySelectorAll('.chapter')];
  const small = matchMedia('(max-width: 900px)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.4, 11.5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small });

  const group = new THREE.Group();
  scene.add(group);

  // soft contact shadow so the stack doesn't float
  {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 126);
    g.addColorStop(0, 'rgba(60,40,20,0.32)');
    g.addColorStop(1, 'rgba(60,40,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    const blob = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 1.15),
      new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })
    );
    blob.position.y = -2.72;
    blob.renderOrder = 0;
    group.add(blob);
  }

  // file, display width, vertical squash (top-down shots faked into
  // perspective), rest y, open (exploded) y. h/w aspects are baked from the
  // actual cutouts; keep in sync if layers are regenerated.
  const SPECS = [
    { file: 'top-bun', aspect: 0.761, w: 3.05, squash: 1, rest: 0.88, open: 3.1 },
    { file: 'lettuce', aspect: 1.014, w: 3.4, squash: 0.58, rest: 0.18, open: 1.95 },
    { file: 'cheese', aspect: 1.033, w: 2.8, squash: 0.55, rest: -0.12, open: 1.0 },
    { file: 'patty', aspect: 0.64, w: 3.0, squash: 1, rest: -0.55, open: 0.0 },
    { file: 'tomato', aspect: 0.682, w: 2.85, squash: 0.85, rest: -0.95, open: -1.0 },
    { file: 'bottom-bun', aspect: 0.736, w: 2.9, squash: 1, rest: -1.5, open: -2.05 },
  ];

  type Layer = { holder: THREE.Group; rest: number; open: number; y: number; target: number };
  const layers: Layer[] = [];
  const texLoader = new THREE.TextureLoader();
  SPECS.forEach((spec, i) => {
    const tex = texLoader.load(`/burger-layers/${spec.file}.webp`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = small ? 2 : 4;
    const h = spec.w * spec.aspect * spec.squash;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(spec.w, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })
    );
    mesh.renderOrder = SPECS.length - i; // upper ingredients draw over lower ones
    const holder = new THREE.Group();
    holder.add(mesh);
    group.add(holder);
    holder.position.y = spec.rest;
    layers.push({ holder, rest: spec.rest, open: spec.open, y: spec.rest, target: spec.rest });
  });

  // ---- scroll drives everything ----
  const tagEl = document.getElementById('layerTag')!;
  const tagText = [
    '<b>01 / 06</b> &nbsp;TOP BUN · FRONTEND',
    '<b>02 / 06</b> &nbsp;LETTUCE · DESIGN & CLIENTS',
    '<b>03 / 06</b> &nbsp;CHEESE · APIs & AUTOMATION',
    '<b>04 / 06</b> &nbsp;PATTY · DATA',
    '<b>05 / 06</b> &nbsp;SPECIAL SAUCE · SHIPPED',
    '<b>06 / 06</b> &nbsp;BOTTOM BUN · FOUNDATION',
  ];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  let activeIdx = -1;

  function onScroll() {
    const r = stack.getBoundingClientRect();
    const vh = innerHeight;
    const total = r.height - vh;
    const p = Math.min(Math.max(-r.top / total, 0), 1);
    const n = layers.length;
    layers.forEach((L, i) => {
      const raw = Math.min(Math.max(p * n - i, 0), 1);
      const s = smooth(raw);
      L.target = L.rest + (L.open - L.rest) * s;
    });
    const idx = Math.min(Math.floor(p * n), n - 1);
    if (idx !== activeIdx) {
      activeIdx = idx;
      tagEl.innerHTML = tagText[idx];
      chapters.forEach((c, ci) => c.classList.toggle('active', ci === idx));
    }
  }
  addEventListener('scroll', onScroll, { passive: true });

  // drag gives a gentle tilt (flat photo layers cannot truly spin)
  let dragging = false, px = 0, tiltV = 0;
  pane.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; });
  addEventListener('pointerup', () => (dragging = false));
  addEventListener('pointermove', (e) => {
    if (dragging) { tiltV += (e.clientX - px) * 0.0012; px = e.clientX; }
  });

  function resize() {
    const r = pane.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0.2, 0);
  }
  addEventListener('resize', resize);
  resize();

  // render only while the pane is on screen
  let rendering = false;
  function tick() {
    if (!rendering) return;
    layers.forEach((L) => {
      L.y += (L.target - L.y) * (reduced ? 1 : 0.1);
      L.holder.position.y = L.y;
    });
    if (!reduced) {
      group.rotation.z += tiltV;
      tiltV *= 0.9;
      group.rotation.z = Math.max(-0.09, Math.min(0.09, group.rotation.z)) * 0.97; // spring back
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  const visIO = new IntersectionObserver((es) => {
    const vis = es.some((e) => e.isIntersecting);
    if (vis && !rendering) { rendering = true; requestAnimationFrame(tick); }
    else if (!vis) rendering = false;
  });
  visIO.observe(pane);

  onScroll();
  chapters[0]?.classList.add('active');
  rendering = true;
  requestAnimationFrame(tick);
}
