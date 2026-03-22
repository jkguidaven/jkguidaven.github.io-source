(function () {
  var canvas = document.getElementById("hero-particles");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var hero = canvas.closest(".hero-section");
  var particles = [];
  var mouse = { x: 0, y: 0 };
  var isPressed = false;
  var isVisible = true;
  var animId = null;
  var PARTICLE_COUNT = 35;
  var IDLE_COUNT = 12;
  var COLOR_STR = "160,155,148";
  var resizeTimer = null;

  // Only animate when hero is in viewport
  var visObserver = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0 });
  visObserver.observe(hero);

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].isIdle) {
        particles[i].wanderX = Math.random() * canvas.width;
        particles[i].wanderY = Math.random() * canvas.height;
      }
    }
  }

  function createParticle(index) {
    var side = Math.floor(Math.random() * 4);
    var x, y;
    var w = canvas.width || 800;
    var h = canvas.height || 600;

    if (side === 0) { x = -20; y = Math.random() * h; }
    else if (side === 1) { x = w + 20; y = Math.random() * h; }
    else if (side === 2) { x = Math.random() * w; y = -20; }
    else { x = Math.random() * w; y = h + 20; }

    var isIdle = index < IDLE_COUNT;

    return {
      x: isIdle ? Math.random() * w : x,
      y: isIdle ? Math.random() * h : y,
      homeX: x,
      homeY: y,
      size: 1.5 + Math.random() * 4,
      opacity: 0,
      vx: 0,
      vy: 0,
      friction: 0.85 + Math.random() * 0.1,
      springSpeed: 0.002 + Math.random() * 0.015,
      offset: Math.random() * Math.PI * 2,
      orbitRadius: 20 + Math.random() * 60,
      isIdle: isIdle,
      wanderX: Math.random() * w,
      wanderY: Math.random() * h,
      wanderSpeed: 0.003 + Math.random() * 0.008,
      wanderTimer: Math.random() * 500,
      idleOpacity: 0.15 + Math.random() * 0.25
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(i));
    }
    loop();
  }

  function loop() {
    if (!isVisible) {
      animId = null;
      return;
    }

    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var now = Date.now();
    var hasVisible = false;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var targetX, targetY;

      if (isPressed) {
        var angle = p.offset + now * 0.001 * (0.5 + i * 0.05);
        targetX = mouse.x + Math.cos(angle) * p.orbitRadius;
        targetY = mouse.y + Math.sin(angle) * p.orbitRadius;
        p.opacity += (1 - p.opacity) * 0.03;
      } else if (p.isIdle) {
        p.wanderTimer += 1;
        if (p.wanderTimer > 300) {
          p.wanderX = 50 + Math.random() * (w - 100);
          p.wanderY = 50 + Math.random() * (h - 100);
          p.wanderTimer = Math.random() * -100;
        }
        targetX = p.wanderX;
        targetY = p.wanderY;
        p.opacity += (p.idleOpacity - p.opacity) * 0.02;
      } else {
        targetX = p.homeX;
        targetY = p.homeY;
        p.opacity *= 0.96;
      }

      var dx = targetX - p.x;
      var dy = targetY - p.y;
      var speed = p.isIdle && !isPressed ? p.wanderSpeed : p.springSpeed;
      p.vx = (p.vx + dx * speed) * p.friction;
      p.vy = (p.vy + dy * speed) * p.friction;
      p.x += p.vx;
      p.y += p.vy;

      if (p.opacity > 0.01) {
        hasVisible = true;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 6.2832);
        ctx.fill();
      }
    }

    // Set fill once outside loop
    ctx.fillStyle = "rgb(" + COLOR_STR + ")";
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(loop);
  }

  // Pre-set fill style
  ctx.fillStyle = "rgb(" + COLOR_STR + ")";

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var src = e.touches ? e.touches[0] : e;
    mouse.x = src.clientX - rect.left;
    mouse.y = src.clientY - rect.top;
  }

  hero.addEventListener("mousedown", function (e) {
    isPressed = true;
    getPos(e);
    canvas.style.pointerEvents = "auto";
  });

  window.addEventListener("mousemove", function (e) {
    if (isPressed) getPos(e);
  }, { passive: true });

  window.addEventListener("mouseup", function () {
    isPressed = false;
    canvas.style.pointerEvents = "none";
  });

  hero.addEventListener("touchstart", function (e) {
    isPressed = true;
    getPos(e);
    canvas.style.pointerEvents = "auto";
  }, { passive: true });

  hero.addEventListener("touchmove", function (e) {
    if (isPressed) getPos(e);
  }, { passive: true });

  hero.addEventListener("touchend", function () {
    isPressed = false;
    canvas.style.pointerEvents = "none";
  });

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
