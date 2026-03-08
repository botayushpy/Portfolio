/* ============================================================
   AYUSH SAHU — PORTFOLIO SCRIPT
   Features: Navbar, Scroll Reveal, Skill Bars, Mobile Menu,
             Contact Form, Smooth Interactions
   ============================================================ */

'use strict';

/* ---- NAVBAR: Scrolled state + Active link ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Highlight nav link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--white)';
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveNavLink();
  revealOnScroll();
  animateSkillBars();
});

// Initial call
updateNavbar();

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksMenu.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
  }
});

/* ---- SCROLL REVEAL ANIMATION ---- */
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  revealElements.forEach((el, index) => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - revealPoint) {
      // Stagger siblings in same section
      const delay = el.dataset.delay || 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
    }
  });
}

// Add stagger delays to cards/items
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.dataset.delay = i * 120;
});
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.dataset.delay = i * 60;
});
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.dataset.delay = i * 150;
});

// Initial check on load
window.addEventListener('load', () => {
  revealOnScroll();
  animateSkillBars();
});

/* ---- SKILL BARS ANIMATION ---- */
let barsAnimated = false;

function animateSkillBars() {
  if (barsAnimated) return;

  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const sectionTop = skillsSection.getBoundingClientRect().top;

  if (sectionTop < window.innerHeight - 100) {
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach((bar, index) => {
      const targetWidth = bar.dataset.width + '%';
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, index * 150);
    });
    barsAnimated = true;
  }
}

/* ---- SMOOTH SCROLL for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- CONTACT FORM SUBMISSION ---- */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // UI: loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        showFeedback('✅ Message sent! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        showFeedback(data.error || '❌ Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      // Graceful fallback if backend isn't running (e.g., GitHub Pages)
      console.warn('Backend not reachable:', err);
      showFeedback('✅ Message received! (Note: backend may not be running)', 'success');
      contactForm.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function showFeedback(msg, type) {
  formFeedback.textContent = msg;
  formFeedback.className = 'form-feedback ' + type;
  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
  }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---- CURSOR GLOW (desktop only) ---- */
if (window.innerWidth > 768) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,158,255,0.04), transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: transform 0.1s ease;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
}

/* ---- TYPING EFFECT on Hero Tagline ---- */
function typeWriter(element, text, speed = 45) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

window.addEventListener('load', () => {
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const text = tagline.textContent;
    setTimeout(() => typeWriter(tagline, text, 35), 900);
  }
});

/* ---- INTERSECTION OBSERVER for extra precision ---- */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));
