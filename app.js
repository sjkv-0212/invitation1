/**
 * GRANDFATHER'S 80TH BIRTHDAY JUBILEE — INTERACTIVE CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initScrollBackground();
  initParticleCanvas();
  initEnvelopeExperience();
  initCountdownTimer();
  initAudioSystem();
  initConfettiTriggers();
  initPhotoGallery();
  initVirtualCake();
  initTriviaQuiz();
  initWishesWall();
  initRsvpForm();
  initCalendarExport();
  initLifeStoryPage();
});

function initScrollBackground() {
  let targetShift = window.scrollY * -0.08;
  let currentShift = targetShift;
  let animationFrame;

  function animateShift() {
    currentShift += (targetShift - currentShift) * 0.08;
    document.documentElement.style.setProperty('--scroll-shift', `${currentShift}px`);
    animationFrame = requestAnimationFrame(animateShift);
  }

  window.addEventListener('scroll', () => {
    targetShift = window.scrollY * -0.08;
  }, { passive: true });

  animationFrame = requestAnimationFrame(animateShift);
  window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });
}

/* ==================== 1. HYPER-DYNAMIC INTERACTIVE PARTICLE & MOTION SYSTEM ==================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const spotlight = document.getElementById('cursorSpotlight');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Motion & Pointer State
  const mouse = {
    x: width * 0.5,
    y: height * 0.4,
    targetX: width * 0.5,
    targetY: height * 0.4,
    prevX: width * 0.5,
    prevY: height * 0.4,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 170,
    isActive: false,
    lastActive: performance.now()
  };

  // Parallax Tilt State
  const tilt = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  // Scroll dynamics
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let scrollImpulse = 0;

  // Window Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  // Pointer Movement Handlers
  function updatePointer(px, py, isTouch = false) {
    mouse.targetX = px;
    mouse.targetY = py;
    mouse.isActive = true;
    mouse.lastActive = performance.now();

    // Normalized coordinates (-1 to 1) for 3D parallax tilt
    const normX = (px / width) * 2 - 1;
    const normY = (py / height) * 2 - 1;
    tilt.targetX = normX;
    tilt.targetY = normY;

    // Spawn magical cursor sparkle trail when moving
    if (mouse.speed > 1.2 || isTouch) {
      const count = Math.min(Math.floor(mouse.speed / 4) + 1, 3);
      for (let i = 0; i < count; i++) {
        sparkles.push(new CursorSparkle(px, py, mouse.vx, mouse.vy));
      }
    }
  }

  window.addEventListener('mousemove', (e) => {
    updatePointer(e.clientX, e.clientY, false);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    scrollVelocity = delta * 0.15;
    scrollImpulse = Math.max(-20, Math.min(20, scrollVelocity));
  }, { passive: true });

  // Shockwave Rings on Click/Tap
  const shockwaves = [];
  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 5;
      this.maxRadius = Math.min(width, height) * 0.35;
      this.opacity = 0.9;
      this.speed = 12;
    }
    update() {
      this.radius += this.speed;
      this.opacity = (1 - this.radius / this.maxRadius) * 0.85;
      return this.radius < this.maxRadius && this.opacity > 0.01;
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 215, 0, ${Math.max(0, this.opacity)})`;
      ctx.lineWidth = Math.max(1, 4 * (1 - this.radius / this.maxRadius));
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();
    }
  }

  window.addEventListener('pointerdown', (e) => {
    shockwaves.push(new Shockwave(e.clientX, e.clientY));
    for (let i = 0; i < 8; i++) {
      sparkles.push(new CursorSparkle(e.clientX, e.clientY, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8));
    }
  }, { passive: true });

  // ==================== PARTICLE CLASSES ====================
  const particles = [];
  const sparkles = [];
  const isMobile = width < 768;
  const particleCount = isMobile ? 55 : 110;

  class CosmicParticle {
    constructor() {
      this.init(true);
    }

    init(randomY = false) {
      this.x = Math.random() * width;
      this.y = randomY ? Math.random() * height : height + 20;
      this.depth = Math.random() * 0.8 + 0.2; // 3D depth layer (0.2 far, 1.0 close)
      this.baseSize = (Math.random() * 2.2 + 0.8) * this.depth;
      this.size = this.baseSize;

      // Type: 'dust', 'star', or 'bokeh'
      const rand = Math.random();
      if (rand > 0.88) {
        this.type = 'bokeh';
        this.baseSize = Math.random() * 12 + 6;
      } else if (rand > 0.35) {
        this.type = 'star';
      } else {
        this.type = 'dust';
      }

      this.vx = (Math.random() - 0.5) * 0.4 * this.depth;
      this.vy = -(Math.random() * 0.6 + 0.2) * this.depth;
      this.originVx = this.vx;
      this.originVy = this.vy;

      this.opacity = Math.random() * 0.7 + 0.3;
      this.baseOpacity = this.opacity;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;

      // Royal Gold & Champagne color palette
      const colors = ['#ffd700', '#fbe69b', '#d4af37', '#ffffff', '#ffeb99'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.glow = this.type === 'bokeh' ? 12 : (this.type === 'star' ? 8 : 4);
    }

    update() {
      this.pulsePhase += this.pulseSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.25;

      // Scroll speed reaction
      this.y += this.vy + (scrollImpulse * this.depth * 0.25);
      this.x += this.vx;

      // Interactive Mouse Repulsion & Fluid Wake Physics
      if (mouse.isActive) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const effectRadius = mouse.radius * (0.8 + this.depth * 0.4);

        if (dist < effectRadius && dist > 0.001) {
          const force = (1 - dist / effectRadius);
          const push = force * 6.5 * this.depth;

          // Radial push
          this.x += (dx / dist) * push;
          this.y += (dy / dist) * push;

          // Tangential swirl based on mouse movement speed
          if (mouse.speed > 0.5) {
            const swirl = force * 2.5 * this.depth;
            this.x += (mouse.vy * 0.2 + (dy / dist) * 0.3) * swirl;
            this.y += (-mouse.vx * 0.2 - (dx / dist) * 0.3) * swirl;
          }

          // Shimmer brighter and enlarge near cursor
          this.opacity = Math.min(1, this.opacity + force * 0.5);
          this.size = this.baseSize * (1 + force * 0.8);
        } else {
          this.size += (this.baseSize - this.size) * 0.08;
        }
      } else {
        this.size += (this.baseSize - this.size) * 0.08;
      }

      // Shockwave physical blast
      for (let sw of shockwaves) {
        const dx = this.x - sw.x;
        const dy = this.y - sw.y;
        const dist = Math.hypot(dx, dy);
        const ringDist = Math.abs(dist - sw.radius);
        if (ringDist < 40 && dist > 0.001) {
          const push = (1 - ringDist / 40) * 10 * sw.opacity * this.depth;
          this.x += (dx / dist) * push;
          this.y += (dy / dist) * push;
          this.opacity = 1;
        }
      }

      // Boundaries & Reset
      if (this.y < -30) {
        this.init(false);
      } else if (this.y > height + 30) {
        this.y = -20;
      }
      if (this.x < -30) this.x = width + 20;
      if (this.x > width + 30) this.x = -20;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

      if (this.type === 'bokeh') {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
        gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'star') {
        // Draw 4-pointed radiant star
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = this.glow;
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - s * 2);
        ctx.quadraticCurveTo(this.x, this.y, this.x + s * 2, this.y);
        ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + s * 2);
        ctx.quadraticCurveTo(this.x, this.y, this.x - s * 2, this.y);
        ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - s * 2);
        ctx.closePath();
        ctx.fill();
      } else {
        // Crisp circular dust
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = this.glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Cursor Stardust Sparkle Trail
  class CursorSparkle {
    constructor(x, y, vx, vy) {
      this.x = x + (Math.random() - 0.5) * 15;
      this.y = y + (Math.random() - 0.5) * 15;
      this.vx = (vx * 0.3) + (Math.random() - 0.5) * 3;
      this.vy = (vy * 0.3) + (Math.random() - 0.5) * 3 - 0.8;
      this.size = Math.random() * 3.5 + 1.5;
      this.life = 1.0;
      this.decay = Math.random() * 0.035 + 0.02;
      this.rotation = Math.random() * Math.PI;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
      this.color = Math.random() > 0.3 ? '#ffd700' : '#ffffff';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04; // Gentle gravity
      this.vx *= 0.96;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
      return this.life > 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 10;

      const s = this.size * this.life;
      ctx.beginPath();
      ctx.moveTo(0, -s * 2.2);
      ctx.lineTo(s * 0.6, -s * 0.6);
      ctx.lineTo(s * 2.2, 0);
      ctx.lineTo(s * 0.6, s * 0.6);
      ctx.lineTo(0, s * 2.2);
      ctx.lineTo(-s * 0.6, s * 0.6);
      ctx.lineTo(-s * 2.2, 0);
      ctx.lineTo(-s * 0.6, -s * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new CosmicParticle());
  }

  // Dynamic Constellation Mesh Connector
  function drawConstellationLines() {
    const maxDist = isMobile ? 65 : 95;
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      if (p1.type === 'bokeh') continue;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        if (p2.type === 'bokeh') continue;

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          let alpha = (1 - dist / maxDist) * 0.22;

          // If close to cursor, brighten and strengthen line
          if (mouse.isActive) {
            const midX = (p1.x + p2.x) * 0.5;
            const midY = (p1.y + p2.y) * 0.5;
            const mouseDist = Math.hypot(midX - mouse.x, midY - mouse.y);
            if (mouseDist < mouse.radius) {
              alpha += (1 - mouseDist / mouse.radius) * 0.45;
            }
          }

          if (alpha > 0.02) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = alpha > 0.3 ? 1.2 : 0.7;
            ctx.stroke();
          }
        }
      }
    }
    ctx.restore();
  }

  // Main 60-120fps Animation Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Mouse velocity and smooth damping
    mouse.vx = mouse.targetX - mouse.x;
    mouse.vy = mouse.targetY - mouse.y;
    mouse.x += mouse.vx * 0.12;
    mouse.y += mouse.vy * 0.12;
    mouse.speed = Math.hypot(mouse.vx, mouse.vy);

    // Fade out active state if stationary for > 3s
    if (performance.now() - mouse.lastActive > 3000) {
      mouse.isActive = false;
    }

    // Parallax tilt damping
    tilt.x += (tilt.targetX - tilt.x) * 0.08;
    tilt.y += (tilt.targetY - tilt.y) * 0.08;

    // Decay scroll impulse smoothly
    scrollImpulse *= 0.92;

    // Update CSS Custom Variables for Hardware-Accelerated background layers
    document.documentElement.style.setProperty('--mouse-x', `${mouse.x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouse.y}px`);
    document.documentElement.style.setProperty('--tilt-x', `${tilt.x}`);
    document.documentElement.style.setProperty('--tilt-y', `${tilt.y}`);

    // 1. Draw Constellation Web
    drawConstellationLines();

    // 2. Update & Draw Ambient Floating Particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // 3. Update & Draw Cursor Sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      if (!sparkles[i].update()) {
        sparkles.splice(i, 1);
      } else {
        sparkles[i].draw();
      }
    }

    // 4. Update & Draw Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      if (!shockwaves[i].update()) {
        shockwaves.splice(i, 1);
      } else {
        shockwaves[i].draw();
      }
    }

    requestAnimationFrame(render);
  }

  render();
  initInteractiveCardTilt();
}

/* ==================== 1B. 3D CARD TILT ON MOUSE HOVER ==================== */
function initInteractiveCardTilt() {
  const tiltElements = document.querySelectorAll(
    '.timeline-card, .gallery-item, .countdown-card, .spotlight-frame-outer, .trivia-card, .cake-stage, .wishes-form-card'
  );

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/* ==================== 2. INTERACTIVE WAX SEAL & ENVELOPE ==================== */
function initEnvelopeExperience() {
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const skipEnvelopeBtn = document.getElementById('skipEnvelopeBtn');
  const replayEnvelopeBtn = document.getElementById('replayEnvelopeBtn');

  if (!envelopeOverlay) return;

  function openEnvelope() {
    envelopeOverlay.classList.add('opening');
    playCelebrationChime();
    fireCelebrationConfetti();

    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('envelope-active');
      // Trigger additional confetti shower
      setTimeout(fireCelebrationConfetti, 400);
    }, 1200);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openEnvelope);
  }

  if (skipEnvelopeBtn) {
    skipEnvelopeBtn.addEventListener('click', () => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('envelope-active');
    });
  }

  if (replayEnvelopeBtn) {
    replayEnvelopeBtn.addEventListener('click', () => {
      envelopeOverlay.classList.remove('opened', 'opening');
      document.body.classList.add('envelope-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==================== LIFE STORY VIDEO PAGE ==================== */
function initLifeStoryPage() {
  const cards = document.querySelectorAll('.video-card');
  if (!cards.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 70}ms`;
    revealObserver.observe(card);
  });

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.video-card video').forEach((video) => videoObserver.observe(video));
}

/* ==================== 3. LIVE COUNTDOWN TIMER ==================== */
function initCountdownTimer() {
  const daysVal = document.getElementById('daysVal');
  const hoursVal = document.getElementById('hoursVal');
  const minsVal = document.getElementById('minsVal');
  const secsVal = document.getElementById('secsVal');

  if (!daysVal) return;

  // Target Celebration Date: October 24, 2026, 17:30 (5:30 PM)
  const targetDate = new Date(2026, 9, 24, 17, 30, 0).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysVal.textContent = '00';
      hoursVal.textContent = '00';
      minsVal.textContent = '00';
      secsVal.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysVal.textContent = String(days).padStart(2, '0');
    hoursVal.textContent = String(hours).padStart(2, '0');
    minsVal.textContent = String(minutes).padStart(2, '0');
    secsVal.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==================== 4. WEB AUDIO SYNTHESIZER FOR CELEBRATION CHIMES ==================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playNote(freq, startTime, duration, type = 'sine', gainVal = 0.15) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch (e) {
    console.log('Audio playback error:', e);
  }
}

function playCelebrationChime() {
  initAudioContext();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const now = audioCtx.currentTime;
  // Golden celebratory fanfare arpeggio (C Major / E / G / C / E5)
  playNote(523.25, now + 0.0, 0.6, 'triangle', 0.2); // C5
  playNote(659.25, now + 0.15, 0.6, 'triangle', 0.2); // E5
  playNote(783.99, now + 0.3, 0.7, 'triangle', 0.22); // G5
  playNote(1046.50, now + 0.45, 1.2, 'sine', 0.25); // C6
  playNote(1318.51, now + 0.6, 1.5, 'sine', 0.18); // E6
}

function playCandleChime() {
  initAudioContext();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const notes = [587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 1174.66];
  const randomNote = notes[Math.floor(Math.random() * notes.length)];
  playNote(randomNote, audioCtx.currentTime, 0.8, 'sine', 0.12);
}

function initAudioSystem() {
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicStatus = document.getElementById('musicStatus');

  if (!musicToggleBtn) return;

  function toggleMusic() {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
      musicStatus.textContent = 'ON';
      musicToggleBtn.style.borderColor = 'var(--gold-bright)';
      startAmbientCelebrationMusic();
    } else {
      musicStatus.textContent = 'OFF';
      musicToggleBtn.style.borderColor = 'var(--border-gold)';
      stopAmbientCelebrationMusic();
    }
  }

  musicToggleBtn.addEventListener('click', toggleMusic);
}

function startAmbientCelebrationMusic() {
  const melody = [
    { note: 523.25, dur: 0.8 }, // C5
    { note: 587.33, dur: 0.8 }, // D5
    { note: 659.25, dur: 1.2 }, // E5
    { note: 783.99, dur: 1.2 }, // G5
    { note: 659.25, dur: 0.8 }, // E5
    { note: 880.00, dur: 1.5 }, // A5
    { note: 783.99, dur: 1.8 }  // G5
  ];

  let step = 0;
  musicInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    const cur = melody[step % melody.length];
    playNote(cur.note, audioCtx.currentTime, cur.dur, 'sine', 0.08);
    // Soft harmonic bass tone
    playNote(cur.note / 2, audioCtx.currentTime, cur.dur * 1.5, 'triangle', 0.04);
    step++;
  }, 1200);
}

function stopAmbientCelebrationMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

/* ==================== 5. CONFETTI TRIGGERS ==================== */
function fireCelebrationConfetti() {
  if (!window.confetti) return;

  // Gold & Emerald celebratory explosion
  const colors = ['#ffd700', '#d4af37', '#fbe69b', '#2ecc71', '#ffffff', '#e67e22'];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    disableForReducedMotion: true
  });

  // Secondary side bursts
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });
  }, 250);
}

function initConfettiTriggers() {
  const confettiCannonBtn = document.getElementById('confettiCannonBtn');
  const heroConfettiBtn = document.getElementById('heroConfettiBtn');

  if (confettiCannonBtn) {
    confettiCannonBtn.addEventListener('click', () => {
      fireCelebrationConfetti();
      playCelebrationChime();
    });
  }

  if (heroConfettiBtn) {
    heroConfettiBtn.addEventListener('click', () => {
      fireCelebrationConfetti();
      playCelebrationChime();
    });
  }
}

/* ==================== 6. PHOTO GALLERY & LIGHTBOX ==================== */
let allPhotos = [];
let currentFilter = 'all';
let currentPhotoIndex = 0;
let visibleCount = 16;
let slideshowTimer = null;

async function initPhotoGallery() {
  const photoGrid = document.getElementById('photoGrid');
  const photoCountSpan = document.getElementById('photoCount');
  const galleryLoadMoreContainer = document.getElementById('galleryLoadMoreContainer');
  const loadMorePhotosBtn = document.getElementById('loadMorePhotosBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const startSlideshowBtn = document.getElementById('startSlideshowBtn');

  if (!photoGrid) return;

  try {
    const res = await fetch('assets/gallery-data.json');
    if (res.ok) {
      allPhotos = await res.json();
    } else {
      // Fallback generate from known 80 images
      allPhotos = generateFallbackGalleryData();
    }
  } catch (e) {
    allPhotos = generateFallbackGalleryData();
  }

  if (photoCountSpan) {
    photoCountSpan.textContent = allPhotos.length;
  }

  renderGalleryGrid();

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      visibleCount = 16;
      renderGalleryGrid();
    });
  });

  // Load More Button
  if (loadMorePhotosBtn) {
    loadMorePhotosBtn.addEventListener('click', () => {
      visibleCount += 16;
      renderGalleryGrid();
    });
  }

  // Slideshow
  if (startSlideshowBtn) {
    startSlideshowBtn.addEventListener('click', () => {
      if (allPhotos.length > 0) {
        openLightbox(0);
        startSlideshow();
      }
    });
  }

  initLightboxControls();
}

function generateFallbackGalleryData() {
  const photos = [];
  const imageIds = [
    4183, 4184, 4192, 4193, 4194, 4195, 4196, 4197, 4198, 4199,
    4200, 4201, 4202, 4203, 4204, 4205, 4206, 4207, 4208, 4209,
    4210, 4211, 4212, 4213, 4214, 4215, 4216, 4217, 4218, 4219,
    4220, 4221, 4222, 4223, 4224, 4225, 4226, 4227, 4228, 4229,
    4230, 4231, 4232, 4233, 4234, 4235, 4236, 4237, 4238, 4239,
    4240, 4241, 4242, 4243, 4244, 4245, 4246, 4247, 4248, 4249,
    4250, 4251, 4252, 4253, 4254, 4255, 4256, 4257, 4258, 4259,
    4260, 4261, 4262, 4263, 4264, 4265, 4266, 4267, 4268, 4269
  ];

  imageIds.forEach((id, index) => {
    photos.push({
      id: index + 1,
      filename: `IMG_${id}.jpg`,
      src: `assets/photos/IMG_${id}.jpg`,
      caption: `Cherished Memory #${index + 1}`
    });
  });

  return photos;
}

function renderGalleryGrid() {
  const photoGrid = document.getElementById('photoGrid');
  const galleryLoadMoreContainer = document.getElementById('galleryLoadMoreContainer');
  if (!photoGrid) return;

  photoGrid.innerHTML = '';

  let filtered = allPhotos;
  if (currentFilter === 'highlights') {
    filtered = allPhotos.filter((_, i) => i % 3 === 0);
  } else if (currentFilter === 'family') {
    filtered = allPhotos.filter((_, i) => i % 2 === 0);
  } else if (currentFilter === 'celebrations') {
    filtered = allPhotos.filter((_, i) => i % 4 === 0);
  }

  const toShow = filtered.slice(0, visibleCount);

  toShow.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <div class="photo-thumb-wrap">
        <img class="photo-thumb" src="${photo.src}" alt="${photo.caption}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\' viewBox=\\'0 0 300 300\\'><rect fill=\\'%23162238\\' width=\\'300\\' height=\\'300\\'/><text fill=\\'%23d4af37\\' font-size=\\'18\\' font-family=\\'serif\\' x=\\'50%\\' y=\\'50%\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>Memory #${photo.id}</text></svg>'">
        <span class="photo-badge-index">#${photo.id}</span>
      </div>
      <div class="photo-caption">${photo.caption}</div>
    `;

    card.addEventListener('click', () => {
      const realIndex = allPhotos.findIndex(p => p.id === photo.id);
      openLightbox(realIndex !== -1 ? realIndex : idx);
    });

    photoGrid.appendChild(card);
  });

  if (galleryLoadMoreContainer) {
    galleryLoadMoreContainer.style.display = visibleCount < filtered.length ? 'block' : 'none';
  }
}

function openLightbox(index) {
  currentPhotoIndex = index;
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  if (!modal || !img || !allPhotos[index]) return;

  img.src = allPhotos[index].src;
  caption.textContent = allPhotos[index].caption;
  modal.style.display = 'flex';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.style.display = 'none';
  stopSlideshow();
}

function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
  openLightbox(currentPhotoIndex);
}

function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
  openLightbox(currentPhotoIndex);
}

function startSlideshow() {
  stopSlideshow();
  slideshowTimer = setInterval(nextPhoto, 3000);
}

function stopSlideshow() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
}

function initLightboxControls() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
  if (nextBtn) nextBtn.addEventListener('click', nextPhoto);

  document.addEventListener('keydown', (e) => {
    if (modal && modal.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    }
  });
}

/* ==================== 7. INTERACTIVE VIRTUAL CAKE (80 CANDLES) ==================== */
function initVirtualCake() {
  const candleGrid = document.getElementById('candleGrid');
  const candleCounterText = document.getElementById('candleCounterText');
  const candleProgressBar = document.getElementById('candleProgressBar');
  const lightNextCandlesBtn = document.getElementById('lightNextCandlesBtn');
  const lightAllCandlesBtn = document.getElementById('lightAllCandlesBtn');
  const resetCandlesBtn = document.getElementById('resetCandlesBtn');
  const banner = document.getElementById('cakeCelebrationBanner');

  if (!candleGrid) return;

  const totalCandles = 80;
  let litCount = 0;
  const candleElements = [];

  // Generate 80 Candle DOM Elements
  for (let i = 0; i < totalCandles; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.title = `Candle #${i + 1} — Tap to Light`;

    const flame = document.createElement('div');
    flame.className = 'flame';

    candle.appendChild(flame);

    candle.addEventListener('click', () => {
      if (!candle.classList.contains('lit')) {
        lightCandle(candle);
      }
    });

    candleGrid.appendChild(candle);
    candleElements.push(candle);
  }

  function updateStatus() {
    candleCounterText.textContent = `${litCount} / ${totalCandles}`;
    const percent = (litCount / totalCandles) * 100;
    candleProgressBar.style.width = `${percent}%`;

    if (litCount === totalCandles) {
      if (banner) banner.style.display = 'block';
      fireCelebrationConfetti();
      playCelebrationChime();
    } else {
      if (banner) banner.style.display = 'none';
    }
  }

  function lightCandle(el) {
    if (el.classList.contains('lit')) return;
    el.classList.add('lit');
    litCount++;
    playCandleChime();
    updateStatus();
  }

  if (lightNextCandlesBtn) {
    lightNextCandlesBtn.addEventListener('click', () => {
      let newlyLit = 0;
      for (const candle of candleElements) {
        if (!candle.classList.contains('lit')) {
          candle.classList.add('lit');
          litCount++;
          newlyLit++;
          if (newlyLit >= 10) break;
        }
      }
      playCandleChime();
      updateStatus();
    });
  }

  if (lightAllCandlesBtn) {
    lightAllCandlesBtn.addEventListener('click', () => {
      candleElements.forEach(c => c.classList.add('lit'));
      litCount = totalCandles;
      updateStatus();
    });
  }

  if (resetCandlesBtn) {
    resetCandlesBtn.addEventListener('click', () => {
      candleElements.forEach(c => c.classList.remove('lit'));
      litCount = 0;
      updateStatus();
    });
  }
}

/* ==================== 8. GRANDPA TRIVIA QUIZ ==================== */
function initTriviaQuiz() {
  const triviaCard = document.getElementById('triviaCard');
  const indicator = document.getElementById('triviaQuestionIndicator');
  const scoreText = document.getElementById('triviaScoreText');
  const questionText = document.getElementById('triviaQuestionText');
  const optionsGrid = document.getElementById('triviaOptionsGrid');
  const feedback = document.getElementById('triviaFeedback');
  const nextBtn = document.getElementById('triviaNextBtn');

  if (!triviaCard) return;

  const triviaQuestions = [
    {
      q: "What is Grandpa's secret to staying energetic, wise, and youthful at 80?",
      options: [
        { text: "A daily walk, warm smiles, and boundless love for family", correct: true },
        { text: "Drinking 10 cups of coffee every morning", correct: false },
        { text: "Sleeping 18 hours a day", correct: false },
        { text: "Eating only ice cream", correct: false }
      ],
      explanation: "Spot on! His daily walks, cheerful heart, and devotion to family keep him forever young!"
    },
    {
      q: "Which of these best describes Grandpa's favorite role in life?",
      options: [
        { text: "Chief treat-giver and spoiling his grandchildren with love", correct: true },
        { text: "Strict disciplinarian", correct: false },
        { text: "Professional nap-taker", correct: false },
        { text: "Remote control hoarder", correct: false }
      ],
      explanation: "Absolutely! There is no joy greater to him than laughing and spoiling his grandchildren!"
    },
    {
      q: "What is Grandpa's signature piece of timeless advice to all of us?",
      options: [
        { text: "Always stay kind, work hard, and cherish every moment together", correct: true },
        { text: "Never share your dessert", correct: false },
        { text: "Avoid waking up early", correct: false },
        { text: "Watch TV all day", correct: false }
      ],
      explanation: "True wisdom! His integrity, humility, and family values inspire us all."
    },
    {
      q: "How many glorious decades are we honoring and celebrating together today?",
      options: [
        { text: "8 Incredible Decades (80 Golden Years!)", correct: true },
        { text: "5 Decades", correct: false },
        { text: "6 Decades", correct: false },
        { text: "7 Decades", correct: false }
      ],
      explanation: "80 magnificent years of glory, wisdom, and blessings!"
    }
  ];

  let currentQIndex = 0;
  let score = 0;

  function loadQuestion() {
    const q = triviaQuestions[currentQIndex];
    indicator.textContent = `Question ${currentQIndex + 1} of ${triviaQuestions.length}`;
    scoreText.textContent = `Score: ${score}`;
    questionText.textContent = q.q;
    optionsGrid.innerHTML = '';
    feedback.style.display = 'none';
    feedback.className = 'trivia-feedback';
    nextBtn.style.display = 'none';

    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-option-btn';
      btn.textContent = opt.text;

      btn.addEventListener('click', () => {
        // Disable all buttons
        optionsGrid.querySelectorAll('.trivia-option-btn').forEach(b => (b.disabled = true));

        if (opt.correct) {
          btn.classList.add('correct');
          score += 10;
          scoreText.textContent = `Score: ${score}`;
          feedback.textContent = `✨ Correct! ${q.explanation}`;
          feedback.classList.add('correct-fb');
          playCandleChime();
        } else {
          btn.classList.add('wrong');
          feedback.textContent = `💡 Good try! ${q.explanation}`;
          feedback.classList.add('wrong-fb');
        }

        feedback.style.display = 'block';
        nextBtn.style.display = 'inline-flex';
      });

      optionsGrid.appendChild(btn);
    });
  }

  nextBtn.addEventListener('click', () => {
    currentQIndex++;
    if (currentQIndex < triviaQuestions.length) {
      loadQuestion();
    } else {
      // Quiz Finished
      indicator.textContent = 'Quiz Completed!';
      questionText.textContent = `🎉 Wonderful! You scored ${score} points!`;
      optionsGrid.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
          <div style="font-size: 3rem; margin-bottom: 12px;">👑🌟🎂</div>
          <p style="color: var(--gold-light); font-size: 1.1rem;">You truly know and cherish Grandpa! Thank you for playing!</p>
        </div>
      `;
      feedback.style.display = 'none';
      nextBtn.textContent = 'Play Again ↻';
      nextBtn.onclick = () => {
        currentQIndex = 0;
        score = 0;
        nextBtn.textContent = 'Next Question →';
        nextBtn.onclick = null;
        loadQuestion();
      };
      fireCelebrationConfetti();
    }
  });

  loadQuestion();
}

/* ==================== 9. WISHES WALL (GUESTBOOK) ==================== */
function initWishesWall() {
  const wishForm = document.getElementById('wishForm');
  const wishesFeed = document.getElementById('wishesFeed');
  const totalWishesCount = document.getElementById('totalWishesCount');
  const refreshBtn = document.getElementById('refreshWishesBtn');
  const stampOptions = document.querySelectorAll('.stamp-option');

  if (!wishForm || !wishesFeed) return;

  // Stamp selector UI
  stampOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      stampOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  let storedWishes = JSON.parse(localStorage.getItem('grandpa_80_wishes') || '[]');
  const seededWishIds = new Set([1, 2, 3]);
  const cleanedWishes = storedWishes.filter(wish => !seededWishIds.has(wish.id));
  if (cleanedWishes.length !== storedWishes.length) {
    storedWishes = cleanedWishes;
    localStorage.setItem('grandpa_80_wishes', JSON.stringify(storedWishes));
  }

  function renderWishes() {
    wishesFeed.innerHTML = '';
    totalWishesCount.textContent = storedWishes.length;

    storedWishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-post-card';
      card.innerHTML = `
        <div class="wish-post-header">
          <span class="wish-post-author">${w.author}</span>
          <span class="wish-post-badge">${w.stamp}</span>
        </div>
        ${w.relationship ? `<div class="wish-post-rel">${w.relationship}</div>` : ''}
        <p class="wish-post-text">"${w.message}"</p>
        <div class="wish-post-time">${w.time || 'Recently'}</div>
      `;
      wishesFeed.appendChild(card);
    });
  }

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('wishAuthor').value.trim();
    const relationship = document.getElementById('wishRelationship').value.trim();
    const message = document.getElementById('wishMessage').value.trim();
    const selectedStampInput = document.querySelector('input[name="stamp"]:checked');
    const stamp = selectedStampInput ? selectedStampInput.value : '👑';

    if (!author || !message) return;

    const newWish = {
      id: Date.now(),
      author,
      relationship,
      stamp,
      message,
      time: 'Just now'
    };

    storedWishes.unshift(newWish);
    localStorage.setItem('grandpa_80_wishes', JSON.stringify(storedWishes));
    renderWishes();

    wishForm.reset();
    document.querySelector('.stamp-option').click(); // Reset stamp

    fireCelebrationConfetti();
    playCelebrationChime();
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', renderWishes);
  }

  renderWishes();
}

/* ==================== 10. RSVP SUBMISSION & VIP GOLDEN TICKET ==================== */
function initRsvpForm() {
  const rsvpForm = document.getElementById('rsvpForm');
  const passModal = document.getElementById('passModal');
  const passBackdrop = document.getElementById('passBackdrop');
  const closePassBtn = document.getElementById('closePassBtn');
  const printTicketBtn = document.getElementById('printTicketBtn');

  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvpName').value.trim();
    const phone = document.getElementById('rsvpPhone').value.trim();
    const email = document.getElementById('rsvpEmail').value.trim();
    const attending = document.getElementById('rsvpAttending').value;
    const guests = document.getElementById('rsvpGuests').value;

    const ticketGuestName = document.getElementById('ticketGuestName');
    const ticketPartySize = document.getElementById('ticketPartySize');
    const ticketStatusBadge = document.getElementById('ticketStatusBadge');

    if (ticketGuestName) ticketGuestName.textContent = name || 'Honored Guest';
    if (ticketPartySize) ticketPartySize.textContent = `${guests} Guests`;

    if (ticketStatusBadge) {
      if (attending === 'no') {
        ticketStatusBadge.textContent = 'Blessings Received (Unable to Attend)';
        ticketStatusBadge.style.color = '#f39c12';
      } else {
        ticketStatusBadge.textContent = 'Confirmed VIP Guest';
        ticketStatusBadge.style.color = '#2ecc71';
      }
    }

    if (passModal) {
      passModal.style.display = 'flex';
      fireCelebrationConfetti();
      playCelebrationChime();
    }
  });

  if (passBackdrop) {
    passBackdrop.addEventListener('click', () => {
      passModal.style.display = 'none';
    });
  }

  if (closePassBtn) {
    closePassBtn.addEventListener('click', () => {
      passModal.style.display = 'none';
    });
  }

  if (printTicketBtn) {
    printTicketBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==================== 11. CALENDAR EVENT (.ICS) EXPORT ==================== */
function initCalendarExport() {
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  if (!addToCalendarBtn) return;

  addToCalendarBtn.addEventListener('click', () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Grandfather 80th Jubilee//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Grandfather\'s 80th Birthday Celebration 🎂👑',
      'DESCRIPTION:Celebrating 80 Glorious Years of Love, Wisdom, and Joy! Order of Festivities includes Welcome Blessings, Speeches, Cake Cutting, and Royal Banquet.',
      'LOCATION:The Grand Royal Banquet & Ballroom, 124 Grand Palace Avenue',
      'DTSTART:20261024T173000Z',
      'DTEND:20261024T220000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Grandfather-80th-Birthday-Celebration.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
