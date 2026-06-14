/* RaumDesign Rudek — 3D-Zylinder-Karussell (wiederverwendbar)
   Verwendung:
     RDCarousel.init({
       stage: '#czStage',            // Mount-Element (CSS-Selektor oder Element)
       base:  '../assets/img/',      // Bild-Basispfad
       images: [['slug','Alt-Text'], ...],
       prevBtn: el, nextBtn: el,     // optional
       options: { wheel:false, autoplay:0.05, brightnessBack:0.5, maxBlur:6, ... }
     });
*/
(function () {
  const DEFAULTS = {
    autoplay: 0.05,      // Grad/Frame sanfte Dauerrotation (0 = aus)
    wheel: false,        // Mausrad dreht (true blockiert Seitenscroll im Hero-Bereich)
    friction: 0.945,     // Trägheit der vom Nutzer erzeugten Drehung
    dragSens: 0.26,      // Ziehen (px) -> Grad
    wheelSens: 0.02,
    maxVel: 13,
    centrifuge: 0.05,    // |v| -> Anteil Radius-Aufweitung (Zentrifugal-Wölbung)
    centriMax: 0.30,
    maxBlur: 6,          // px Tiefenunschärfe am Rand
    brightnessBack: 0.5, // Helligkeit ganz hinten (1 = keine Abdunklung)
    rotX: -3,            // leichte Aufsicht
    yoff: [-0.92, 0.5, -0.3, 0.88, -0.66, 0.18, -1.0, 0.62, -0.12, 0.8, -0.48, 0.34]
  };

  function init(opts) {
    const stage = typeof opts.stage === 'string' ? document.querySelector(opts.stage) : opts.stage;
    if (!stage) return null;
    const cfg = Object.assign({}, DEFAULTS, opts.options || {});
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IMAGES = opts.images;
    const N = IMAGES.length, STEP = 360 / N;
    const base = opts.base || '';

    // --- Panels ---
    const cyl = document.createElement('div');
    cyl.className = 'cz-cyl';
    stage.appendChild(cyl);
    const panels = IMAGES.map((im, i) => {
      const fig = document.createElement('figure');
      fig.className = 'cz-panel';
      fig.style.setProperty('--cz-angle', (i * STEP) + 'deg');
      fig.style.setProperty('--cz-yf', cfg.yoff[i % cfg.yoff.length]);
      fig.innerHTML = `<img src="${base}${im[0]}.jpg" alt="${im[1]}" draggable="false" loading="${i < 4 ? 'eager' : 'lazy'}">`
                    + `<figcaption>${im[1]}</figcaption>`;
      cyl.appendChild(fig);
      return { el: fig, img: fig.querySelector('img'), angle: i * STEP };
    });

    // --- Lightbox (einmal pro Instanz, an body) ---
    const lb = document.createElement('div');
    lb.className = 'cz-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Bild in voller Größe');
    lb.innerHTML = `<button class="cz-lb-x" aria-label="Schließen">✕</button>`
                 + `<button class="cz-lb-prev" aria-label="Vorheriges Bild">‹</button>`
                 + `<button class="cz-lb-next" aria-label="Nächstes Bild">›</button>`
                 + `<img alt=""><div class="cz-lb-cap"></div>`;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.cz-lb-cap');
    let lbI = 0;
    function renderLB() { lbImg.src = `${base}${IMAGES[lbI][0]}.jpg`; lbImg.alt = IMAGES[lbI][1]; lbCap.textContent = IMAGES[lbI][1]; }
    function openLB(i) { lbI = i; renderLB(); lb.classList.add('cz-open'); vel = 0; }
    function closeLB() { lb.classList.remove('cz-open'); }
    function stepLB(d) { lbI = (lbI + d + N) % N; renderLB(); }
    lb.querySelector('.cz-lb-x').addEventListener('click', closeLB);
    lb.querySelector('.cz-lb-prev').addEventListener('click', e => { e.stopPropagation(); stepLB(-1); });
    lb.querySelector('.cz-lb-next').addEventListener('click', e => { e.stopPropagation(); stepLB(1); });
    lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('cz-open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowRight') stepLB(1);
      if (e.key === 'ArrowLeft') stepLB(-1);
    });

    // --- Geometrie ---
    let baseRadius = 460;
    function measure() {
      const pw = panels[0].el.offsetWidth || 220;
      baseRadius = Math.round((pw / 2) / Math.tan(Math.PI / N));
      cyl.style.setProperty('--cz-radius', baseRadius + 'px');
      stage.style.setProperty('--cz-persp', Math.round(baseRadius * 2.35) + 'px');
    }
    measure();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });

    // --- Zustand & Eingaben ---
    let rot = 0, vel = REDUCED ? 0 : 6, lastInput = performance.now();
    let dragging = false, lastX = 0, downX = 0, downY = 0, moved = false;

    stage.addEventListener('pointerdown', e => {
      if (lb.classList.contains('cz-open')) return;
      dragging = true; lastX = downX = e.clientX; downY = e.clientY; moved = false;
      vel = 0; try { stage.setPointerCapture(e.pointerId); } catch (_) {} lastInput = performance.now();
    });
    stage.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX;
      if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) moved = true;
      rot += dx * cfg.dragSens; vel = dx * cfg.dragSens; lastInput = performance.now();
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false; try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!moved) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const fig = el && el.closest && el.closest('.cz-panel');
        if (fig) { const idx = panels.findIndex(p => p.el === fig); if (idx >= 0) openLB(idx); }
      }
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    if (cfg.wheel) {
      stage.addEventListener('wheel', e => {
        if (lb.classList.contains('cz-open')) return;
        e.preventDefault();
        let d = e.deltaY;
        if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= 400;
        vel += d * cfg.wheelSens;
        vel = Math.max(-cfg.maxVel, Math.min(cfg.maxVel, vel));
        lastInput = performance.now();
      }, { passive: false });
    }
    if (opts.prevBtn) opts.prevBtn.addEventListener('click', () => { vel -= 4.5; lastInput = performance.now(); });
    if (opts.nextBtn) opts.nextBtn.addEventListener('click', () => { vel += 4.5; lastInput = performance.now(); });

    // --- Render-Loop ---
    const mod = (a, m) => ((a % m) + m) % m;
    function frame() {
      if (!dragging) {
        if (!REDUCED && !lb.classList.contains('cz-open')) rot += cfg.autoplay; // sanfte Dauerrotation
        rot += vel;
        vel *= cfg.friction;
        if (Math.abs(vel) < 0.0008) vel = 0;
      }
      const bulge = Math.min(Math.abs(vel) * cfg.centrifuge, cfg.centriMax);
      cyl.style.setProperty('--cz-radius', Math.round(baseRadius * (1 + bulge)) + 'px');
      cyl.style.transform = `rotateX(${cfg.rotX}deg) rotateY(${rot}deg)`;

      let fi = 0, fd = 999;
      for (let i = 0; i < panels.length; i++) {
        const p = panels[i];
        const w = mod(p.angle + rot, 360);
        const dist = w > 180 ? 360 - w : w;       // 0 = vorne, 180 = hinten
        if (dist < fd) { fd = dist; fi = i; }
        const tc = Math.min(dist, 90) / 90;
        const blur = (tc * tc) * cfg.maxBlur;
        const bright = 1 - (dist / 180) * (1 - cfg.brightnessBack);
        p.img.style.filter = `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`;
      }
      for (let i = 0; i < panels.length; i++) panels[i].el.classList.toggle('cz-focus', i === fi);
      requestAnimationFrame(frame);
    }

    stage.classList.add('cz-ready');
    frame();   // erster Frame synchron -> korrektes Erstbild auch wenn Tab (noch) versteckt ist
    return { openLB, closeLB };
  }

  window.RDCarousel = { init };
})();
