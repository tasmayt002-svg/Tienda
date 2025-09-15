// particula.js
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, DPR = window.devicePixelRatio || 1;
  let particles = [];
  const config = {
    particleCount: Math.floor(Math.min(window.innerWidth, 1400) / 16), // antes /28 → ahora más partículas
    maxVelocity: 0.35,
    maxRadius: 1.8,          // un poco más grandes
    linkDistance: 140,       // un poquito más de distancia para conectar
    lineWidth: 1,
    particleColor: getComputedStyle(document.documentElement).getPropertyValue('--particle-color') || 'rgba(34,34,34,0.12)',
    lineColor: getComputedStyle(document.documentElement).getPropertyValue('--line-color') || 'rgba(34,34,34,0.08)'
};


  // Respeta preferencia por reducir movimiento
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initParticles();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    particles = [];
    const count = config.particleCount;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: reduceMotion ? 0 : rand(-config.maxVelocity, config.maxVelocity),
        vy: reduceMotion ? 0 : rand(-config.maxVelocity, config.maxVelocity),
        r: rand(0.6, config.maxRadius)
      });
    }
  }

  function update() {
    if (!reduceMotion) {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // dibujar líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.linkDistance) {
          const alpha = 1 - dist / config.linkDistance; // lineal fade
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineWidth = config.lineWidth * alpha;
          // mezcla el color con alpha según la distancia (muy sutil)
          ctx.strokeStyle = applyAlpha(config.lineColor, alpha * 0.85);
          ctx.stroke();
        }
      }
    }

    // dibujar partículas (puntos)
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = config.particleColor;
      ctx.fill();
    }
  }

  // aplica alpha a color rgba/hex — si es rgba, lo mezcla; si no, intenta hex -> rgba simple
  function applyAlpha(color, a) {
    color = color.trim();
    if (color.startsWith('rgba')) {
      // rgba(r,g,b,x)
      return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, (m,r,g,b,oldA) => {
        return 'rgba(' + r.trim() + ',' + g.trim() + ',' + b.trim() + ',' + (a).toFixed(3) + ')';
      });
    } else if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', ',' + a + ')');
    } else if (color[0] === '#') {
      // Convert hex to rgb
      const c = hexToRgb(color);
      if (c) return `rgba(${c.r},${c.g},${c.b},${a})`;
    }
    // fallback: use rgba gray
    return `rgba(34,34,34,${a})`;
  }

  function hexToRgb(hex) {
    // #abc or #aabbcc
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  let rafId;
  function animate() {
    update();
    draw();
    rafId = requestAnimationFrame(animate);
  }

  // pausa animación si página no está visible (ahorra CPU)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else {
      if (!rafId) animate();
    }
  });

  // iniciar
  resize();
  animate();

  // re-ajustar al cambiar tamaño
  window.addEventListener('resize', function () {
    // debounce sencillo
    clearTimeout(window._bgResizeTimer);
    window._bgResizeTimer = setTimeout(resize, 120);
  });

  // Opcional: expositor para cambiar parámetros desde consola (solo si lo necesitas)
  window.__bgParticles = {
    config,
    particles
  };
})();