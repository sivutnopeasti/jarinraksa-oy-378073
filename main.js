/* ============================================
   JARIN RAKSA OY – main.js
   ============================================ */

'use strict';

// ---------- HEADER SCROLL ----------
const header = document.querySelector('.site-header');

if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- HAMBURGER MENU ----------
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}

// ---------- SCROLL ANIMATIONS ----------
const fadeTargets = [
  '.service-card',
  '.gallery-item',
  '.about-stat-card',
  '.trust-item',
  '.section-header',
  '.about-text'
];

const fadeEls = document.querySelectorAll(fadeTargets.join(', '));

if ('IntersectionObserver' in window && fadeEls.length) {
  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));
}

// ---------- YHTEYDENOTTOLOMAKE ----------
const form      = document.getElementById('contact-form');
const statusEl  = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (form && statusEl && submitBtn) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Lähetetään...';
    statusEl.className = 'form-status';
    statusEl.style.display = 'none';
    statusEl.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent =
          'Tarjouspyyntö lähetetty. Otamme yhteyttä viikon sisällä.';
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        let msg = 'Lähetys epäonnistui. Koita uudelleen tai soita meille.';
        try {
          const json = await response.json();
          if (json?.errors?.length) {
            msg = json.errors.map(er => er.message).join(', ');
          }
        } catch (_) { /* käytä oletusvirheviestiä */ }
        statusEl.textContent = msg;
        statusEl.className = 'form-status error';
      }
    } catch (_) {
      statusEl.textContent =
        'Verkkovirhe. Tarkista yhteys ja yritä uudelleen.';
      statusEl.className = 'form-status error';
    } finally {
      statusEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// ---------- FOOTER YEAR ----------
const yearEl = document.getElementById('footer-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h') || '72',
        10
      );
      const top =
        target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});