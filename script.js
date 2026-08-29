// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (persisted)
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Navbar scroll state + scroll progress
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  navbar.classList.toggle('scrolled', scrolled > 10);
  backToTop.classList.toggle('show', scrolled > 500);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / docHeight) * 100}%`;
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Typing effect
const roles = [
  'Software Engineer',
  'AI / ML Enthusiast',
  'Competitive Programmer',
  'Open Source Contributor',
];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const word = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    typedEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

// Scroll reveal + counters + bars via IntersectionObserver
const revealEls = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.stat-num');
const bars = document.querySelectorAll('.bar-fill');

function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const tick = () => {
    current += step;
    if (current >= target) { el.textContent = target; return; }
    el.textContent = current;
    requestAnimationFrame(tick);
  };
  tick();
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    if (entry.target.classList.contains('about-text')) {
      counters.forEach(animateCounter);
    }
    if (entry.target.classList.contains('proficiency')) {
      bars.forEach(bar => bar.style.width = bar.dataset.width + '%');
    }
    io.unobserve(entry.target);
  });
}, { threshold: 0.2 });

revealEls.forEach(el => io.observe(el));

// Scroll-spy for nav links
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle('active', link.dataset.section === entry.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(section => spy.observe(section));

// Contact form -> Web3Forms (free static-site form backend, delivers to email)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const submitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formNote.textContent = 'Sending...';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
    });
    const result = await res.json();

    if (result.success) {
      formNote.textContent = "Message sent — I'll get back to you soon!";
      contactForm.reset();
    } else {
      formNote.textContent = 'Something went wrong. Please email riteshjd75@gmail.com directly.';
    }
  } catch (err) {
    formNote.textContent = 'Network error. Please email riteshjd75@gmail.com directly.';
  } finally {
    submitBtn.disabled = false;
  }
});
