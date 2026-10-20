// Mockup K: headline load-in, the fanned project wheel, and the page color that follows it.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ------------------------------------------------------------------ */
  /* Headline: split the two caps lines into letters so they can rise.   */
  /* ------------------------------------------------------------------ */
  let n = 0;
  const letters = [];
  document.querySelectorAll('[data-split]').forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'w';
      for (const ch of word) {
        const c = document.createElement('span');
        c.className = 'c';
        c.style.setProperty('--i', n++);
        const ci = document.createElement('span');
        ci.className = 'ci';
        ci.textContent = ch;
        c.appendChild(ci);
        w.appendChild(c);
        letters.push(ci);
      }
      line.appendChild(w);
      if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });

  // Start the load-in once the display font is ready, so the letters never jump between fonts.
  let started = false;
  const start = () => { if (!started) { started = true; root.classList.add('go'); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start, 1400);

  // Letters near the pointer lift a little and pick up the accent color.
  const hero = document.querySelector('.hero');
  if (finePointer && !reduce && hero) {
    let boxes = [];
    const measureLetters = () => { boxes = letters.map((el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY]; }); };
    let measured = false;
    hero.addEventListener('pointermove', (e) => {
      if (!measured) { measureLetters(); measured = true; }
      const x = e.clientX + scrollX, y = e.clientY + scrollY;
      letters.forEach((el, i) => {
        const d = Math.hypot(boxes[i][0] - x, boxes[i][1] - y);
        const f = Math.max(0, 1 - d / 170);
        el.style.setProperty('--f', f.toFixed(3));
        el.classList.toggle('hot', f > .45);
      });
    });
    hero.addEventListener('pointerleave', () => letters.forEach((el) => { el.style.setProperty('--f', 0); el.classList.remove('hot'); }));
    addEventListener('resize', () => { measured = false; });
  }

  /* ------------------------------------------------------------------ */
  /* Color: blend accent and background between projects in OKLCH.       */
  /* ------------------------------------------------------------------ */
  const THEMES = [
    // The glow is a saturated version of the background hue, never the accent itself:
    // acid or amber light over a dark base turns olive and brown.
    { accent: '#F4B183', bg: '#101B33', bg2: '#182A4D', glow: '#2B4FA8' }, // support content: acid on plum
    { accent: '#9CC3E6', bg: '#14233F', bg2: '#1B3260', glow: '#2F63B8' }, // Slick Bets: magenta on grape
    { accent: '#B6D0A0', bg: '#16282F', bg2: '#1C3A3A', glow: '#2F7A66' }, // auction draft: amber on indigo
  ];
  const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  function hexToLab(hex) {
    const v = parseInt(hex.slice(1), 16);
    const r = toLin(((v >> 16) & 255) / 255), g = toLin(((v >> 8) & 255) / 255), b = toLin((v & 255) / 255);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  }
  function labToRgb([L, a, b]) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    return 'rgb(' + rgb.map((c) => Math.round(255 * clamp(toGam(clamp(c, 0, 1)), 0, 1))).join(' ') + ')';
  }
  // Accents travel around the hue wheel (so acid to magenta passes through amber, never through grey).
  function mixLch(A, B, t) {
    const ca = Math.hypot(A[1], A[2]), cb = Math.hypot(B[1], B[2]);
    const ha = Math.atan2(A[2], A[1]); let hb = Math.atan2(B[2], B[1]);
    let dh = hb - ha; if (dh > Math.PI) dh -= 2 * Math.PI; if (dh < -Math.PI) dh += 2 * Math.PI;
    const L = A[0] + (B[0] - A[0]) * t, C = ca + (cb - ca) * t, h = ha + dh * t;
    return [L, C * Math.cos(h), C * Math.sin(h)];
  }
  const mixLab = (A, B, t) => A.map((v, i) => v + (B[i] - v) * t);
  const LABS = THEMES.map((th) => ({ a: hexToLab(th.accent), b: hexToLab(th.bg), b2: hexToLab(th.bg2), g: hexToLab(th.glow) }));
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let lastKey = '';
  function paint(pos) {
    const P = THEMES.length;
    const p = ((pos % P) + P) % P;
    const i = Math.floor(p) % P, j = (i + 1) % P, k = (j + 1) % P;
    let t = p - Math.floor(p);
    t = t * t * (3 - 2 * t); // hold each project's color near the middle, blend in between
    const accent = labToRgb(mixLch(LABS[i].a, LABS[j].a, t));
    const accent2 = labToRgb(mixLch(LABS[j].a, LABS[k].a, t));
    const bg = labToRgb(mixLab(LABS[i].b, LABS[j].b, t));
    const bg2 = labToRgb(mixLab(LABS[i].b2, LABS[j].b2, t));
    const glow = labToRgb(mixLch(LABS[i].g, LABS[j].g, t));
    const key = accent + bg;
    if (key === lastKey) return;
    lastKey = key;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-2', accent2);
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--bg-2', bg2);
    root.style.setProperty('--glow', glow);
    if (themeMeta) themeMeta.content = bg;
  }

  /* ------------------------------------------------------------------ */
  /* The wheel.                                                          */
  /* ------------------------------------------------------------------ */
  const stage = document.querySelector('.stage');
  const ring = stage && stage.querySelector('.ring');
  if (!ring) return;
  const originals = [...ring.children];
  const P = originals.length;
  // Twins fill the far side of the wheel so it can wrap forever. They are hidden from screen readers.
  originals.forEach((card) => {
    const twin = card.cloneNode(true);
    twin.setAttribute('aria-hidden', 'true');
    twin.removeAttribute('aria-roledescription');
    twin.removeAttribute('aria-label');
    ring.appendChild(twin);
  });
  const cards = [...ring.children];
  const N = cards.length;

  const pill = document.getElementById('pill');
  const pillStatus = document.getElementById('pill-status');
  const pillTitle = document.getElementById('pill-title');
  const scoreNow = document.getElementById('score-now');
  const live = document.getElementById('live');
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor && cursor.querySelector('.cursor-label');

  let pos = 0, vel = 0, target = 0;
  let mode = 'idle'; // idle | drag | spring
  let spread = reduce ? 1 : 0; // 0 = cards stacked like a deck, 1 = fanned out
  let deal = null; // the fan-out animation, run once when the wheel scrolls into view
  let unit = 460, cw = 452;
  let active = -1;
  let userMoved = false;
  let raf = 0, last = 0;

  function measure() {
    cw = ring.offsetWidth;
    unit = cw * (innerWidth < 760 ? 0.98 : 1.07);
    ring.style.perspective = (innerWidth < 760 ? 900 : 1500) + 'px';
  }

  function place(card, d, i) {
    const a = Math.abs(d), sg = Math.sign(d), S = spread;
    const x = sg * unit * (a - 0.06 * a * a) * S;
    const y = a * a * cw * 0.05 * S;
    const z = -a * cw * 0.32 * S;
    const ry = clamp(d, -2.4, 2.4) * 17 * S;
    const rz = d * 4.2 * S + (1 - S) * (i % 2 ? 1 : -1) * (2 + i * 0.6);
    const sc = 1 - Math.min(a, 2.6) * 0.1 * S;
    const op = a < 2.05 ? 1 : Math.max(0, 1 - (a - 2.05) / 0.5);
    card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    card.style.opacity = op.toFixed(3);
    card.style.zIndex = String(100 - Math.round(a * 10));
    // Only cards past the first neighbors sink into the page, so the neighbors keep their true color.
    card.style.setProperty('--dim', (clamp(a - 1, 0, 1) * 0.55 * S + (a > 0.5 ? (1 - S) * 0.35 : 0)).toFixed(3));
    card.style.visibility = op <= 0.001 ? 'hidden' : 'visible';
  }

  function render() {
    for (let i = 0; i < N; i++) {
      let d = (((i - pos) % N) + N) % N;
      if (d > N / 2) d -= N;
      place(cards[i], d, i);
    }
    paint(pos);
    const idx = ((Math.round(pos) % N) + N) % N;
    const p = idx % P;
    if (p !== active) setActive(p);
  }

  function setActive(p) {
    const first = active === -1;
    active = p;
    const card = originals[p];
    pillStatus.textContent = card.dataset.status;
    pillTitle.textContent = card.dataset.title;
    pill.href = card.dataset.href || '#';
    pill.setAttribute('aria-label', `Read the case study: ${card.dataset.title}`);
    scoreNow.textContent = String(p + 1).padStart(2, '0');
    if (!first && !reduce) {
      for (const el of [pillStatus, pillTitle, scoreNow]) { el.classList.remove('swap', 'flip'); void el.offsetWidth; }
      pillStatus.classList.add('swap'); pillTitle.classList.add('swap'); scoreNow.classList.add('flip');
    }
    if (userMoved) live.textContent = `${card.dataset.title}. ${card.dataset.status}. Project ${p + 1} of ${P}.`;
  }

  const easeOut = (t) => 1 - Math.pow(1 - t, 4);
  function tick(now) {
    raf = 0;
    const dt = Math.min(0.034, (now - last) / 1000 || 0.016);
    last = now;
    let busy = false;
    if (deal) {
      const t = clamp((now - deal.t0) / deal.dur, 0, 1);
      spread = easeOut(t);
      if (mode === 'idle') pos = deal.from * (1 - easeOut(t));
      if (t >= 1) deal = null; else busy = true;
    }
    if (mode === 'spring') {
      const k = 130, c = 20.5; // a touch under critical damping, so it settles with a tiny overshoot
      const acc = k * (target - pos) - c * vel;
      vel += acc * dt;
      pos += vel * dt;
      if (Math.abs(target - pos) < 0.0005 && Math.abs(vel) < 0.003) { pos = target; vel = 0; mode = 'idle'; }
      else busy = true;
    }
    render();
    if (busy) kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function settle(v = 0) {
    vel = v;
    target = Math.round(pos + v * 0.2);
    if (reduce) { pos = target; vel = 0; mode = 'idle'; render(); return; }
    mode = 'spring';
    kick();
  }
  function go(step) {
    userMoved = true;
    deal = null; spread = 1;
    const base = mode === 'spring' ? target : Math.round(pos);
    target = base + step;
    if (reduce) { pos = target; mode = 'idle'; render(); return; }
    mode = 'spring';
    kick();
  }

  // Drag and swipe, with momentum on release.
  let drag = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    deal = null; spread = 1;
    drag = { id: e.pointerId, x0: e.clientX, p0: pos, moved: false, pts: [[e.clientX, e.timeStamp]] };
    mode = 'drag'; vel = 0;
    try { stage.setPointerCapture(e.pointerId); } catch { /* the pointer was already released */ }
    stage.classList.add('is-grabbing');
    cursor && cursor.classList.add('down');
  });
  stage.addEventListener('pointermove', (e) => {
    if (cursor && finePointer) { cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`; }
    if (!drag || e.pointerId !== drag.id) { hoverLabel(e); return; }
    const dx = e.clientX - drag.x0;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; userMoved = true; }
    pos = drag.p0 - dx / unit;
    drag.pts.push([e.clientX, e.timeStamp]);
    if (drag.pts.length > 6) drag.pts.shift();
    kick();
  });
  function release(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const pts = drag.pts, a = pts[0], b = pts[pts.length - 1];
    const span = (b[1] - a[1]) / 1000;
    let v = span > 0 ? -(b[0] - a[0]) / unit / span : 0;
    if (e.timeStamp - b[1] > 90) v = 0; // the finger paused before letting go
    v = clamp(v, -14, 14);
    const click = !drag.moved && e.type === 'pointerup';
    drag = null;
    stage.classList.remove('is-grabbing');
    cursor && cursor.classList.remove('down');
    if (click) { mode = 'idle'; onClick(e); return; }
    settle(v);
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  function dOf(el) {
    const i = cards.indexOf(el);
    let d = (((i - pos) % N) + N) % N;
    if (d > N / 2) d -= N;
    return d;
  }
  function onClick(e) {
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const card = hit && hit.closest('.card');
    if (!card) { settle(); return; }
    const d = dOf(card);
    if (Math.abs(d) < 0.5) { settle(); pill.click(); return; } // the middle card opens its case study
    userMoved = true;
    target = Math.round(pos + d);
    if (reduce) { pos = target; mode = 'idle'; render(); return; }
    mode = 'spring'; kick();
  }

  // Trackpad sideways swipes turn the wheel. Plain vertical scrolling passes through to the page.
  let wheelTimer = 0;
  stage.addEventListener('wheel', (e) => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!dx) return;
    e.preventDefault();
    userMoved = true; deal = null; spread = 1;
    mode = 'drag'; vel = 0;
    pos += (dx * (e.deltaMode === 1 ? 18 : 1)) / unit;
    kick();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => settle(), 130);
  }, { passive: false });

  // Keyboard and buttons.
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Enter') { pill.click(); }
  });
  document.querySelectorAll('.arrow[data-step]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.step))));
  pill.addEventListener('click', (e) => { if (pill.getAttribute('href') === '#') e.preventDefault(); });

  // The drag cursor: "Drag" over the wheel, "Open" over the middle card.
  function hoverLabel(e) {
    if (!cursorLabel) return;
    const card = e.target.closest && e.target.closest('.card');
    cursorLabel.textContent = card && Math.abs(dOf(card)) < 0.5 ? 'Open' : 'Drag';
  }
  if (cursor && finePointer) {
    stage.addEventListener('pointerenter', (e) => { cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`; cursor.classList.add('on'); });
    stage.addEventListener('pointerleave', () => cursor.classList.remove('on', 'down'));
  }

  // Deal the cards out of a stack the first time the wheel scrolls into view.
  measure();
  render();
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      io.disconnect();
      if (spread >= 1) return;
      deal = { t0: performance.now() + 120, dur: 1500, from: -0.35 };
      last = performance.now();
      kick();
    }, { threshold: 0.3 });
    io.observe(stage);
  } else {
    spread = 1; render();
  }

  addEventListener('resize', () => { measure(); render(); });

  /* ------------------------------------------------------------------ */
  /* Scroll reveals and the copy button.                                 */
  /* ------------------------------------------------------------------ */
  if (!reduce && 'IntersectionObserver' in window) {
    const groups = new Map();
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        rio.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.rv').forEach((el) => {
      // Siblings that reveal together get a small stagger.
      const parent = el.parentElement;
      const k = (groups.get(parent) || 0);
      groups.set(parent, k + 1);
      el.style.setProperty('--d', `${Math.min(k, 6) * 70}ms`);
      rio.observe(el);
    });
  } else {
    document.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));
  }

  document.querySelectorAll('button[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copied'; }
      catch { btn.textContent = 'Press Cmd+C to copy'; }
      setTimeout(() => { btn.textContent = 'Copy email'; }, 2000);
    });
  });
})();
