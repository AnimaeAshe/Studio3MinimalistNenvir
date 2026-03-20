(function () {
  // canvas setup
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = 800;
  const height = 600;

  // play bgm
  const bgm = document.getElementById("bgm");
  let musicStarted = false;
  bgm.onplay = () => {
    musicStarted = true;
  };

  // generate Particles
  const PARTICLE_COUNT = 190;
  let particles = [];

  // mouse position
  let mouseX = -1000;
  let mouseY = -1000;
  let mouseActive = false;
  let mouseTrail = [];

  // initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: 0,
      baseY: 0,
      vx: (Math.random() - 0.5) * 0.2, // moving speed
      vy: (Math.random() - 0.5) * 0.2,
      size: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2, // breathing phase
    });
  }

  // mouse listener
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;
    mouseActive = true;

    //start music
    if (!musicStarted) {
      bgm.play().catch(() => {
        console.log("autoplay blocked");
      });
      musicStarted = true;
    }

  canvas.addEventListener("mouseleave", () => {
    mouseActive = false;
  });

  // animation
  function animate() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    // renew particles
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // limit particles from the border
      if (p.x < 0 || p.x > width) p.vx *= -0.5;
      if (p.y < 0 || p.y > height) p.vy *= -0.5;

      // randomly change direction
      if (Math.random() < 0.02) {
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;
      }

      // limit speed
              const maxSpeed = 0.2;
        if (Math.abs(p.vx) > maxSpeed) p.vx *= 0.5;
        if (Math.abs(p.vy) > maxSpeed) p.vy *= 0.5;
      }

      // keeping away from mouse
      if (mouseActive) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 50;

        if (dist < repelRadius && dist > 1) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - dist / repelRadius) * 0.2;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }

      // breathing effect
      let currentSize;
      p.phase += 0.02;
      const breath = 0.5 + 0.5 * Math.sin(p.phase);
      currentSize = p.size * (0.7 + breath * 0.6);

      // particle rendering
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);

      // pure white with breathing alpha
      const alpha = 0.7 + 0.3 * Math.sin(p.phase * 0.5); 
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // slightly glowing effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();

})();
