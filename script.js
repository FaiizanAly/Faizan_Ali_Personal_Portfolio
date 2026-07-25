/**
 * =====================================================
 *  FAIZAN ALI — PORTFOLIO 2026
 *  script.js — Vanilla JavaScript Controller
 * =====================================================
 *
 *  Features:
 *  1.  Loading Screen
 *  2.  Dark / Light Theme with LocalStorage persistence
 *  3.  Sticky Navbar + Active Link Highlighter
 *  4.  Mobile Hamburger Menu
 *  5.  Smooth Scroll for all anchor links
 *  6.  Scroll-to-Top Button
 *  7.  Intersection Observer — Fade-in Animations
 *  8.  Skill Progress Bar Animation
 *  9.  Role Typewriter Effect (Hero)
 * 10.  Project Filter Tabs
 * 11.  Contact Form (mailto handler)
 * 12.  Keyboard Navigation Support
 * 13.  Ripple Effect on Buttons
 * =====================================================
 */

'use strict';

// ======================================================
//  UTILITY HELPERS
// ======================================================

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element|null}
 */
const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Shorthand querySelectorAll (returns Array)
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element[]}
 */
const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

// ======================================================
//  1. LOADING SCREEN
// ======================================================

/**
 * Hides the loading screen after the page is ready.
 * Adds 'hidden' class which triggers CSS opacity transition.
 */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Hide loader after a short delay to ensure fonts & layout are ready
  const hideLoader = () => {
    loader.classList.add('hidden');
    // Remove from DOM after transition ends
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  // Wait for window load event (all assets loaded)
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 400));
  }
}

// ======================================================
//  2. DARK / LIGHT THEME TOGGLE
// ======================================================

/**
 * Manages theme preference with LocalStorage persistence.
 * Toggles `data-theme="dark"` on <body>.
 */
function initTheme() {
  const themeBtn = $('#theme-toggle');
  if (!themeBtn) return;

  // Read saved preference; default to 'light'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  // Keyboard: Space / Enter triggers theme toggle
  themeBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      themeBtn.click();
    }
  });
}

/**
 * Applies a theme by setting/removing the data-theme attribute.
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
  }
}

// ======================================================
//  3. STICKY NAVBAR + ACTIVE LINK HIGHLIGHTER
// ======================================================

/**
 * Adds 'scrolled' class to navbar on scroll.
 * Also highlights the active navigation link based on viewport position.
 */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const navLinks = $$('.nav-link');
  const sections = $$('section[id], div[id]');

  // Throttle scroll events for performance
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      // Scrolled class for shadow
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Active link highlighting
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 80;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });

      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on init
}

// ======================================================
//  4. MOBILE HAMBURGER MENU
// ======================================================

/**
 * Toggles mobile nav menu open/close.
 * Closes menu on outside click or Escape key.
 */
function initHamburger() {
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');
  if (!hamburger || !navMenu) return;

  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  // Toggle on click
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on nav link click
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      hamburger.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
}

// ======================================================
//  5. SMOOTH SCROLL
// ======================================================

/**
 * Handles smooth scrolling for all hash anchor links.
 * Accounts for fixed navbar height offset.
 */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#') return; // Skip bare hash

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = $('#navbar')?.offsetHeight || 60;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
}

// ======================================================
//  6. SCROLL-TO-TOP BUTTON
// ======================================================

/**
 * Shows/hides the scroll-to-top button based on scroll position.
 */
function initScrollTop() {
  const btn = $('#scroll-top');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keyboard support
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
}

// ======================================================
//  7. INTERSECTION OBSERVER — FADE-IN ANIMATIONS
// ======================================================

/**
 * Observes elements with [data-animate] attribute.
 * Adds 'visible' class when element enters the viewport.
 */
function initAnimations() {
  const animatedEls = $$('[data-animate]');
  if (!animatedEls.length) return;

  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    animatedEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.12,    // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedEls.forEach((el) => observer.observe(el));
}

// ======================================================
//  8. SKILL PROGRESS BAR ANIMATION
// ======================================================

/**
 * Animates skill progress bars when they enter the viewport.
 * Uses IntersectionObserver for performance.
 */
function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) {
    fills.forEach((fill) => fill.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach((fill) => observer.observe(fill));
}

// ======================================================
//  9. HERO ROLE TYPEWRITER EFFECT
// ======================================================

/**
 * Cycles through role titles with a smooth typewriter effect.
 */
function initRoleTypewriter() {
  const roleTag = $('#role-tag');
  if (!roleTag) return;

  const roles = ['MCA Student', 'Java Developer', 'Aspiring Software Engineer', 'Web Developer'];
  let currentRole = 0;
  let currentChar = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const role = roles[currentRole];

    if (!isDeleting) {
      // Typing forward
      roleTag.textContent = role.substring(0, currentChar + 1);
      currentChar++;

      if (currentChar === role.length) {
        // Pause before deleting
        typingTimeout = setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    } else {
      // Deleting backward
      roleTag.textContent = role.substring(0, currentChar - 1);
      currentChar--;

      if (currentChar === 0) {
        isDeleting = false;
        currentRole = (currentRole + 1) % roles.length;
      }
    }

    // Speed: faster when deleting
    const speed = isDeleting ? 60 : 100;
    typingTimeout = setTimeout(type, speed);
  }

  // Start after a short delay
  typingTimeout = setTimeout(type, 1500);
}

// ======================================================
//  10. PROJECT FILTER TABS
// ======================================================

/**
 * Filters project cards by category.
 * Adds/removes 'hidden' class with a smooth CSS transition.
 */
function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const featuredSection = $('#featured-projects');
  const miniSection     = $('#mini-projects');
  const miniTitle       = $('.mini-projects-title');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active state + ARIA
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show / hide sections based on filter
      if (filter === 'all') {
        showSection(featuredSection);
        showSection(miniSection);
        if (miniTitle) miniTitle.style.display = '';
      } else if (filter === 'featured') {
        showSection(featuredSection);
        hideSection(miniSection);
        if (miniTitle) miniTitle.style.display = 'none';
      } else if (filter === 'mini') {
        hideSection(featuredSection);
        showSection(miniSection);
        if (miniTitle) miniTitle.style.display = '';
      }
    });
  });

  function showSection(section) {
    if (!section) return;
    section.style.opacity = '0';
    section.style.display = '';
    requestAnimationFrame(() => {
      section.style.transition = 'opacity 0.3s ease';
      section.style.opacity = '1';
    });
  }

  function hideSection(section) {
    if (!section) return;
    section.style.transition = 'opacity 0.3s ease';
    section.style.opacity = '0';
    setTimeout(() => { section.style.display = 'none'; }, 300);
  }
}

// ======================================================
//  11. CONTACT FORM (MAILTO HANDLER)
// ======================================================

/**
 * Handles contact form submission.
 * Composes a mailto: URL with form field values and opens mail client.
 */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#contact-name')?.value.trim()    || '';
    const email   = form.querySelector('#contact-email')?.value.trim()   || '';
    const subject = form.querySelector('#contact-subject')?.value.trim() || 'Portfolio Contact';
    const message = form.querySelector('#contact-message')?.value.trim() || '';

    if (!name || !email || !message) {
      showFormFeedback(form, 'Please fill in all required fields.', 'error');
      return;
    }

    // Compose mailto URL
    const mailSubject = encodeURIComponent(`[Portfolio] ${subject}`);
    const mailBody    = encodeURIComponent(
      `Hi Faizan,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`
    );

    const mailtoURL = `mailto:git.faizanali@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    window.location.href = mailtoURL;

    showFormFeedback(form, '✅ Opening your mail client…', 'success');
    form.reset();
  });
}

/**
 * Shows a temporary feedback message below the form.
 * @param {HTMLFormElement} form
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showFormFeedback(form, message, type) {
  // Remove existing feedback
  const existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();

  const feedback = document.createElement('p');
  feedback.className = 'form-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 12px;
    background: ${type === 'success' ? 'rgba(52,199,89,0.12)' : 'rgba(255,59,48,0.12)'};
    color: ${type === 'success' ? '#30D158' : '#FF453A'};
    border: 1px solid ${type === 'success' ? 'rgba(52,199,89,0.3)' : 'rgba(255,59,48,0.3)'};
  `;
  form.appendChild(feedback);

  // Auto-remove after 4 seconds
  setTimeout(() => feedback.remove(), 4000);
}

// ======================================================
//  12. KEYBOARD NAVIGATION SUPPORT
// ======================================================

/**
 * Adds keyboard arrow navigation for filter tabs.
 */
function initKeyboardNav() {
  const filterBtns = $$('.filter-btn');

  filterBtns.forEach((btn, i) => {
    btn.addEventListener('keydown', (e) => {
      let nextIndex = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (i + 1) % filterBtns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (i - 1 + filterBtns.length) % filterBtns.length;
      }
      if (nextIndex !== i) {
        e.preventDefault();
        filterBtns[nextIndex].focus();
        filterBtns[nextIndex].click();
      }
    });
  });
}

// ======================================================
//  13. RIPPLE EFFECT ON BUTTONS
// ======================================================

/**
 * Creates a material-design-style ripple on click for all .btn elements.
 */
function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.5;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width:  ${size}px;
      height: ${size}px;
      left:   ${x}px;
      top:    ${y}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.30);
      transform: scale(0);
      animation: ripple-anim 0.6s ease-out forwards;
      pointer-events: none;
      z-index: 10;
    `;

    // Inject keyframes once
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-anim {
          to { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// ======================================================
//  14. ACTIVE SECTION HIGHLIGHT IN SKILLS
// ======================================================

/**
 * Re-triggers skill bar animations when skills section is in view.
 */
function initSkillsObserver() {
  const skillsSection = $('#skills');
  if (!skillsSection) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger skill fills
          $$('.skill-fill').forEach((fill) => fill.classList.add('animated'));
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillsSection);
}

// ======================================================
//  INITIALIZATION — DOMContentLoaded
// ======================================================

/**
 * Main entry point. Initializes all features when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Loading screen
  initLoader();

  // 2. Theme (reads from LocalStorage)
  initTheme();

  // 3. Sticky navbar + active links
  initNavbar();

  // 4. Mobile hamburger menu
  initHamburger();

  // 5. Smooth scrolling
  initSmoothScroll();

  // 6. Scroll-to-top button
  initScrollTop();

  // 7. Fade-in animations via IntersectionObserver
  initAnimations();

  // 8. Skill progress bars animation
  initSkillBars();

  // 8b. Skills section observer
  initSkillsObserver();

  // 9. Hero typewriter role effect
  initRoleTypewriter();

  // 10. Project filter tabs
  initProjectFilter();

  // 11. Contact form (mailto)
  initContactForm();

  // 12. Keyboard navigation for tabs
  initKeyboardNav();

  // 13. Button ripple effect
  initRipple();

  console.log('%c🚀 Faizan Ali Portfolio Loaded', 'color: #0071E3; font-size: 14px; font-weight: bold;');
});
