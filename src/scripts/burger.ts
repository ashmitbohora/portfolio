import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // image-based lighting: this is most of the "real food photo" look
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.AmbientLight(0xfff2dd, 0.35));
  const sun = new THREE.DirectionalLight(0xfff1e0, 2.2);
  sun.position.set(4, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small ? 512 : 1024, small ? 512 : 1024);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -4;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xcfdcff, 0.6);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  // deterministic rng so the burger looks identical every load
  let seedState = 7;
  const rand = () => {
    seedState = (seedState * 16807) % 2147483647;
    return (seedState - 1) / 2147483646;
  };

  function tex(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    draw(ctx, size);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = small ? 2 : 4;
    return t;
  }

  function speckle(
    ctx: CanvasRenderingContext2D, s: number, n: number,
    rgb: [number, number, number], jitter: number, rMax: number, aMax: number,
    yMax = 1
  ) {
    for (let i = 0; i < n; i++) {
      const x = rand() * s, y = rand() * s * yMax;
      const j = (rand() - 0.5) * jitter;
      ctx.fillStyle = `rgba(${rgb[0] + j | 0},${rgb[1] + j | 0},${rgb[2] + j * 0.5 | 0},${rand() * aMax})`;
      ctx.beginPath();
      ctx.arc(x, y, 1 + rand() * rMax, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // verified empirically: canvas TOP row maps to the BOTTOM of these meshes,
  // so bake gradients upside-down relative to how they read on screen
  function bunGradient(ctx: CanvasRenderingContext2D, s: number, flip: boolean) {
    const g = ctx.createLinearGradient(0, flip ? s : 0, 0, flip ? 0 : s);
    g.addColorStop(0, '#eed7a4');
    g.addColorStop(0.22, '#dda258');
    g.addColorStop(0.55, '#c1752a');
    g.addColorStop(0.85, '#a85e1a');
    g.addColorStop(1, '#954f12');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 700, [150, 88, 34], 70, 9, 0.09); // toast blotching
    speckle(ctx, s, 250, [246, 220, 158], 40, 5, 0.08); // flour highlights
  }
  // top bun: toast at the dome (canvas bottom); bottom bun: toast at its base
  const topBunMap = tex(512, (ctx, s) => bunGradient(ctx, s, false));
  const botBunMap = tex(512, (ctx, s) => bunGradient(ctx, s, true));
  const bunPhys = {
    roughness: 0.58, sheen: 0.3, sheenColor: 0xffdf9e,
    clearcoat: 0.18, clearcoatRoughness: 0.7, envMapIntensity: 0.55,
  };
  const bunMat = new THREE.MeshPhysicalMaterial({ map: topBunMap, ...bunPhys });
  const botBunMat = new THREE.MeshPhysicalMaterial({ map: botBunMap, ...bunPhys });

  const crumbMat = new THREE.MeshPhysicalMaterial({ color: 0xf3e3b5, roughness: 0.95 });

  // grilled-chicken tan, not beef brown (chicken, not beef: Ashmit is Hindu)
  // caps get grill marks; the side gets plain roast mottling (stripes wrapped
  // around the cylinder side read as wood-grain rings, verified on screen)
  const pattyCapMap = tex(512, (ctx, s) => {
    ctx.fillStyle = '#a5732f';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 900, [150, 100, 48], 80, 8, 0.18); // roast mottling
    speckle(ctx, s, 350, [225, 180, 110], 50, 5, 0.12); // rendered-fat glints
    ctx.strokeStyle = 'rgba(66, 38, 14, 0.5)'; // char grill marks
    ctx.lineWidth = s * 0.045;
    ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
      const off = i * s * 0.18 - s * 0.4;
      ctx.beginPath();
      ctx.moveTo(off, s * 1.1);
      ctx.lineTo(off + s * 0.9, -s * 0.1);
      ctx.stroke();
    }
    speckle(ctx, s, 260, [58, 32, 12], 20, 4, 0.28); // char flecks
  });
  const pattySideMap = tex(256, (ctx, s) => {
    ctx.fillStyle = '#9c6a2a';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 700, [125, 80, 36], 70, 6, 0.22);
    speckle(ctx, s, 220, [62, 36, 14], 25, 4, 0.25);
    speckle(ctx, s, 150, [210, 160, 92], 30, 3, 0.12);
  });
  // cylinder side UV spans the full circumference in one repeat: tile it so
  // the speckle stays round instead of smearing into wood-grain streaks
  pattySideMap.wrapS = THREE.RepeatWrapping;
  pattySideMap.repeat.x = 6;
  const pattyPhys = { roughness: 0.52, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.75 };
  const pattyCapMat = new THREE.MeshPhysicalMaterial({
    map: pattyCapMap, bumpMap: pattyCapMap, bumpScale: 0.25, ...pattyPhys,
  });
  const pattySideMat = new THREE.MeshPhysicalMaterial({
    map: pattySideMap, bumpMap: pattySideMap, bumpScale: 0.35, ...pattyPhys,
  });

  const lettuceMap = tex(512, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.05, s / 2, s / 2, s * 0.55);
    g.addColorStop(0, '#b7d078');
    g.addColorStop(0.55, '#84b34e');
    g.addColorStop(1, '#567f33');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(224, 238, 178, 0.28)'; // veins, faint
    ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(s / 2, s / 2);
      ctx.quadraticCurveTo(
        s / 2 + Math.cos(a + 0.5) * s * 0.25, s / 2 + Math.sin(a + 0.5) * s * 0.25,
        s / 2 + Math.cos(a) * s * 0.5, s / 2 + Math.sin(a) * s * 0.5
      );
      ctx.stroke();
    }
  });
  const lettuceMat = new THREE.MeshPhysicalMaterial({
    map: lettuceMap, roughness: 0.55, sheen: 0.7, sheenColor: 0xe2f2b2,
    clearcoat: 0.15, clearcoatRoughness: 0.6, side: THREE.DoubleSide, envMapIntensity: 0.7,
  });

  const cheeseMap = tex(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.1, s / 2, s / 2, s * 0.7);
    g.addColorStop(0, '#f9b32f');
    g.addColorStop(0.75, '#ee9a1f');
    g.addColorStop(1, '#d67f15');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  const cheeseMat = new THREE.MeshPhysicalMaterial({
    map: cheeseMap, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.3,
    envMapIntensity: 0.9,
  });

  const tomatoMap = tex(512, (ctx, s) => {
    ctx.fillStyle = '#c22f14'; // skin rim
    ctx.fillRect(0, 0, s, s);
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.46);
    g.addColorStop(0, '#e8836a');
    g.addColorStop(0.8, '#dc5638');
    g.addColorStop(1, '#c22f14');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(246, 205, 160, 0.75)'; // seed pockets
    for (let w = 0; w < 8; w++) {
      const a = (w / 8) * Math.PI * 2 + 0.3;
      for (let k = 0; k < 4; k++) {
        const r = s * (0.16 + k * 0.055);
        ctx.beginPath();
        ctx.ellipse(
          s / 2 + Math.cos(a + k * 0.12) * r, s / 2 + Math.sin(a + k * 0.12) * r,
          s * 0.014, s * 0.007, a, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  });
  const tomatoFleshMat = new THREE.MeshPhysicalMaterial({
    map: tomatoMap, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.2,
    envMapIntensity: 0.9,
  });
  const tomatoSkinMat = new THREE.MeshPhysicalMaterial({
    color: 0xa8321c, roughness: 0.3, clearcoat: 0.45, clearcoatRoughness: 0.25,
    envMapIntensity: 0.8,
  });

  const seedMat = new THREE.MeshPhysicalMaterial({ color: 0xe9d5a0, roughness: 0.6, sheen: 0.4 });
  const plateMat = new THREE.MeshPhysicalMaterial({
    color: 0xefe9dd, roughness: 0.22, clearcoat: 0.9, clearcoatRoughness: 0.12,
    envMapIntensity: 0.8,
  });

  const group = new THREE.Group();
  scene.add(group);
  group.rotation.y = 0.5;

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.9, 0.14, 64), plateMat);
  plate.position.y = -2.6;
  plate.receiveShadow = true;
  group.add(plate);

  // small organic jitter so nothing reads as a perfect lathe primitive.
  // noise is hashed from vertex POSITION (not index) so the duplicated
  // vertices along the UV seam displace identically: no seam crack
  function roughen(g: THREE.BufferGeometry, amp: number) {
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      const n = 1 + (h - Math.floor(h) - 0.5) * amp;
      pos.setXYZ(i, x * n, y * n, z * n);
    }
    g.computeVertexNormals();
    return g;
  }

  function ruffledDisc(rOut: number, h: number, mat: THREE.Material, waves = 9, amp = 0.09, droop = 0) {
    const g = new THREE.CylinderGeometry(rOut, rOut * 0.96, h, 96, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r > rOut * 0.7) {
        const a = Math.atan2(z, x);
        const edge = (r - rOut * 0.7) / (rOut * 0.3); // 0 inner -> 1 rim
        pos.setY(
          i,
          pos.getY(i)
            + (Math.sin(a * waves) * amp + Math.sin(a * waves * 3.7) * amp * 0.35) * edge
            - droop * edge * edge // leaf edge hangs down instead of sitting flat
        );
        const s = 1 + Math.sin(a * waves * 2) * 0.04 + Math.sin(a * waves * 5.3) * 0.02;
        pos.setX(i, x * s);
        pos.setZ(i, z * s);
      }
    }
    g.computeVertexNormals();
    return new THREE.Mesh(g, mat);
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
    roughen(new THREE.SphereGeometry(1.5, 48, 28, 0, Math.PI * 2, 0, Math.PI / 2), 0.024),
    bunMat
  );
  topBun.scale.y = 0.8;
  bunGroup.add(topBun);
  const bunCap = new THREE.Mesh(new THREE.CircleGeometry(1.49, 48), crumbMat);
  bunCap.rotation.x = Math.PI / 2;
  bunCap.position.y = -0.01;
  bunGroup.add(bunCap);
  for (let i = 0; i < 11; i++) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), seedMat);
    const a = (i / 11) * Math.PI * 2 + i * 0.7;
    const t = 0.2 + (((i * 37) % 53) / 53) * 0.6;
    seed.position.set(Math.cos(a) * 1.5 * Math.sin(t), 1.16 * Math.cos(t), Math.sin(a) * 1.5 * Math.sin(t));
    seed.scale.set(1, 0.6, 0.75);
    seed.lookAt(seed.position.clone().multiplyScalar(2));
    bunGroup.add(seed);
  }
  addLayer(bunGroup, -0.18, 2.95);

  // two frilly leaves, offset, so the lettuce has volume instead of one flat disc
  const lettuce = new THREE.Group();
  lettuce.add(ruffledDisc(1.62, 0.08, lettuceMat, 9, 0.13, 0.22));
  const leaf2 = ruffledDisc(1.5, 0.08, lettuceMat, 12, 0.11, 0.16);
  leaf2.rotation.y = 0.45;
  leaf2.position.y = 0.06;
  lettuce.add(leaf2);
  addLayer(lettuce, -0.52, 1.85);

  // melted slice: edges droop the further they hang past the patty
  const cheeseGeo = new THREE.BoxGeometry(2.45, 0.09, 2.45, 12, 1, 12);
  {
    const pos = cheeseGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const d = Math.max(Math.abs(x), Math.abs(z));
      if (d > 0.95) {
        const hang = (d - 0.95) / 0.275;
        pos.setY(i, pos.getY(i) - hang * hang * (0.16 + Math.abs(Math.sin(x * 5.1 + z * 3.7)) * 0.08));
      }
    }
    cheeseGeo.computeVertexNormals();
  }
  const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheese.rotation.y = Math.PI / 4.6;
  addLayer(cheese, -0.72, 0.95);

  addLayer(
    new THREE.Mesh(
      roughen(new THREE.CylinderGeometry(1.38, 1.42, 0.46, 64), 0.045),
      [pattySideMat, pattyCapMat, pattyCapMat]
    ),
    -1.0, 0.0
  );
  // tomato slices are smooth, not ruffled; slight jitter keeps it organic
  addLayer(
    new THREE.Mesh(
      roughen(new THREE.CylinderGeometry(1.44, 1.41, 0.13, 64), 0.035),
      [tomatoSkinMat, tomatoFleshMat, tomatoFleshMat]
    ),
    -1.28, -0.95
  );
  addLayer(
    new THREE.Mesh(roughen(new THREE.CylinderGeometry(1.46, 1.34, 0.5, 64), 0.025), botBunMat),
    -1.62, -1.95
  );

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
