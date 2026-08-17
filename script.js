/* ==========================================================
   MOJIBUL RAHMAN — PORTFOLIO SCRIPT
   Vanilla JS only. Organized by feature for readability.
========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveSection();
  initTypingAnimation(prefersReducedMotion);
  initScrollReveal(prefersReducedMotion);
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initThemeToggle();
  initVisionCanvas(prefersReducedMotion);
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ----------------------------------------------------------
   1. NAVBAR SCROLL EFFECT
   Adds a translucent background once the page scrolls past
   the hero so the nav stays readable over any section.
---------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ----------------------------------------------------------
   2. MOBILE HAMBURGER MENU
---------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ----------------------------------------------------------
   3. SMOOTH SCROLLING FOR NAV LINKS
   CSS `scroll-behavior: smooth` already handles most of it;
   this keeps it working consistently and accounts for the
   fixed navbar height as an offset.
---------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------------------------
   4. ACTIVE NAVBAR SECTION HIGHLIGHTING
   Uses IntersectionObserver to detect which section is
   currently in view and highlights the matching nav link.
---------------------------------------------------------- */
function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ----------------------------------------------------------
   5. HERO TYPING ANIMATION
   Cycles through a list of role titles, typing and deleting
   each one. Skips animation entirely for reduced-motion users
   and just shows the first title.
---------------------------------------------------------- */
function initTypingAnimation(prefersReducedMotion) {
  const el = document.getElementById('typed-role');

  const roles = [
    'Vision Engineer',
    'Application Engineer',
    'Web Developer'
  ];

  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 100;
  const DELETE_SPEED = 60;
  const HOLD_TIME = 1500;

  // Start empty
  el.textContent = '';

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      // Typing
      charIndex++;
      el.textContent = currentRole.substring(0, charIndex);

      if (charIndex === currentRole.length) {
        deleting = true;

        setTimeout(typeEffect, HOLD_TIME);
        return;
      }

      setTimeout(typeEffect, TYPE_SPEED);

    } else {
      // Backspace
      charIndex--;
      el.textContent = currentRole.substring(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;

        setTimeout(typeEffect, 400);
        return;
      }

      setTimeout(typeEffect, DELETE_SPEED);
    }
  }

  typeEffect();
}

/* ----------------------------------------------------------
   6. SCROLL REVEAL ANIMATIONS
   Fades/slides elements with the `.reveal` class into view
   as they enter the viewport. Staggers siblings slightly for
   a more premium feel.
---------------------------------------------------------- */
function initScrollReveal(prefersReducedMotion) {
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------------
   7. PROJECT FILTERING
   Filters project cards by data-category using the filter
   bar buttons. Pure DOM class toggling, no rebuild needed.
---------------------------------------------------------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ----------------------------------------------------------
   8. CONTACT FORM VALIDATION
   Client-side validation only. No backend/email service is
   wired up, so we're transparent about that in the UI message
   rather than pretending the message was sent.
---------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const note = document.getElementById('form-note');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    note.textContent = 'Sending message...';

    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mnpagkgd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        note.style.color = '#22d3ee';
        note.textContent = 'Message sent successfully! I will get back to you soon.';
        form.reset();
      } else {
        note.style.color = '#f87171';
        note.textContent = 'Message could not be sent. Please try again.';
      }

    } catch (error) {
      note.style.color = '#f87171';
      note.textContent = 'Something went wrong. Please try again.';
    }
  });
}
/* ----------------------------------------------------------
   9. BACK TO TOP BUTTON
---------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('visible', window.scrollY > 600),
    { passive: true }
  );
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------------
   10. DARK / LIGHT MODE TOGGLE
   Persists preference in localStorage.
---------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ----------------------------------------------------------
   11. INTERACTIVE VISION-SCANNING BACKGROUND
   Draws a subtle machine-vision-style scanning grid with a
   few slow-moving "detection" particles on a full-screen
   canvas behind the hero. Kept understated per design brief.
---------------------------------------------------------- */
function initVisionCanvas(prefersReducedMotion) {
  const canvas = document.getElementById('vision-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  resize();
  particles = createParticles(Math.min(60, Math.floor((width * height) / 28000)));
  window.addEventListener('resize', () => {
    resize();
    particles = createParticles(Math.min(60, Math.floor((width * height) / 28000)));
  });

  if (prefersReducedMotion) {
    // Draw a single static frame and stop — no continuous animation.
    drawFrame();
    return;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    // Connect nearby particles with faint lines (scanning-network feel)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    drawFrame();
    requestAnimationFrame(loop);
  }
  loop();
}
