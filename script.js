/* Preloader */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('done'), 1400);
});

/* Typing effect */
const roles = [
  'Full-Stack Developer',
  'AI Mobile App Builder',
  'Cloud & DevOps Enthusiast',
  'Problem Solver'
];
const typed = document.getElementById('typed');
let ri = 0, ci = 0, deleting = false;
(function type() {
  const word = roles[ri];
  typed.textContent = word.slice(0, ci);
  if (!deleting && ci < word.length) { ci++; setTimeout(type, 85); }
  else if (!deleting) { deleting = true; setTimeout(type, 1500); }
  else if (ci > 0) { ci--; setTimeout(type, 40); }
  else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 350); }
})();

/* Scroll progress + nav state + active link */
const nav = document.getElementById('nav');
const bar = document.getElementById('progress');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.links a:not(.btn-mini)')];
function onScroll() {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (y / h) * 100 + '%';
  nav.classList.toggle('scrolled', y > 40);
  let current = sections[0].id;
  sections.forEach(s => { if (y + 200 >= s.offsetTop) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Mobile menu */
const burger = document.getElementById('burger');
const links = document.getElementById('links');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  links.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  links.classList.remove('open');
}));

/* Reveal on scroll (staggered) */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = Math.min(idx * 0.09, 0.5) + 's';
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Count-up numbers */
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || 0);
    const suffix = el.dataset.suffix || '';
    const start = performance.now(), dur = 1800;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.count').forEach(el => cio.observe(el));

/* 3D tilt + spotlight on cards */
const canHover = matchMedia('(hover:hover)').matches;
document.querySelectorAll('.tilt, .card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
    if (canHover && card.classList.contains('tilt')) {
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    }
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* Magnetic buttons */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* Cursor glow */
const glow = document.getElementById('cursorGlow');
let gx = 0, gy = 0, tx = 0, ty = 0;
window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
(function follow() {
  gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08;
  glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
  requestAnimationFrame(follow);
})();

/* Particle network background */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const mouse = { x: null, y: null };
function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  const count = Math.min(90, Math.floor((W * H) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
    r: Math.random() * 1.6 + .4,
    gold: Math.random() < .2
  }));
}
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();
(function draw() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.gold ? 'rgba(245,195,107,.8)' : 'rgba(167,139,250,.7)';
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(139,92,246,${.13 * (1 - d / 130)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
    if (mouse.x !== null) {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (d < 160) {
        ctx.strokeStyle = `rgba(245,195,107,${.35 * (1 - d / 160)})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        p.x += (mouse.x - p.x) * 0.002; p.y += (mouse.y - p.y) * 0.002;
      }
    }
  }
  requestAnimationFrame(draw);
})();

/* Contact form -> opens mail client */
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const name = encodeURIComponent(document.getElementById('fname').value);
  const email = encodeURIComponent(document.getElementById('femail').value);
  const msg = encodeURIComponent(document.getElementById('fmsg').value);
  window.location.href =
    `mailto:rawatvaibhav1989@gmail.com?subject=Portfolio%20message%20from%20${name}&body=${msg}%0A%0AFrom:%20${name}%20(${email})`;
});

document.getElementById('year').textContent = new Date().getFullYear();
