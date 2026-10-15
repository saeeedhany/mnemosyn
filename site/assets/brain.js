(() => {
  const REGIONS = [
    ['Superior frontal gyrus', 'frontal', [-0.42, 0.45, 0.55], [0.34, 0.38, 0.42], 'L'],
    ['Superior frontal gyrus', 'frontal', [0.42, 0.45, 0.55], [0.34, 0.38, 0.42], 'R'],
    ['Middle frontal gyrus', 'frontal', [-0.55, 0.1, 0.55], [0.28, 0.34, 0.4], 'L'],
    ['Middle frontal gyrus', 'frontal', [0.55, 0.1, 0.55], [0.28, 0.34, 0.4], 'R'],
    ['Inferior frontal gyrus, triangular part', 'frontal', [-0.5, -0.2, 0.45], [0.24, 0.26, 0.32], 'L'],
    ['Inferior frontal gyrus, triangular part', 'frontal', [0.5, -0.2, 0.45], [0.24, 0.26, 0.32], 'R'],
    ['Precentral gyrus', 'frontal', [-0.58, 0.15, 0.05], [0.2, 0.45, 0.28], 'L'],
    ['Precentral gyrus', 'frontal', [0.58, 0.15, 0.05], [0.2, 0.45, 0.28], 'R'],
    ['Postcentral gyrus', 'parietal', [-0.6, 0.15, -0.3], [0.2, 0.44, 0.26], 'L'],
    ['Postcentral gyrus', 'parietal', [0.6, 0.15, -0.3], [0.2, 0.44, 0.26], 'R'],
    ['Superior parietal gyrus', 'parietal', [-0.4, 0.55, -0.35], [0.32, 0.3, 0.36], 'L'],
    ['Superior parietal gyrus', 'parietal', [0.4, 0.55, -0.35], [0.32, 0.3, 0.36], 'R'],
    ['Precuneus', 'parietal', [-0.22, 0.35, -0.55], [0.24, 0.32, 0.3], 'L'],
    ['Precuneus', 'parietal', [0.22, 0.35, -0.55], [0.24, 0.32, 0.3], 'R'],
    ['Superior temporal gyrus', 'temporal', [-0.62, -0.25, 0.05], [0.22, 0.24, 0.42], 'L'],
    ['Superior temporal gyrus', 'temporal', [0.62, -0.25, 0.05], [0.22, 0.24, 0.42], 'R'],
    ['Middle temporal gyrus', 'temporal', [-0.55, -0.5, -0.05], [0.24, 0.22, 0.38], 'L'],
    ['Middle temporal gyrus', 'temporal', [0.55, -0.5, -0.05], [0.24, 0.22, 0.38], 'R'],
    ['Middle occipital gyrus', 'occipital', [-0.35, 0.1, -0.8], [0.3, 0.38, 0.3], 'L'],
    ['Middle occipital gyrus', 'occipital', [0.35, 0.1, -0.8], [0.3, 0.38, 0.3], 'R'],
    ['Insula', 'subcortical', [-0.38, 0.0, 0.1], [0.16, 0.2, 0.22], 'L'],
    ['Insula', 'subcortical', [0.38, 0.0, 0.1], [0.16, 0.2, 0.22], 'R'],
    ['Thalamus', 'subcortical', [-0.14, 0.02, -0.1], [0.13, 0.15, 0.16], 'L'],
    ['Thalamus', 'subcortical', [0.14, 0.02, -0.1], [0.13, 0.15, 0.16], 'R'],
    ['Hippocampus', 'limbic', [-0.22, -0.28, -0.15], [0.11, 0.12, 0.24], 'L'],
    ['Hippocampus', 'limbic', [0.22, -0.28, -0.15], [0.11, 0.12, 0.24], 'R'],
    ['Amygdala', 'limbic', [-0.2, -0.18, 0.18], [0.1, 0.11, 0.11], 'L'],
    ['Amygdala', 'limbic', [0.2, -0.18, 0.18], [0.1, 0.11, 0.11], 'R'],
    ['Caudate nucleus', 'subcortical', [-0.16, 0.22, 0.1], [0.1, 0.16, 0.2], 'L'],
    ['Caudate nucleus', 'subcortical', [0.16, 0.22, 0.1], [0.1, 0.16, 0.2], 'R'],
    ['Cerebellum, lobule VI', 'cerebellum', [-0.32, -0.62, -0.55], [0.3, 0.24, 0.28], 'L'],
    ['Cerebellum, lobule VI', 'cerebellum', [0.32, -0.62, -0.55], [0.3, 0.24, 0.28], 'R'],
    ['Vermis, lobule VII', 'cerebellum', [0.0, -0.55, -0.6], [0.14, 0.18, 0.2], ''],
    ['Pons', 'brainstem', [0.0, -0.3, 0.05], [0.16, 0.18, 0.16], ''],
    ['Medulla oblongata', 'brainstem', [0.0, -0.55, -0.05], [0.12, 0.2, 0.13], ''],
    ['Midbrain', 'brainstem', [0.0, -0.1, -0.05], [0.13, 0.14, 0.13], ''],
  ].map(([name, system, c, r, side]) => {
    const center = c.slice();
    if (Math.abs(center[0]) < 0.45 && system !== 'brainstem') {
      center[0] += center[0] >= 0 ? 0.07 : -0.07;
    }
    return { name, system, side, center, radii: r, volume: r[0] * r[1] * r[2] };
  });

  const SYSTEMS = [
    ['frontal', 'Frontal'],
    ['parietal', 'Parietal'],
    ['temporal', 'Temporal'],
    ['occipital', 'Occipital'],
    ['subcortical', 'Subcortical'],
    ['limbic', 'Limbic'],
    ['cerebellum', 'Cerebellum'],
    ['brainstem', 'Brainstem'],
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function readColours() {
    const css = getComputedStyle(document.documentElement);
    const out = {};
    for (const [id] of SYSTEMS) {
      const raw = css.getPropertyValue(`--sys-${id}`).trim();
      const m = raw.match(/(\d+)\D+(\d+)\D+(\d+)/);
      out[id] = m ? [+m[1], +m[2], +m[3]] : [160, 160, 160];
    }
    out.ground = css.getPropertyValue('--slice-ground').trim() || '#2a2a2a';
    out.muted = css.getPropertyValue('--muted-foreground').trim() || '#a1a1a1';
    out.light = document.documentElement.dataset.theme === 'light';
    return out;
  }

  function label(region) {
    return region.side ? `${region.name} (${region.side})` : region.name;
  }

  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function initCloud(stage) {
    const canvas = stage.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const nameEl = stage.querySelector('[data-readout-name]');
    const sysEl = stage.querySelector('[data-readout-system]');
    const legend = stage.querySelector('[data-legend]');

    const DEEP = new Set(['subcortical', 'limbic', 'brainstem']);
    const inside = (x, y, z, r) => {
      const dx = (x - r.center[0]) / r.radii[0];
      const dy = (y - r.center[1]) / r.radii[1];
      const dz = (z - r.center[2]) / r.radii[2];
      return dx * dx + dy * dy + dz * dz < 0.97;
    };
    const rand = rng(27);
    const pts = [];
    REGIONS.forEach((reg, ri) => {
      const [rx, ry, rz] = reg.radii;
      const area = rx * ry + ry * rz + rx * rz;
      const n = Math.round(area * 1700) + 24;
      for (let i = 0; i < n; i++) {
        const u = rand() * 2 - 1;
        const phi = rand() * Math.PI * 2;
        const s = Math.sqrt(1 - u * u);
        const x = reg.center[0] + rx * s * Math.cos(phi);
        const y = reg.center[1] + ry * u;
        const z = reg.center[2] + rz * s * Math.sin(phi);
        const buried = REGIONS.some((o, oi) => oi !== ri && !DEEP.has(o.system) && inside(x, y, z, o));
        if (buried && !DEEP.has(reg.system)) continue;
        pts.push([x, y, z, ri, DEEP.has(reg.system) ? 1 : 0]);
      }
    });
    const proj = new Float32Array(pts.length * 3);

    let colours = readColours();
    let yaw = -1.25;
    let pitch = 0.22;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let hoverRegion = -1;
    let focusSystem = null;
    let pointer = null;
    let drag = null;
    let visible = true;
    let last = performance.now();
    let idleSince = 0;

    for (const [id, name] of SYSTEMS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span class="dot" style="color: var(--sys-${id})"></span>${name}`;
      b.addEventListener('click', () => {
        focusSystem = focusSystem === id ? null : id;
        for (const other of legend.children) other.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-pressed', String(focusSystem === id));
        updateReadout();
      });
      legend.appendChild(b);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    function updateReadout() {
      if (hoverRegion >= 0) {
        const reg = REGIONS[hoverRegion];
        nameEl.textContent = label(reg);
        sysEl.textContent = reg.system;
      } else if (focusSystem) {
        const count = REGIONS.filter((r) => r.system === focusSystem).length;
        nameEl.textContent = SYSTEMS.find((s) => s[0] === focusSystem)[1];
        sysEl.textContent = `${count} regions`;
      } else {
        nameEl.textContent = 'Point at a structure';
        sysEl.textContent = '36 regions · drag to rotate';
      }
    }

    function draw() {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const scale = Math.min(w, h) * 0.34;
      const camera = 4.5;
      const ox = w / 2;
      const oy = h * 0.48;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x1 = p[0] * cy + p[2] * sy;
        const z1 = -p[0] * sy + p[2] * cy;
        const y1 = p[1] * cp - z1 * sp;
        const z2 = p[1] * sp + z1 * cp;
        const k = camera / (camera - z2);
        proj[i * 3] = ox + x1 * scale * k;
        proj[i * 3 + 1] = oy - y1 * scale * k;
        proj[i * 3 + 2] = z2;
      }

      const anyFocus = hoverRegion >= 0 || focusSystem;
      for (let i = 0; i < pts.length; i++) {
        const ri = pts[i][3];
        const reg = REGIONS[ri];
        const z = proj[i * 3 + 2];
        const depth = (z + 1.1) / 2.2;
        const lit = ri === hoverRegion || (focusSystem && reg.system === focusSystem && hoverRegion < 0);
        let alpha = pts[i][4] ? 0.1 + depth * 0.25 : 0.12 + depth * 0.7;
        if (anyFocus) alpha = lit ? 0.95 : alpha * 0.22;
        const c = colours[reg.system];
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha.toFixed(3)})`;
        const size = (lit ? 2.1 : 1.35) + depth * 1.1;
        ctx.fillRect(proj[i * 3] - size / 2, proj[i * 3 + 1] - size / 2, size, size);
      }
    }

    function pick() {
      if (!pointer) return -1;
      let best = -1;
      let bestScore = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const dx = proj[i * 3] - pointer.x;
        const dy = proj[i * 3 + 1] - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 196) continue;
        const score = d2 - proj[i * 3 + 2] * 60;
        if (score < bestScore) {
          bestScore = score;
          best = pts[i][3];
        }
      }
      return best;
    }

    function frame(now) {
      const dt = Math.min(now - last, 50);
      last = now;
      if (visible) {
        const auto = !reducedMotion.matches && !drag && hoverRegion < 0 && now - idleSince > 1200;
        if (auto) yaw += dt * 0.00018;
        draw();
        const picked = drag ? -1 : pick();
        if (picked !== hoverRegion) {
          hoverRegion = picked;
          updateReadout();
        }
      }
      requestAnimationFrame(frame);
    }

    function local(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.addEventListener('pointerdown', (e) => {
      drag = { ...local(e), yaw, pitch };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      pointer = local(e);
      if (drag) {
        yaw = drag.yaw + (pointer.x - drag.x) * 0.008;
        pitch = Math.max(-1.2, Math.min(1.2, drag.pitch + (pointer.y - drag.y) * 0.006));
      }
      idleSince = performance.now();
    });
    canvas.addEventListener('pointerup', () => {
      drag = null;
      idleSince = performance.now();
    });
    canvas.addEventListener('pointerleave', () => {
      if (!drag) pointer = null;
    });

    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(stage);
    document.addEventListener('themechange', () => (colours = readColours()));
    resize();
    updateReadout();
    requestAnimationFrame(frame);
  }

  const PLANES = {
    axial: { range: [-0.8, 0.9], start: 0.05, edges: ['A', 'P', 'L', 'R'], name: 'Axial' },
    coronal: { range: [-1.05, 0.95], start: -0.1, edges: ['S', 'I', 'L', 'R'], name: 'Coronal' },
    sagittal: { range: [-0.9, 0.9], start: -0.3, edges: ['S', 'I', 'A', 'P'], name: 'Sagittal' },
  };

  function initSlices(root) {
    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const slider = root.querySelector('input[type=range]');
    const readout = root.querySelector('[data-slice-readout]');
    const hoverEl = root.querySelector('[data-slice-hover]');
    const buttons = root.querySelectorAll('[data-plane]');
    const sorted = REGIONS.map((r, i) => i).sort((a, b) => REGIONS[a].volume - REGIONS[b].volume);

    let plane = 'axial';
    let colours = readColours();
    let labels = null;
    const GW = 232;
    const GH = 160;

    function regionAt(x, y, z) {
      for (const i of sorted) {
        const r = REGIONS[i];
        const dx = (x - r.center[0]) / r.radii[0];
        const dy = (y - r.center[1]) / r.radii[1];
        const dz = (z - r.center[2]) / r.radii[2];
        if (dx * dx + dy * dy + dz * dz <= 1) return i;
      }
      return -1;
    }

    function world(u, v, t) {
      const a = (u / GW) * 2.5 - 1.25;
      const b = (v / GH) * 1.72 - 0.86;
      if (plane === 'axial') return [a, t, -b * 1.25];
      if (plane === 'coronal') return [a, -b * 1.1, t];
      return [t, -b * 1.1, -a];
    }

    function render() {
      const t = +slider.value;
      labels = new Int16Array(GW * GH);
      const img = ctx.createImageData(GW, GH);
      const ground = colours.light ? [232, 232, 232] : [38, 38, 38];
      for (let v = 0; v < GH; v++) {
        for (let u = 0; u < GW; u++) {
          const [x, y, z] = world(u, v, t);
          const ri = regionAt(x, y, z);
          labels[v * GW + u] = ri;
          const o = (v * GW + u) * 4;
          if (ri < 0) {
            img.data[o + 3] = 0;
            continue;
          }
          const c = colours[REGIONS[ri].system];
          const mix = 0.82;
          img.data[o] = ground[0] * (1 - mix) + c[0] * mix;
          img.data[o + 1] = ground[1] * (1 - mix) + c[1] * mix;
          img.data[o + 2] = ground[2] * (1 - mix) + c[2] * mix;
          img.data[o + 3] = 255;
        }
      }
      const off = document.createElement('canvas');
      off.width = GW;
      off.height = GH;
      off.getContext('2d').putImageData(img, 0, 0);

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, rect.width, rect.height);

      const p = PLANES[plane];
      ctx.fillStyle = colours.muted;
      ctx.font = '500 11px "Geist Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.edges[0], rect.width / 2, 12);
      ctx.fillText(p.edges[1], rect.width / 2, rect.height - 12);
      ctx.fillText(p.edges[2], 12, rect.height / 2);
      ctx.fillText(p.edges[3], rect.width - 12, rect.height / 2);

      readout.textContent = `${p.name} · ${t >= 0 ? '+' : ''}${(t * 90).toFixed(0)} mm`;
    }

    function setPlane(name) {
      plane = name;
      const p = PLANES[name];
      slider.min = p.range[0];
      slider.max = p.range[1];
      slider.value = p.start;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.plane === name)));
      render();
    }

    buttons.forEach((b) => b.addEventListener('click', () => setPlane(b.dataset.plane)));
    slider.addEventListener('input', render);
    canvas.addEventListener('pointermove', (e) => {
      if (!labels) return;
      const rect = canvas.getBoundingClientRect();
      const u = Math.floor(((e.clientX - rect.left) / rect.width) * GW);
      const v = Math.floor(((e.clientY - rect.top) / rect.height) * GH);
      const ri = labels[v * GW + u];
      hoverEl.textContent = ri >= 0 ? label(REGIONS[ri]) : 'Hover a label';
    });
    canvas.addEventListener('pointerleave', () => (hoverEl.textContent = 'Hover a label'));
    document.addEventListener('themechange', () => {
      colours = readColours();
      render();
    });
    new ResizeObserver(() => render()).observe(canvas);
    setPlane('axial');
  }

  document.querySelectorAll('[data-brain]').forEach(initCloud);
  document.querySelectorAll('[data-slices]').forEach(initSlices);
})();
