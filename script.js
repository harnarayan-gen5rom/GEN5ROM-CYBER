/* ==========================================================================
   GEN5ROM // CYBER OS v4.0 — 3D INTERACTIVE, CANVAS & ANIMATION ENGINE
   ========================================================================== */

// 1. Multi-Gradient Theme Switcher
function setCyberTheme(theme, btn) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.grad-swatch').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// 2. Hero 3D Holographic DP Switcher (Photo DP <-> Stylized Art DP)
let isArtDpActive = false;
function flipOperatorDp() {
  const img = document.getElementById('heroDpImage');
  const btn = document.getElementById('dpFlipBtn');
  if (!img) return;
  img.style.transform = 'scale(0.92) rotateY(90deg)';
  setTimeout(() => {
    isArtDpActive = !isArtDpActive;
    if (isArtDpActive) {
      img.src = 'assets/harnarayan-picass.webp';
      img.onerror = function() {
        this.onerror = null;
        this.src = 'https://raw.githubusercontent.com/harnarayan-gen5rom/GEN5ROM-CYBER/main/assets/harnarayan-picass.webp';
      };
      if (btn) btn.textContent = 'Photo DP ⟳';
    } else {
      img.src = 'assets/harnarayan-profile.webp';
      img.onerror = function() {
        this.onerror = null;
        this.src = 'https://raw.githubusercontent.com/harnarayan-gen5rom/GEN5ROM-CYBER/main/assets/harnarayan-profile.webp';
      };
      if (btn) btn.textContent = 'Art DP ⟳';
    }
    img.style.transform = 'scale(1) rotateY(0deg)';
  }, 180);
}

// 3. Interactive Showreel Theater Stream Switcher
function switchStream(videoId, btn) {
  const player = document.getElementById('mainTheaterPlayer');
  if (player) {
    player.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
  }
  document.querySelectorAll('.stream-btn').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// 4. Organized 15-Project Vault Filter & Live Search
let currentCategory = 'all';
function filterVault(category, btn) {
  currentCategory = category;
  document.querySelectorAll('.filter-tab').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyVaultFilter();
}

function searchVault(query) {
  applyVaultFilter(query);
}

function applyVaultFilter(searchOverride) {
  const searchInput = document.getElementById('vaultSearchInput');
  const q = (searchOverride !== undefined ? searchOverride : (searchInput ? searchInput.value : '')).toLowerCase().trim();
  document.querySelectorAll('#projectsGrid .project-card').forEach(card => {
    const cat = card.getAttribute('data-category');
    const text = card.innerText.toLowerCase();
    const matchesCat = (currentCategory === 'all' || cat === currentCategory);
    const matchesQuery = (!q || text.includes(q));
    card.style.display = (matchesCat && matchesQuery) ? 'flex' : 'none';
  });
}

// 5. Lightbox Modal for Video & Full-Res Key Art Posters
function openVideoLightbox(videoId, title) {
  const modal = document.getElementById('cyberLightbox');
  const stage = document.getElementById('lightboxStage');
  const label = document.getElementById('lightboxTitle');
  if (!modal || !stage) return;
  if (label) label.textContent = '// STREAMING: ' + title;
  stage.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  modal.classList.add('open');
}

function openPosterLightbox(src, title) {
  const modal = document.getElementById('cyberLightbox');
  const stage = document.getElementById('lightboxStage');
  const label = document.getElementById('lightboxTitle');
  if (!modal || !stage) return;
  const rawFallback = 'https://raw.githubusercontent.com/harnarayan-gen5rom/GEN5ROM-CYBER/main/' + src;
  if (label) label.textContent = '// HIGH-RES KEY ART: ' + title;
  stage.innerHTML = '<img src="' + src + '" onerror="this.onerror=null;this.src=\'' + rawFallback + '\'" alt="' + title + '" />';
  modal.classList.add('open');
}

function closeLightbox() {
  const modal = document.getElementById('cyberLightbox');
  const stage = document.getElementById('lightboxStage');
  if (modal) modal.classList.remove('open');
  if (stage) stage.innerHTML = '';
}

// 6. Copy Email Helper with Instant Feedback
function copyCreatorEmail(el) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText('narayansingh28489@gmail.com');
  }
  const badge = el.querySelector('.copy-status');
  if (badge) {
    const orig = badge.textContent;
    badge.textContent = 'COPIED ✓';
    setTimeout(() => { badge.textContent = orig; }, 2000);
  }
}

// 7. Initialize 3D Tilt Physics, Cursor Spotlight, Typewriter & Canvas Particles
document.addEventListener('DOMContentLoaded', () => {
  // Cursor Spotlight
  window.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  });

  // 3D Perspective Tilt + Specular Glare on all .tilt-card elements
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6.5;
      const rotateY = ((x - centerX) / centerX) * 6.5;
      card.style.transform = `perspective(1050px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
      card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1050px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // Scroll Reveal & Animated Skill Progress Meters
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.meter-fill[data-width]').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width');
        });
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Typewriter Role Rotator
  const roles = [
    'COMMERCIAL VIDEO EDITOR // PREMIERE PRO',
    'KINETIC MOTION DESIGNER // AFTER EFFECTS',
    '3D VFX & CAMERA TRACKING SPECIALIST',
    'KEY ART POSTER & BRAND VISUAL DESIGNER'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const typeTarget = document.getElementById('roleTypewriter');

  function tickTypewriter() {
    if (!typeTarget) return;
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      typeTarget.textContent = current.slice(0, charIdx);
      if (charIdx >= current.length) {
        deleting = true;
        setTimeout(tickTypewriter, 1900);
        return;
      }
      setTimeout(tickTypewriter, 42);
    } else {
      charIdx--;
      typeTarget.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tickTypewriter, 260);
        return;
      }
      setTimeout(tickTypewriter, 22);
    }
  }
  tickTypewriter();

  // Escape key closes Lightbox
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 60FPS Interactive Cyber Particle Constellation Canvas
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const nodes = Array.from({ length: 48 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 2 + 1
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#00ffa3';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.45;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 145) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = accent;
            ctx.globalAlpha = (1 - dist / 145) * 0.16;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }
});
