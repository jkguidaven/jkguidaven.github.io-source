(function () {
  var canvas = document.getElementById("hero-particles");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var hero = canvas.closest(".hero-section");
  var particles = [];
  var mouse = { x: 0, y: 0 };
  var isPressed = false;
  var PARTICLE_COUNT = 35;
  var IDLE_COUNT = 12; // how many wander when idle
  var COLOR = { r: 160, g: 155, b: 148 };

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    // Update idle wander positions on resize
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

    if (side === 0) { x = -20; y = Math.random() * canvas.height; }
    else if (side === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
    else if (side === 2) { x = Math.random() * canvas.width; y = -20; }
    else { x = Math.random() * canvas.width; y = canvas.height + 20; }

    var isIdle = index < IDLE_COUNT;

    return {
      x: isIdle ? Math.random() * canvas.width : x,
      y: isIdle ? Math.random() * canvas.height : y,
      homeX: x,
      homeY: y,
      size: 1.5 + Math.random() * 4,
      opacity: 0,
      targetOpacity: 1,
      vx: 0,
      vy: 0,
      friction: 0.85 + Math.random() * 0.1,
      springSpeed: 0.002 + Math.random() * 0.015,
      offset: Math.random() * Math.PI * 2,
      orbitRadius: 20 + Math.random() * 60,
      isIdle: isIdle,
      wanderX: Math.random() * (canvas.width || 800),
      wanderY: Math.random() * (canvas.height || 600),
      wanderSpeed: 0.003 + Math.random() * 0.008,
      wanderTimer: Math.random() * 1000,
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var now = Date.now();

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var targetX, targetY;

      if (isPressed) {
        // Gather toward cursor with orbit offset
        var angle = p.offset + now * 0.001 * (0.5 + i * 0.05);
        targetX = mouse.x + Math.cos(angle) * p.orbitRadius;
        targetY = mouse.y + Math.sin(angle) * p.orbitRadius;
        p.opacity += (p.targetOpacity - p.opacity) * 0.03;
      } else if (p.isIdle) {
        // Idle wander — drift to random positions
        p.wanderTimer += 1;
        if (p.wanderTimer > 200 + Math.random() * 300) {
          p.wanderX = 50 + Math.random() * (canvas.width - 100);
          p.wanderY = 50 + Math.random() * (canvas.height - 100);
          p.wanderTimer = 0;
        }
        targetX = p.wanderX;
        targetY = p.wanderY;
        p.opacity += (p.idleOpacity - p.opacity) * 0.02;
      } else {
        // Disperse back to edges
        targetX = p.homeX;
        targetY = p.homeY;
        p.opacity += (0 - p.opacity) * 0.04;
      }

      // Spring physics
      var dx = targetX - p.x;
      var dy = targetY - p.y;
      var speed = p.isIdle && !isPressed ? p.wanderSpeed : p.springSpeed;
      p.vx += dx * speed;
      p.vy += dy * speed;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.x += p.vx;
      p.y += p.vy;

      // Draw
      if (p.opacity > 0.01) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + COLOR.r + "," + COLOR.g + "," + COLOR.b + "," + p.opacity + ")";
        ctx.fill();
      }
    }

    requestAnimationFrame(loop);
  }

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
  }

  hero.addEventListener("mousedown", function (e) {
    isPressed = true;
    getPos(e);
    canvas.style.pointerEvents = "auto";
  });

  window.addEventListener("mousemove", function (e) {
    if (isPressed) getPos(e);
  });

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

  window.addEventListener("resize", resize);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
