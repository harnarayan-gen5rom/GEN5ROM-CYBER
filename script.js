// ============================================================
// GEN5ROM 2.0 — THE MOTION PLAYGROUND
// Core Interaction & Animation System
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 1. PRELOADER & INTRO CURTAIN
  const preloader = document.getElementById('preloader');
  const preloaderCount = document.getElementById('preloaderCount');
  const hasVisited = sessionStorage.getItem('gen5rom_entered');

  if (preloader) {
    if (hasVisited || isReducedMotion) {
      preloader.classList.add('dismissed');
    } else {
      let count = 0;
      const interval = setInterval(() => {
        count += Math.floor(Math.random() * 12) + 6;
        if (count >= 100) {
          count = 100;
          clearInterval(interval);
          if (preloaderCount) preloaderCount.textContent = '100';
          setTimeout(() => {
            preloader.classList.add('dismissed');
            sessionStorage.setItem('gen5rom_entered', 'true');
          }, 350);
        } else {
          if (preloaderCount) preloaderCount.textContent = String(count).padStart(2, '0');
        }
      }, 35);
    }
  }

  // 2. CUSTOM CONTEXTUAL CURSOR (Desktop only)
  const cursorDot = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');

  if (!isTouchDevice && cursorDot && cursorFollower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('a, button, .project-trigger, .image-trigger, .pipeline-step, .software-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (el.classList.contains('project-trigger')) {
          document.body.classList.add('cursor-play');
        } else {
          document.body.classList.add('cursor-hover');
        }
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-play');
      });
    });
  }

  // 3. MAGNETIC BUTTON INTERACTION (Desktop)
  if (!isTouchDevice && !isReducedMotion) {
    const magneticButtons = document.querySelectorAll('.btn-primary, .contact-email-anchor');
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // 4. FLOATING NAVIGATION & SCROLLSPY
  const navLinks = document.querySelectorAll('.nav-links a');
  const observedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    observedSections.forEach(sec => sectionObserver.observe(sec));
  }

  // 5. PROJECT CATEGORY FILTERING
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-hero-card, .project-split-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // 6. CINEMATIC PROJECT MODAL THEATER
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalVideoIframe');
  const modalTitle = document.getElementById('modalVideoTitle');
  const modalCategory = document.getElementById('modalVideoCategory');
  const modalRole = document.getElementById('modalVideoRole');
  const modalTools = document.getElementById('modalVideoTools');
  const modalDesc = document.getElementById('modalVideoDesc');
  const closeVideoBtn = document.getElementById('closeVideoModal');

  function openVideoModal(card) {
    const videoId = card.dataset.video;
    if (!videoId || !videoModal || !modalIframe) return;

    modalTitle.textContent = card.dataset.title || 'Project Theater';
    modalCategory.textContent = (card.dataset.category || 'VIDEO').toUpperCase();
    modalRole.textContent = card.dataset.role || 'Video Editor & Motion Designer';
    modalTools.textContent = card.dataset.tools || 'Premiere Pro, After Effects';
    modalDesc.textContent = card.dataset.desc || 'High-retention commercial video editing and motion graphics.';

    modalIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    videoModal.hidden = false;
    requestAnimationFrame(() => videoModal.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal || !modalIframe) return;
    videoModal.classList.remove('active');
    setTimeout(() => {
      videoModal.hidden = true;
      modalIframe.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  document.querySelectorAll('.project-trigger').forEach(card => {
    card.addEventListener('click', () => openVideoModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideoModal(card);
      }
    });
  });

  if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);

  // 7. IMAGE LIGHTBOX MODAL
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalLightboxImage');
  const modalImageTitle = document.getElementById('modalImageTitle');
  const closeImageBtn = document.getElementById('closeImageModal');

  function openImageModal(card) {
    const src = card.dataset.src;
    const caption = card.dataset.caption;
    if (!src || !imageModal || !modalImage) return;

    modalImage.src = src;
    modalImageTitle.textContent = caption || 'Key Visual';
    imageModal.hidden = false;
    requestAnimationFrame(() => imageModal.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function closeImageModal() {
    if (!imageModal || !modalImage) return;
    imageModal.classList.remove('active');
    setTimeout(() => {
      imageModal.hidden = true;
      modalImage.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  document.querySelectorAll('.image-trigger').forEach(card => {
    card.addEventListener('click', () => openImageModal(card));
  });

  if (closeImageBtn) closeImageBtn.addEventListener('click', closeImageModal);

  // Close modals on backdrop click or ESC
  [videoModal, imageModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeVideoModal();
        closeImageModal();
      }
    });
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeImageModal();
    }
  });

  // 8. INTERACTIVE 3D SPLINE VIEWER (Optimized & Lazy-Loaded)
  (function initSplineStage() {
    const stage = document.getElementById('splineStage');
    const viewer = document.getElementById('splineViewer');
    const qualityButtons = document.querySelectorAll('.spline-controls button');
    if (!stage || !viewer) return;

    let isScriptLoaded = false;
    function loadSplineScript() {
      if (isScriptLoaded) return;
      isScriptLoaded = true;
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://cdn.spline.design/@splinetool/viewer@2.0.75/build/spline-viewer.js';
      document.body.appendChild(script);
    }

    if ('IntersectionObserver' in window) {
      const splineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadSplineScript();
            viewer.play?.();
          } else {
            // Pause offscreen rendering to prevent battery / frame drop
            viewer.stop?.();
          }
        });
      }, { rootMargin: '250px' });

      splineObserver.observe(stage);
    } else {
      loadSplineScript();
    }

    // Quality Modes
    qualityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        qualityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const quality = btn.dataset.quality;
        const runtime = viewer._spline;
        const renderer = runtime?._renderer;
        if (typeof renderer?.setPixelRatio === 'function') {
          const dpr = window.devicePixelRatio || 1;
          const ratio = quality === 'crisp' ? Math.min(2, dpr) : quality === 'smooth' ? 0.8 : 1.2;
          renderer.setPixelRatio(ratio);
          runtime.requestRender?.();
        }
      });
    });
  })();

  // 9. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobileToggle');
  const navCapsule = document.querySelector('.nav-capsule');
  if (mobileToggle && navCapsule) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navCapsule.classList.toggle('expanded');
      mobileToggle.textContent = isExpanded ? '✕' : '☰';
    });
  }

  // 10. SMOOTH ANCHOR NAVIGATION
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: isReducedMotion ? 'instant' : 'smooth',
          block: 'start'
        });
      }
    });
  });
});
