import * as THREE from 'three';

// The Three.js burger scrollytelling scene. Static `three` import here keeps
// Rollup tree-shaking; this whole module is itself lazy-loaded from the page.
export function initBurger(stack: HTMLElement, reduced: boolean) {
  const canvas = document.getElementById('burgerCanvas') as HTMLCanvasElement;
  const pane = canvas.parentElement as HTMLElement;
  const chapters = [...document.querySelectorAll('.chapter')];
  const small = matchMedia('(max-width: 900px)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.4, 11.5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = small ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;

  scene.add(new THREE.AmbientLight(0xfff2dd, 1.0));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(4, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small ? 512 : 1024, small ? 512 : 1024);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -4;
  scene.add(sun);

  const toon = (c: number) => new THREE.MeshToonMaterial({ color: c });
  const group = new THREE.Group();
  scene.add(group);
  group.rotation.y = 0.5;

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.9, 0.14, 48), toon(0xdccba6));
  plate.position.y = -2.6;
  plate.receiveShadow = true;
  group.add(plate);

  function ruffledDisc(rOut: number, h: number, c: number, waves = 9, amp = 0.09) {
    const g = new THREE.CylinderGeometry(rOut, rOut * 0.96, h, 64, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      if (Math.hypot(x, z) > rOut * 0.7) {
        const a = Math.atan2(z, x);
        pos.setY(i, pos.getY(i) + Math.sin(a * waves) * amp);
        const s = 1 + Math.sin(a * waves * 2) * 0.04;
        pos.setX(i, x * s);
        pos.setZ(i, z * s);
      }
    }
    g.computeVertexNormals();
    return new THREE.Mesh(g, toon(c));
  }

  type Layer = { holder: THREE.Group; rest: number; open: number; y: number; target: number };
  const layers: Layer[] = [];
  function addLayer(obj: THREE.Object3D, restY: number, openY: number) {
    obj.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    const holder = new THREE.Group();
    holder.add(obj);
    group.add(holder);
    holder.position.y = restY;
    layers.push({ holder, rest: restY, open: openY, y: restY, target: restY });
  }

  const bunGroup = new THREE.Group();
  const topBun = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    toon(0xdd9a4e)
  );
  topBun.scale.y = 0.8;
  bunGroup.add(topBun);
  for (let i = 0; i < 11; i++) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), toon(0xfbf5e8));
    const a = (i / 11) * Math.PI * 2 + i * 0.7;
    const t = 0.2 + (((i * 37) % 53) / 53) * 0.6;
    seed.position.set(Math.cos(a) * 1.5 * Math.sin(t), 1.16 * Math.cos(t), Math.sin(a) * 1.5 * Math.sin(t));
    seed.scale.set(1, 0.6, 0.75);
    bunGroup.add(seed);
  }
  addLayer(bunGroup, -0.18, 2.95);
  addLayer(ruffledDisc(1.62, 0.12, 0x55833a, 9, 0.1), -0.58, 1.85);
  const cheese = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.09, 2.45), toon(0xf2c14e));
  cheese.rotation.y = Math.PI / 4.6;
  addLayer(cheese, -0.72, 0.95);
  // grilled-chicken tan, not beef brown (chicken, not beef: Ashmit is Hindu)
  addLayer(new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.42, 0.46, 48), toon(0xc79a5b)), -1.0, 0.0);
  addLayer(ruffledDisc(1.45, 0.1, 0xb93018, 12, 0.07), -1.28, -0.95);
  addLayer(new THREE.Mesh(new THREE.CylinderGeometry(1.46, 1.34, 0.5, 48), toon(0xdd9a4e)), -1.62, -1.95);

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
    // scroll-linked turn only, skipped under reduced motion (vestibular trigger)
    if (!reduced) group.rotation.y = 0.5 + p * 1.1;
  }
  addEventListener('scroll', onScroll, { passive: true });

  // drag to spin (user-initiated only)
  let dragging = false, px = 0, spinV = 0;
  pane.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; });
  addEventListener('pointerup', () => (dragging = false));
  addEventListener('pointermove', (e) => {
    if (dragging) { spinV += (e.clientX - px) * 0.004; px = e.clientX; }
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
    group.rotation.y += spinV;
    spinV *= 0.9;
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
