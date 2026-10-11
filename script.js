// ============================================================
// GEN5ROM V3 — RED & BLACK MOTION PORTFOLIO
// Core Interaction, Video Theater & Spline Performance
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 1. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.hidden;
      mobileMenu.hidden = !isHidden;
      mobileToggle.textContent = isHidden ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', String(isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.hidden = true;
        mobileToggle.textContent = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. SCROLLSPY NAVIGATION
  const navLinks = document.querySelectorAll('.nav-menu a');
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // 3. CINEMATIC VIDEO MODAL THEATER
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalTitle = document.getElementById('modalTitle');
  const modalRole = document.getElementById('modalRole');
  const modalTools = document.getElementById('modalTools');
  const modalDesc = document.getElementById('modalDesc');
  const closeVideoBtn = document.getElementById('closeVideoModal');

  function openVideo(trigger) {
    const videoId = trigger.dataset.video;
    if (!videoId || !videoModal || !modalIframe) return;

    modalTitle.textContent = trigger.dataset.title || 'Project Theater';
    modalRole.textContent = trigger.dataset.role || 'Video Editor & Motion Designer';
    modalTools.textContent = trigger.dataset.tools ? `Tools: ${trigger.dataset.tools}` : 'Adobe Premiere Pro, After Effects';
    modalDesc.textContent = trigger.dataset.desc || 'Commercial editing and motion graphics.';

    modalIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    videoModal.hidden = false;
    requestAnimationFrame(() => videoModal.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    if (!videoModal || !modalIframe) return;
    videoModal.classList.remove('open');
    setTimeout(() => {
      videoModal.hidden = true;
      modalIframe.src = '';
      document.body.style.overflow = '';
    }, 280);
  }

  document.querySelectorAll('.project-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => openVideo(trigger));
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideo(trigger);
      }
    });
  });

  if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);

  // 4. IMAGE LIGHTBOX MODAL
  const imageModal = document.getElementById('imageModal');
  const modalImgTag = document.getElementById('modalImgTag');
  const imageModalTitle = document.getElementById('imageModalTitle');
  const closeImageBtn = document.getElementById('closeImageModal');

  function openImage(trigger) {
    const src = trigger.dataset.src;
    const caption = trigger.dataset.caption;
    if (!src || !imageModal || !modalImgTag) return;

    modalImgTag.src = src;
    imageModalTitle.textContent = caption || 'Artwork';
    imageModal.hidden = false;
    requestAnimationFrame(() => imageModal.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeImage() {
    if (!imageModal || !modalImgTag) return;
    imageModal.classList.remove('open');
    setTimeout(() => {
      imageModal.hidden = true;
      modalImgTag.src = '';
      document.body.style.overflow = '';
    }, 280);
  }

  document.querySelectorAll('.image-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => openImage(trigger));
  });

  if (closeImageBtn) closeImageBtn.addEventListener('click', closeImage);

  // Close modals on backdrop click or Escape key
  [videoModal, imageModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeVideo();
        closeImage();
      }
    });
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeVideo();
      closeImage();
    }
  });

  // 5. SPLINE 3D OPTIMIZED VIEWER (Lazy-loaded with GPU pause)
  (function initSplineViewer() {
    const stage = document.getElementById('splineStage');
    const viewer = document.getElementById('splineViewer');
    const qualityButtons = document.querySelectorAll('.quality-buttons button');
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
            // Offscreen pause to save battery and maintain 60 FPS scrolling
            viewer.stop?.();
          }
        });
      }, { rootMargin: '250px' });

      splineObserver.observe(stage);
    } else {
      loadSplineScript();
    }

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

  // 6. MAGNETIC BUTTON INTERACTION (Desktop fine pointer only)
  if (!isTouchDevice && !isReducedMotion) {
    const magneticElements = document.querySelectorAll('.email-cta-btn, .btn-primary');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
});
