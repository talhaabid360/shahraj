/*
 * ShaRaj Global — interactive site prototype
 * All motion is built with browser APIs: no heavyweight animation framework.
 * Update CONFIG before launching a production website.
 */
(() => {
  'use strict';
  const CONFIG = {
    contactEmail: '', // Add your real inbox here to enable native email composition.
    newsletterEndpoint: '' // Add your mailing-list signup endpoint before accepting subscriptions.
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Primary navigation: mobile dropdown, accessible focus and close-on-navigation.
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  function closeMenu() {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
    navLinks?.classList.remove('is-open');
  }
  menuToggle?.addEventListener('click', () => {
    const opened = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opened));
    menuToggle.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
    navLinks?.classList.toggle('is-open', opened);
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => {
    if (navLinks?.classList.contains('is-open') && !event.target.closest('.nav-shell')) closeMenu();
  });

  // Visual reading progress; requestAnimationFrame avoids excessive layout updates.
  const progressBar = $('#progressBar');
  let scrollScheduled = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    scrollScheduled = false;
  }
  addEventListener('scroll', () => {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();
  $('#copyrightYear').textContent = String(new Date().getFullYear());

  // Scroll-reveal and counters only when in view.
  const revealTargets = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px 35px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else revealTargets.forEach(el => el.classList.add('is-visible'));

  const wordCircle = $('#circleMark');
  if (wordCircle && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries, observer) => {
      if (entries[0]?.isIntersecting) { wordCircle.classList.add('is-drawn'); observer.disconnect(); }
    }, { threshold: .55 }).observe(wordCircle);
  } else wordCircle?.classList.add('is-drawn');

  function animateCount(el) {
    const target = Number(el.dataset.count || '0');
    if (reduceMotion) { el.textContent = String(target).padStart(target === 360 ? 3 : 2, '0'); return; }
    const start = performance.now();
    const duration = 1850;
    const ease = t => 1 - Math.pow(1 - t, 4);
    function frame(now) {
      const ratio = Math.min(1, (now - start) / duration);
      const value = Math.round(target * ease(ratio));
      el.textContent = String(value).padStart(target === 360 ? 3 : 2, '0');
      if (ratio < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const counters = $$('.countup');
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: .35 });
    counters.forEach(el => countObserver.observe(el));
  } else counters.forEach(animateCount);

  // Atmospheric cursor-follow (desktop only).
  const cursorGlow = $('.cursor-glow');
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    window.addEventListener('pointermove', event => {
      if (cursorGlow) {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
        cursorGlow.style.opacity = '1';
      }
    }, { passive: true });
  }

  // Hero: very light 3D pointer-parallax, responsive without WebGL.
  const heroOrbit = $('#heroOrbit');
  const heroArt = $('.hero-art');
  if (heroArt && heroOrbit && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    heroArt.addEventListener('pointermove', event => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      heroOrbit.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 16}deg) translate3d(${x * 9}px,${y * 9}px,0)`;
    }, { passive: true });
    heroArt.addEventListener('pointerleave', () => { heroOrbit.style.transform = ''; });
  }

  // 3D circular services carousel: arrow navigation, side-card selection, keys and swipes.
  const serviceStage = $('#serviceStage');
  const serviceCards = $$('.service-card', serviceStage || document);
  const serviceNames = ['Podcast Production','Website Development','Social Media & Content','Search Engine Optimization','AI Chatbots','Workflow Automation','Brand & Creative'];
  let serviceIndex = 0;
  const mod = (n, divisor) => ((n % divisor) + divisor) % divisor;
  function setService(next) {
    if (!serviceStage || !serviceCards.length) return;
    serviceIndex = mod(next, serviceCards.length);
    serviceCards.forEach((card, index) => {
      let delta = index - serviceIndex;
      if (delta > serviceCards.length / 2) delta -= serviceCards.length;
      if (delta < -serviceCards.length / 2) delta += serviceCards.length;
      const dist = Math.abs(delta);
      const scale = 1 - Math.min(dist, 3) * .145;
      const xStep = window.innerWidth <= 640 ? 89 : 88;
      const y = dist * (window.innerWidth <= 640 ? 12 : 21);
      card.style.transform = `translateX(calc(-50% + ${delta * xStep}%)) translateY(${y}px) rotateY(${-delta * 16}deg) scale(${scale})`;
      card.style.opacity = dist <= 2 ? String(Math.max(.22, 1 - dist * .28)) : '0';
      card.style.filter = dist ? `saturate(${Math.max(.55, 1 - .15 * dist)})` : 'none';
      card.style.zIndex = String(10 - dist);
      card.style.pointerEvents = dist <= 2 ? 'auto' : 'none';
      card.classList.toggle('is-active', dist === 0);
      card.setAttribute('aria-hidden', String(dist !== 0));
      $$('a', card).forEach(link => { link.tabIndex = dist === 0 ? 0 : -1; });
    });
    const number = String(serviceIndex + 1).padStart(2, '0');
    const count = $('#serviceCounter');
    if (count) count.innerHTML = `${number} <i>/ 07</i>`;
    const title = $('#serviceCurrentName');
    if (title) title.textContent = serviceNames[serviceIndex];
    const progress = $('#serviceProgress');
    if (progress) progress.style.width = `${(serviceIndex + 1) / serviceCards.length * 100}%`;
  }
  serviceCards.forEach((card, index) => card.addEventListener('click', event => {
    if (serviceIndex !== index) {
      event.preventDefault();
      setService(index);
    }
  }));
  $('#servicePrev')?.addEventListener('click', () => setService(serviceIndex - 1));
  $('#serviceNext')?.addEventListener('click', () => setService(serviceIndex + 1));
  serviceStage?.setAttribute('tabindex', '0');
  serviceStage?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); setService(serviceIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); setService(serviceIndex - 1); }
  });
  let pointerStart = null;
  serviceStage?.addEventListener('pointerdown', event => { pointerStart = { x:event.clientX, time:Date.now() }; }, { passive: true });
  serviceStage?.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const change = event.clientX - pointerStart.x;
    if (Math.abs(change) > 50 && Date.now() - pointerStart.time < 1500) setService(serviceIndex + (change < 0 ? 1 : -1));
    pointerStart = null;
  }, { passive: true });
  window.addEventListener('resize', () => setService(serviceIndex), { passive: true });
  setService(0);

  // Connected globe: hover/focus on services to change the editorial detail.
  const ecosystemDetails = {
    Strategy: 'The right plan makes every creative decision work harder.',
    Content: 'Great stories give people a reason to listen, watch and come back.',
    Social: 'Show up consistently, creatively and in the places that matter.',
    Web: 'Turn the first click into an experience your visitors remember.',
    SEO: 'Make valuable work discoverable by the people searching for it.',
    AI: 'Make customer experiences and everyday operations more intelligent.'
  };
  const focusTitle = $('#focusTitle');
  const focusDescription = $('#focusDescription');
  $$('.orbit-option').forEach(button => {
    function setFocus() {
      const label = button.dataset.focus;
      $$('.orbit-option').forEach(el => el.classList.toggle('is-current', el === button));
      if (focusTitle) focusTitle.textContent = label;
      if (focusDescription) focusDescription.textContent = ecosystemDetails[label] || '';
    }
    button.addEventListener('pointerenter', setFocus);
    button.addEventListener('focus', setFocus);
    button.addEventListener('click', setFocus);
  });
  const ecosystemSphere = $('#ecosystemSphere');
  const ecosystemVisual = $('#ecosystemVisual');
  if (ecosystemSphere && ecosystemVisual && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    ecosystemVisual.addEventListener('pointermove', event => {
      const r = ecosystemVisual.getBoundingClientRect();
      const x = (event.clientX - (r.left + r.width / 2)) / r.width;
      const y = (event.clientY - (r.top + r.height / 2)) / r.height;
      ecosystemSphere.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 19}deg)`;
    }, { passive: true });
    ecosystemVisual.addEventListener('pointerleave', () => { ecosystemSphere.style.transform = ''; });
  }

  // Partnership length: updates text without inventing discounts or fees.
  const termButtons = $$('.term-btn');
  termButtons.forEach(button => button.addEventListener('click', () => {
    termButtons.forEach(el => { el.classList.toggle('is-active', el === button); el.setAttribute('aria-pressed', String(el === button)); });
    const months = button.dataset.term;
    $$('.package-term').forEach(el => { el.textContent = `${months}-month collaboration option`; });
  }));

  // Newsletter: explicitly demo-only unless configured to a real signup endpoint.
  const newsletterForm = $('#newsletterForm');
  newsletterForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const email = $('#newsletterEmail')?.value.trim();
    const status = $('#newsletterFeedback');
    if (!email || !newsletterForm.reportValidity()) return;
    if (!CONFIG.newsletterEndpoint) {
      status.textContent = 'Preview only: no subscription was sent. Connect your newsletter platform before launch.';
      status.style.color = '#E6D6FB';
      return;
    }
    try {
      const response = await fetch(CONFIG.newsletterEndpoint, { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error('Signup not accepted');
      status.textContent = 'Thank you! Check your inbox for confirmation.';
      newsletterForm.reset();
    } catch {
      status.textContent = 'That did not go through. Please try again later.';
    }
  });

  // Project form: compose an editable enquiry. Without a configured real inbox,
  // copy the message for the developer instead of falsely claiming it was sent.
  const projectForm = $('#projectForm');
  projectForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!projectForm.reportValidity()) return;
    const values = new FormData(projectForm);
    const subject = `ShaRaj Global project inquiry — ${values.get('service')}`;
    const message = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nInterested in: ${values.get('service')}\n\nProject details:\n${values.get('message')}`;
    const status = $('#projectFeedback');
    if (CONFIG.contactEmail) {
      window.location.href = `mailto:${encodeURIComponent(CONFIG.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      status.textContent = 'Your email app should open with a prepared message. Please send it there to complete your inquiry.';
    } else {
      try {
        await navigator.clipboard.writeText(`${subject}\n\n${message}`);
        status.textContent = 'Inquiry copied to your clipboard. This is a preview; no message has been sent. Configure your contact inbox before launch.';
      } catch {
        status.textContent = 'This preview does not send messages. Please configure the contact email before launch.';
      }
    }
  });


  
/* SEAMLESS HERO MARQUEE */

const heroTicker = document.querySelector(
  '.hero-bottom .ticker'
);

if (heroTicker) {
  const track = heroTicker.querySelector('.ticker-track');
  const firstSet = track?.querySelector('.ticker-set');

  if (track && firstSet) {
    function buildSeamlessTicker() {

      // Remove previously generated copies
      track.querySelectorAll(
        '.ticker-set:not(:first-child)'
      ).forEach(el => el.remove());

      const setWidth = firstSet.getBoundingClientRect().width;
      if (!setWidth) return;

      // Generate enough copies to cover the screen
      const copies = Math.ceil(
        heroTicker.clientWidth / setWidth
      ) + 2;

      for (let i = 1; i < copies; i++) {
        const clone = firstSet.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }

      // Move exactly one group per cycle
      track.style.setProperty(
        '--ticker-shift',
        `-${setWidth}px`
      );

      // Consistent scrolling speed
      track.style.setProperty(
        '--ticker-duration',
        `${(setWidth / 65).toFixed(2)}s`
      );

      // Restart animation after resizing
      track.style.animation = 'none';
      void track.offsetWidth;
      track.style.animation = '';
    }

    buildSeamlessTicker();

    document.fonts?.ready.then(buildSeamlessTicker);

    let tickerResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(tickerResizeTimer);
      tickerResizeTimer = setTimeout(
        buildSeamlessTicker, 150
      );
    });
  }
}

// CLIENT PARTNERSHIPS — paste inside the existing (() => { ... })(); in script.js
// The portraits, cream name labels, and captions MOVE TOGETHER between the seven fixed positions.
const partnershipSection = document.querySelector('.client-partnerships');
const partnershipStage = partnershipSection?.querySelector('.client-gallery-stage');

if (partnershipStage) {
  const clientFrames = [...partnershipStage.querySelectorAll('.client-gallery-card')];
  // Matches the reference: three upper frames and four lower frames.
  const clientSlots = [
    { x: '6%',  y: '6%',  w: '28%', h: '48%', angle: '-3deg' },
    { x: '38%', y: '11%', w: '30%', h: '43%', angle: '2deg' },
    { x: '72%', y: '7%',  w: '27%', h: '47%', angle: '3deg' },
    { x: '0%',  y: '57%', w: '24%', h: '38%', angle: '-4deg' },
    { x: '26%', y: '55%', w: '28%', h: '43%', angle: '2deg' },
    { x: '56%', y: '54%', w: '24%', h: '41%', angle: '-2deg' },
    { x: '82%', y: '57%', w: '20%', h: '38%', angle: '3deg' }
  ];
  // Clockwise path: upper-left > upper-middle > upper-right > lower-right,
  // then left across the bottom and back UP to upper-left.
  const nextClientSlot = [1, 2, 6, 0, 3, 4, 5];
  const clientDesktop = window.matchMedia('(min-width: 701px)');
  const clientReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let clientGalleryVisible = false;
  let clientGalleryPaused = false;
  let clientRotationTimer = null;

  function moveClientFrame(frame, destination) {
    const p = clientSlots[destination];
    frame.dataset.slot = String(destination);
    frame.style.left = p.x;
    frame.style.top = p.y;
    frame.style.width = p.w;
    frame.style.height = p.h;
    frame.style.setProperty('--slot-rotate', p.angle);
    // The label is inside the figure, so it travels with its actual portrait.
  }

  function rotateClientGallery() {
    clientFrames.forEach((frame, index) => {
      const currentSlot = Number(frame.dataset.slot || 0);
      moveClientFrame(frame, nextClientSlot[currentSlot]);
    });
  }

  function stopClientGallery() {
    if (clientRotationTimer !== null) {
      clearInterval(clientRotationTimer);
      clientRotationTimer = null;
    }
  }

  function syncClientGallery() {
    stopClientGallery();
    if (!clientGalleryVisible || clientGalleryPaused || !clientDesktop.matches ||
        clientReduceMotion.matches || document.hidden) return;
    // Deliberately slow: 6.5-second hold, 1.65-second movement per transition.
    clientRotationTimer = setInterval(rotateClientGallery, 7900);
  }

  partnershipStage.classList.add('is-ready');
  if ('IntersectionObserver' in window) {
    const clientGalleryObserver = new IntersectionObserver(entries => {
      clientGalleryVisible = entries[0]?.isIntersecting || false;
      partnershipStage.classList.toggle('is-in-view', clientGalleryVisible);
      syncClientGallery();
    }, {threshold: 0.18});
    clientGalleryObserver.observe(partnershipSection);
  } else {
    clientGalleryVisible = true;
    partnershipStage.classList.add('is-in-view');
  }

  partnershipStage.addEventListener('mouseenter', () => {
    clientGalleryPaused = true;
    syncClientGallery();
  });
  partnershipStage.addEventListener('mouseleave', () => {
    clientGalleryPaused = false;
    syncClientGallery();
  });
  document.addEventListener('visibilitychange', syncClientGallery);
  clientDesktop.addEventListener('change', syncClientGallery);
  clientReduceMotion.addEventListener('change', syncClientGallery);
  syncClientGallery();
}

























  
})();
