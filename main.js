/* ═══════════════════════════════════════════════════════════════════
   BLOOM — main.js
   GSAP 3 + ScrollTrigger + Lenis smooth scroll
   All animations, scroll storytelling, and micro-interactions
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Wait for DOM + scripts ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════
     1. LENIS SMOOTH SCROLL INIT
  ══════════════════════════════════════════════ */
  const lenis = new Lenis({
    duration:          1.4,
    easing:            (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction:         'vertical',
    gestureDirection:  'vertical',
    smooth:            true,
    smoothTouch:       false,
    touchMultiplier:   2,
  });

  /* Connect Lenis → GSAP ticker (replaces manual RAF loop) */
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* Sync Lenis scroll position → ScrollTrigger */
  lenis.on('scroll', ScrollTrigger.update);


  /* ══════════════════════════════════════════════
     2. GSAP SETUP
  ══════════════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger);

  /* Shared easing constants */
  const EASE_ORGANIC = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const EASE_OUT4    = 'power4.out';
  const EASE_OUT3    = 'power3.out';
  const EASE_NONE    = 'none';


  /* ══════════════════════════════════════════════
     3. NAVIGATION — frosted glass on scroll
  ══════════════════════════════════════════════ */
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => {
      nav.classList.toggle('nav--scrolled', self.scroll() > 60);
    },
  });

  /* Smooth anchor scroll for nav links */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    });
  });


  /* ══════════════════════════════════════════════
     4. HERO — entrance sequence (fires on page load)
     Text is now bottom-left. Plant lives in center.
  ══════════════════════════════════════════════ */

  /* Initial hidden states for all hero elements */
  gsap.set('.hero__eyebrow',      { opacity: 0, x: -20 });
  gsap.set('.hero__eyebrow-rule', { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('.hero__line',         { yPercent: 115 });
  gsap.set('.hero__subtext',      { opacity: 0, y: 18 });
  gsap.set('.hero__actions',      { opacity: 0, y: 16 });
  gsap.set('.hero__aside',        { opacity: 0, x: 20 });
  gsap.set('.hero__scroll-hint',  { opacity: 0 });

  const heroTl = gsap.timeline({ delay: 0.5 });

  heroTl
    /* Eyebrow slides in from left */
    .to('.hero__eyebrow', {
      opacity: 1, x: 0,
      duration: 1,
      ease: EASE_OUT3,
    })
    /* Gold rule extends right */
    .to('.hero__eyebrow-rule', {
      scaleX: 1,
      duration: 0.8,
      ease: EASE_OUT4,
    }, '-=0.4')
    /* Each headline line slides up from below its clip container — staggered */
    .to('.hero__line', {
      yPercent: 0,
      duration: 1.4,
      stagger: 0.14,
      ease: EASE_OUT4,
    }, '-=0.6')
    /* Subtext fades up */
    .to('.hero__subtext', {
      opacity: 0.7, y: 0,
      duration: 1,
      ease: EASE_OUT3,
    }, '-=0.7')
    /* Actions row (CTA + ghost link) */
    .to('.hero__actions', {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: EASE_OUT3,
    }, '-=0.55')
    /* Right-side luxury aside slides in */
    .to('.hero__aside', {
      opacity: 1, x: 0,
      duration: 1,
      ease: EASE_OUT3,
    }, '-=0.8')
    /* Scroll indicator last */
    .to('.hero__scroll-hint', {
      opacity: 1,
      duration: 1,
      ease: EASE_OUT3,
    }, '-=0.4');


  /* ══════════════════════════════════════════════
     5. HERO — scroll parallax
     Content drifts upward as user scrolls through the 210vh hero.
     Each layer moves at a slightly different rate for depth.
  ══════════════════════════════════════════════ */

  /* Content block drifts up and fades — cinematic exit */
  gsap.to('.hero__content', {
    y: -110,
    opacity: 0,
    ease: EASE_NONE,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '55%',
      scrub: 1.6,
    },
  });

  /* Aside drifts out with content */
  gsap.to('.hero__aside', {
    opacity: 0,
    x: 30,
    ease: EASE_NONE,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '40%',
      scrub: 1.2,
    },
  });

  /* Scroll hint disappears quickly */
  gsap.to('.hero__scroll-hint', {
    opacity: 0,
    ease: EASE_NONE,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '18%',
      scrub: 1,
    },
  });

  /* Video scales slowly — creates immersive zoom feel */
  gsap.to('.hero__video', {
    scale: 1.12,
    ease: EASE_NONE,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2.8,
    },
  });

  /* Glow fades and contracts */
  gsap.to('.hero__glow', {
    opacity: 0,
    scale: 0.5,
    ease: EASE_NONE,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '40%',
      scrub: 1,
    },
  });


  /* ══════════════════════════════════════════════
     6. ABOUT SECTION — premium reveals
  ══════════════════════════════════════════════ */

  /* Text column — staggered editorial reveal */
  const aboutTextTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about__inner',
      start: 'top 72%',
      toggleActions: 'play none none reverse',
    },
  });
  aboutTextTl
    .from('.about__text .section-label', {
      opacity: 0, y: 24,
      duration: 0.7, ease: EASE_OUT3,
    })
    .from('.about__label-rule', {
      scaleX: 0, transformOrigin: 'left center',
      duration: 0.9, ease: EASE_OUT4,
    }, '-=0.2')
    .from('.about__headline', {
      opacity: 0, y: 48,
      duration: 1.2, ease: EASE_OUT4,
    }, '-=0.5')
    .from('.about__body', {
      opacity: 0, y: 28,
      duration: 0.9, stagger: 0.18, ease: EASE_OUT3,
    }, '-=0.65')
    .from('.about__cta-wrap', {
      opacity: 0, y: 22,
      duration: 0.8, ease: EASE_OUT3,
    }, '-=0.45');

  /* Visual frame — enters from right with subtle scale, then floats */
  gsap.from('.about__frame', {
    x: 80,
    opacity: 0,
    scale: 0.96,
    duration: 1.6,
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.about__visual',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    onComplete: () => {
      /* Gentle organic float after entrance */
      gsap.to('.about__frame', {
        y: -16,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    },
  });

  /* Scroll parallax — visual column rises slightly slower than text */
  gsap.to('.about__visual', {
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 2,
    },
  });

  /* Quote block — unified premium entrance sequence */
  const quoteTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about__statement',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
  quoteTl
    /* 1. Diamond blinks in */
    .from('.about__quote-ornament', {
      opacity: 0, scale: 0.2,
      duration: 0.65, ease: EASE_OUT4,
    })
    /* 2. Divider lines expand outward from center */
    .from('.about__quote-rule', {
      scaleX: 0,
      transformOrigin: 'center center',
      duration: 1.3,
      stagger: 0.15,
      ease: EASE_OUT4,
    }, '-=0.25')
    /* 3. Quote rises softly — overlaps with lines extending */
    .from('.about__quote', {
      opacity: 0, y: 26,
      duration: 1.4, ease: EASE_OUT4,
    }, '-=0.95')
    /* 4. Attribution appears last with a calm delay */
    .from('.about__quote-cite', {
      opacity: 0, y: 10,
      duration: 0.9, ease: EASE_OUT3,
    }, '-=0.45');


  /* ══════════════════════════════════════════════
     7. CATEGORIES — staggered entrance
  ══════════════════════════════════════════════ */

  gsap.from('.categories .section-header', {
    opacity: 0, y: 40,
    duration: 1,
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.categories',
      start: 'top 72%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.cat-card', {
    opacity: 0,
    y: 65,
    scale: 0.95,
    duration: 1,
    stagger: { each: 0.12, from: 'start' },
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.categories__grid',
      start: 'top 76%',
      toggleActions: 'play none none reverse',
    },
  });


  /* ══════════════════════════════════════════════
     8. PRODUCTS — wave stagger entrance
  ══════════════════════════════════════════════ */

  gsap.from('.products .section-header', {
    opacity: 0, y: 40,
    duration: 1,
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.products',
      start: 'top 72%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.prod-card', {
    opacity: 0,
    y: 80,
    scale: 0.93,
    duration: 1.1,
    stagger: { each: 0.09, from: 'start', grid: 'auto' },
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.products__grid',
      start: 'top 78%',
      toggleActions: 'play none none reverse',
    },
  });


  /* ══════════════════════════════════════════════
     9. LIFESTYLE GRID — alternating direction entrance
  ══════════════════════════════════════════════ */

  gsap.from('.lifestyle .section-header', {
    opacity: 0, y: 40,
    duration: 1,
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.lifestyle',
      start: 'top 72%',
      toggleActions: 'play none none reverse',
    },
  });

  document.querySelectorAll('.life-cell').forEach((cell, i) => {
    const col = i % 3;
    const xFrom = col === 0 ? -50 : col === 2 ? 50 : 0;
    const yFrom = col === 1 ? 40 : 0;

    gsap.from(cell, {
      opacity: 0,
      x: xFrom,
      y: yFrom,
      scale: 0.96,
      duration: 1.2,
      delay: i * 0.07,
      ease: EASE_OUT4,
      scrollTrigger: {
        trigger: '.life-grid',
        start: 'top 76%',
        toggleActions: 'play none none reverse',
      },
    });
  });


  /* ══════════════════════════════════════════════
     10. TESTIMONIALS — carousel
  ══════════════════════════════════════════════ */

  /* Section header entrance */
  gsap.from('.testimonials .section-header', {
    opacity: 0, y: 40,
    duration: 1,
    ease: EASE_OUT4,
    scrollTrigger: {
      trigger: '.testimonials',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  /* ── Fade carousel ── */
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDots  = document.querySelectorAll('.testi__dot');
  let currentSlide = 0;
  let autoTimer    = null;

  gsap.set(testiCards, { opacity: 0 });

  function showCard(idx) {
    testiCards[idx].classList.add('is-active');
    gsap.fromTo(testiCards[idx],
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.4, ease: EASE_OUT3 }
    );
  }

  function hideCard(idx) {
    gsap.to(testiCards[idx], {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => testiCards[idx].classList.remove('is-active'),
    });
  }

  function goToSlide(idx) {
    if (idx === currentSlide) return;
    hideCard(currentSlide);
    currentSlide = idx;
    showCard(idx);
    testiDots.forEach((dot, i) => {
      dot.classList.toggle('testi__dot--on', i === idx);
      dot.setAttribute('aria-selected', i === idx);
    });
  }

  /* Reveal first card when section scrolls into view */
  ScrollTrigger.create({
    trigger: '.testimonials',
    start: 'top 72%',
    once: true,
    onEnter: () => showCard(0),
  });

  /* Auto-advance every 6 seconds */
  function startAuto() {
    autoTimer = setInterval(() => {
      goToSlide((currentSlide + 1) % testiCards.length);
    }, 8000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  /* Pause on hover — whole section */
  const testiSection = document.querySelector('.testimonials');
  if (testiSection) {
    testiSection.addEventListener('mouseenter', () => clearInterval(autoTimer));
    testiSection.addEventListener('mouseleave', startAuto);
  }

  /* Dot clicks */
  testiDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.idx));
      resetAuto();
    });
  });

  /* Touch swipe */
  let touchStartX = 0;
  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    testiTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    testiTrack.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goToSlide(diff > 0
          ? (currentSlide + 1) % testiCards.length
          : (currentSlide - 1 + testiCards.length) % testiCards.length);
        resetAuto();
      }
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════
     11. NEWSLETTER — botanical entrance + form
  ══════════════════════════════════════════════ */

  const nlTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.newsletter',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  nlTl
    .from('.nl__leaf--left',  { x: -120, opacity: 0, rotation: -20, duration: 1.5, ease: EASE_OUT4 })
    .from('.nl__leaf--right', { x: 120,  opacity: 0, rotation: 20,  duration: 1.5, ease: EASE_OUT4 }, '<')
    .from('.newsletter .section-label', { opacity: 0, y: 24, duration: 0.7, ease: EASE_OUT3 }, '-=0.8')
    .from('.nl__headline',  { opacity: 0, y: 40, duration: 1,   ease: EASE_OUT4 }, '-=0.5')
    .from('.nl__sub',       { opacity: 0, y: 28, duration: 0.8, ease: EASE_OUT3 }, '-=0.5')
    .from('.nl__form',      { opacity: 0, y: 22, duration: 0.7, ease: EASE_OUT3 }, '-=0.4');

  /* Form submission */
  const nlForm  = document.getElementById('nlForm');
  const nlInput = nlForm ? nlForm.querySelector('.nl__input') : null;

  if (nlForm && nlInput) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = nlInput.value.trim();
      if (!email || !email.includes('@') || !email.includes('.')) {
        /* Gentle shake */
        gsap.to(nlInput, {
          x: [-10, 10, -8, 8, -4, 4, 0],
          duration: 0.5,
          ease: 'power2.out',
        });
        nlInput.focus();
        return;
      }

      /* Success */
      gsap.to(nlForm, {
        opacity: 0,
        y: -20,
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => {
          nlForm.innerHTML = '<p class="nl__success">Thank you. Welcome to Bloom.</p>';
          gsap.from('.nl__success', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: EASE_OUT3,
          });
          gsap.to('.nl__success', { opacity: 1 });
        },
      });
    });
  }


  /* ══════════════════════════════════════════════
     12. FOOTER — stagger entrance
  ══════════════════════════════════════════════ */

  gsap.from('.footer__brand, .footer__col', {
    opacity: 0,
    y: 32,
    duration: 0.9,
    stagger: 0.08,
    ease: EASE_OUT3,
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });


  /* ══════════════════════════════════════════════
     13. MICRO-INTERACTIONS
  ══════════════════════════════════════════════ */

  /* — Wishlist heart pulse — */
  document.querySelectorAll('.prod-card__wish').forEach(btn => {
    btn.addEventListener('click', function () {
      const isWished = this.classList.toggle('is-wished');
      const heart    = this;

      if (isWished) {
        heart.textContent = '♥';
        gsap.fromTo(heart,
          { scale: 0.8 },
          {
            scale: [1.5, 0.9, 1.1, 1],
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)',
          }
        );
      } else {
        heart.textContent = '♡';
        gsap.to(heart, { scale: 1, duration: 0.3, ease: EASE_OUT3 });
      }
    });
  });

  /* — Add to Cart: text transition → "Added ✓" → revert — */
  document.querySelectorAll('.prod-card__add').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('is-added')) return;

      const original = this.textContent;
      this.classList.add('is-added');

      gsap.to(this, {
        scale: 0.93,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          this.textContent = 'Added ✓';
          gsap.fromTo(this,
            { scale: 0.85, opacity: 0.6 },
            { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }
          );

          setTimeout(() => {
            gsap.to(this, {
              opacity: 0,
              scale: 0.9,
              duration: 0.2,
              onComplete: () => {
                this.textContent = original;
                this.classList.remove('is-added');
                gsap.to(this, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' });
              },
            });
          }, 1800);
        },
      });
    });
  });

  /* — Category card shimmer on hover (trigger CSS animation) — */
  document.querySelectorAll('.cat-card').forEach(card => {
    const shimmer = card.querySelector('.cat-card__shimmer');
    if (!shimmer) return;

    card.addEventListener('mouseenter', () => {
      shimmer.style.animation = 'none';
      shimmer.offsetHeight; /* reflow */
      shimmer.style.animation = 'shimmerSlide 0.65s ease forwards';
    });
  });

  /* — Product card art parallax on hover — */
  document.querySelectorAll('.prod-card').forEach(card => {
    const art = card.querySelector('.prod-card__image');
    if (!art) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      gsap.to(art, {
        rotateY: x * 6,
        rotateX: -y * 4,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 600,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(art, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: EASE_OUT3,
      });
    });
  });

  /* — Lifestyle cell hover: background scale driven by CSS, caption by CSS — */
  /* (handled entirely in CSS for performance; no JS needed) */

  /* — Nav logo subtle hover — */
  const navLogo = document.querySelector('.nav__logo');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', () => {
      gsap.to(navLogo, { letterSpacing: '0.18em', duration: 0.4, ease: EASE_OUT3 });
    });
    navLogo.addEventListener('mouseleave', () => {
      gsap.to(navLogo, { letterSpacing: '0.14em', duration: 0.4, ease: EASE_OUT3 });
    });
  }


  /* ══════════════════════════════════════════════
     14. MOBILE NAV MENU (burger toggle)
  ══════════════════════════════════════════════ */
  const burger    = document.querySelector('.nav__burger');
  const navLinks  = document.querySelector('.nav__links');
  const navCta    = document.querySelector('.nav__cta');
  let menuOpen    = false;

  if (burger) {
    burger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      burger.setAttribute('aria-expanded', menuOpen);

      if (menuOpen) {
        /* Inject mobile menu if not already present */
        let mobileMenu = document.querySelector('.nav__mobile');
        if (!mobileMenu) {
          mobileMenu = document.createElement('div');
          mobileMenu.className = 'nav__mobile';
          mobileMenu.innerHTML = `
            <ul>
              <li><a href="#about">Story</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#lifestyle">Lifestyle</a></li>
            </ul>
            <a href="#shop" class="btn btn--primary" style="margin-top:1.5rem">Shop Collection</a>
          `;
          nav.appendChild(mobileMenu);

          /* Style the mobile menu */
          Object.assign(mobileMenu.style, {
            position: 'fixed',
            top: '0', left: '0', right: '0',
            height: '100dvh',
            background: 'rgba(247,243,238,0.97)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            zIndex: '99',
            fontSize: '1.5rem',
            fontFamily: 'var(--font-h)',
          });

          const lis = mobileMenu.querySelectorAll('li');
          lis.forEach(li => {
            Object.assign(li.style, { listStyle: 'none', marginBottom: '1rem', textAlign: 'center' });
          });
          const links = mobileMenu.querySelectorAll('a');
          links.forEach(a => {
            Object.assign(a.style, { color: 'var(--charcoal)', letterSpacing: '0.06em' });
            a.addEventListener('click', closeMobileMenu);
          });
        }

        gsap.set(mobileMenu, { display: 'flex', opacity: 0, y: -20 });
        gsap.to(mobileMenu, { opacity: 1, y: 0, duration: 0.45, ease: EASE_OUT3 });
        lenis.stop();

      } else {
        closeMobileMenu();
      }

      /* Animate burger lines */
      const spans = burger.querySelectorAll('span');
      if (menuOpen) {
        gsap.to(spans[0], { rotate: 45, y: 6.5, duration: 0.3, ease: EASE_OUT3 });
        gsap.to(spans[1], { rotate: -45, y: -6.5, duration: 0.3, ease: EASE_OUT3 });
      } else {
        gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3, ease: EASE_OUT3 });
        gsap.to(spans[1], { rotate: 0, y: 0, duration: 0.3, ease: EASE_OUT3 });
      }
    });
  }

  function closeMobileMenu() {
    menuOpen = false;
    if (burger) burger.setAttribute('aria-expanded', false);
    const mobileMenu = document.querySelector('.nav__mobile');
    if (mobileMenu) {
      gsap.to(mobileMenu, {
        opacity: 0, y: -20, duration: 0.35, ease: 'power3.in',
        onComplete: () => { mobileMenu.style.display = 'none'; },
      });
    }
    const spans = burger ? burger.querySelectorAll('span') : [];
    gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3, ease: EASE_OUT3 });
    gsap.to(spans[1], { rotate: 0, y: 0, duration: 0.3, ease: EASE_OUT3 });
    lenis.start();
  }


  /* ══════════════════════════════════════════════
     15. FOCUS-VISIBLE ENHANCEMENT
     Remove default browser focus ring; rely on custom CSS outline
  ══════════════════════════════════════════════ */
  document.documentElement.classList.add('js-loaded');


  /* ══════════════════════════════════════════════
     16. HERO VIDEO — ensure it plays (Safari fix)
  ══════════════════════════════════════════════ */
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      /* Autoplay blocked — video will display first frame */
      heroVideo.load();
    });
  }


  /* ══════════════════════════════════════════════
     17. PERFORMANCE — lazy ScrollTrigger refresh
  ══════════════════════════════════════════════ */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

}); /* end DOMContentLoaded */
