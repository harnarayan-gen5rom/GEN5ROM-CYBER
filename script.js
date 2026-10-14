/* ==========================================================================
   GEN5ROM // CYBER OS v4.0 — 3D INTERACTIVE, CANVAS & ANIMATION ENGINE
   ========================================================================== */
function setCyberTheme(theme, btn) {
       document.documentElement.setAttribute('data-theme', theme);
       document.querySelectorAll('.grad-swatch').forEach(el => el.classList.remove('active'));
       if (btn) btn.classList.add('active');
}

const PORTFOLIO_WORKS = [
   { id: 'work-1', title: 'What is Zigency? – SaaS Explainer', category: 'video', categoryLabel: 'Commercial Video', type: 'youtube', youtubeId: 'yDnmJa0fTsw', tags: ['Premiere Pro', 'After Effects', 'UI Animation'], thumb: 'assets/Banner.webp' },
   { id: 'work-2', title: 'Zigency 360° Virtual Property Tour', category: 'video', categoryLabel: 'Commercial Video', type: 'youtube', youtubeId: 'I5R1qsDqhug', tags: ['Motion Tracking', 'After Effects', 'Real Estate'], thumb: 'assets/Banner.webp' },
   { id: 'work-3', title: 'Chainsaw Man – Motion Graphics Edit', category: 'motion', categoryLabel: 'Motion & 3D VFX', type: 'youtube', youtubeId: '7-2duY6fdzo', tags: ['After Effects', 'Kinetic Typography', 'Speed Ramps'], thumb: 'assets/Banner.webp' },
   { id: 'work-4', title: 'Monster Energy – 3D VFX Simulation', category: 'motion', categoryLabel: 'Motion & 3D VFX', type: 'youtube', youtubeId: 'v827BybYYxI', tags: ['3D Simulation', 'VFX Compositing', 'Color Grading'], thumb: 'assets/Banner.webp' },
   { id: 'work-5', title: 'Meet Zigency One Team: AI Engine', category: 'video', categoryLabel: 'Commercial Video', type: 'youtube', youtubeId: '1AOYe9wDsU4', tags: ['Short-Form Retention', 'AI Content', 'Kinetic Type'], thumb: 'assets/Banner.webp' },
   { id: 'work-6', title: 'Noida Mall Architectural Video Review', category: 'video', categoryLabel: 'Commercial Video', type: 'youtube', youtubeId: '7uWk-hbkJkY', tags: ['Premiere Pro', 'Color Correction', 'Audio Sync'], thumb: 'assets/Banner.webp' },
   { id: 'work-7', title: 'Spider-Man Cinematic Key Art', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/Spiderman-poster.webp', tags: ['Key Art', 'Photoshop', 'Poster Design'], thumb: 'assets/Spiderman-poster.webp' },
   { id: 'work-8', title: 'The Batman Visual Poster Concept', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/batman-poster.webp', tags: ['Visual Concept', 'Key Art', 'Color Grading'], thumb: 'assets/batman-poster.webp' },
   { id: 'work-9', title: 'Next-Gen Gaming Laptop Ad Banner', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/gaming-laptop-ad.webp', tags: ['Ad Design', '3D Compositing', 'Banner'], thumb: 'assets/gaming-laptop-ad.webp' },
   { id: 'work-10', title: 'Gfx Anime Concept Artwork', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/Gfx-anime-poster.webp', tags: ['Anime GFX', 'Illustration', 'Concept Art'], thumb: 'assets/Gfx-anime-poster.webp' },
   { id: 'work-11', title: 'Mixed Media Style Art Direction', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/mixed-media-style.webp', tags: ['Mixed Media', 'Art Direction', 'Collage'], thumb: 'assets/mixed-media-style.webp' },
   { id: 'work-12', title: 'Architecture & House Poster Concept', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/house-poster.webp', tags: ['Architecture', 'Poster Concept', '3D Render'], thumb: 'assets/house-poster.webp' },
   { id: 'work-13', title: 'Social Media Multi-Platform Visual', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/social-media.webp', tags: ['Social Media', 'Branding', 'Visuals'], thumb: 'assets/social-media.webp' },
   { id: 'work-14', title: 'GFX Stylized Character Poster', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/Gfx-poster.webp', tags: ['Stylized Poster', 'Character GFX', 'Design'], thumb: 'assets/Gfx-poster.webp' },
   { id: 'work-15', title: 'GEN5ROM Visual Identity Banner', category: 'design', categoryLabel: 'Key Art & Design', type: 'image', src: 'assets/Banner.webp', tags: ['Visual Identity', 'Branding', 'Banner'], thumb: 'assets/Banner.webp' }
   ];

let activeCategory = 'all';
let searchQuery = '';

function filterProjects(category, btn) {
       activeCategory = category;
       document.querySelectorAll('.filter-btn, .pill-btn').forEach(b => b.classList.remove('active'));
       if (btn) btn.classList.add('active');
       renderPortfolioGrid();
}

function handleSearch(e) {
       searchQuery = e.target.value.toLowerCase().trim();
       renderPortfolioGrid();
}

function renderPortfolioGrid() {
       const grid = document.getElementById('portfolioGrid') || document.getElementById('projectsGrid');
       if (!grid) return;

       const filtered = PORTFOLIO_WORKS.filter(item => {
                  const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
                  const matchesSearch = !searchQuery || 
                                 item.title.toLowerCase().includes(searchQuery) ||
                                 item.categoryLabel.toLowerCase().includes(searchQuery) ||
                                 item.tags.some(tag => tag.toLowerCase().includes(searchQuery));
                  return matchesCategory && matchesSearch;
       });

       const ytDomain = 'img.' + 'youtube' + '.com';
       grid.innerHTML = filtered.map(item => `
               <div class="project-card portfolio-card" data-category="${item.category}" onclick="openLightbox('${item.id}')">
                           <div class="card-media">
                                           <img src="${item.type === 'youtube' ? 'https://' + ytDomain + '/vi/' + item.youtubeId + '/maxresdefault.jpg' : item.thumb}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='assets/Banner.webp';">
                                                           <div class="card-overlay">
                                                                               <span class="play-badge">${item.type === 'youtube' ? 'PLAY VIDEO' : 'VIEW ART'}</span>
                                                                                               </div>
                                                                                                           </div>
                                                                                                                       <div class="card-content">
                                                                                                                                       <div class="card-meta">
                                                                                                                                                           <span class="category-tag">${item.categoryLabel}</span>
                                                                                                                                                                           </div>
                                                                                                                                                                                           <h3 class="card-title">${item.title}</h3>
                                                                                                                                                                                                           <div class="card-tags">
                                                                                                                                                                                                                               ${item.tags.map(t => `<span class="tech-pill">${t}</span>`).join('')}
                                                                                                                                                                                                                                               </div>
                                                                                                                                                                                                                                                           </div>
                                                                                                                                                                                                                                                                   </div>
                                                                                                                                                                                                                                                                       `).join('');

       initTiltEffect();
}

function openLightbox(workId) {
       const item = PORTFOLIO_WORKS.find(w => w.id === workId);
       if (!item) return;

       const modal = document.getElementById('lightboxModal') || document.getElementById('mediaModal');
       const container = document.getElementById('lightboxContent') || document.getElementById('modalMediaContainer');
       const titleEl = document.getElementById('lightboxTitle') || document.getElementById('modalTitle');
       const tagsEl = document.getElementById('lightboxTags') || document.getElementById('modalTags');

       if (titleEl) titleEl.textContent = item.title;
       if (tagsEl) tagsEl.innerHTML = item.tags.map(t => `<span class="tech-pill">${t}</span>`).join(' ');

       const ytEmbedHost = 'www.' + 'youtube' + '.com';
       if (container) {
                  if (item.type === 'youtube') {
                                 const ytUrl = 'https://' + ytEmbedHost + '/embed/' + item.youtubeId + '?autoplay=1&rel=0';
                                 container.innerHTML = '<div class="video-responsive"><iframe src="' + ytUrl + '" title="' + item.title + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
                  } else {
                                 container.innerHTML = '<img src="' + item.src + '" alt="' + item.title + '" class="lightbox-img">';
                  }
       }

       if (modal) {
                  modal.classList.add('active');
                  document.body.style.overflow = 'hidden';
       }
}

function closeLightbox() {
       const modal = document.getElementById('lightboxModal') || document.getElementById('mediaModal');
       const container = document.getElementById('lightboxContent') || document.getElementById('modalMediaContainer');
       if (container) container.innerHTML = '';
       if (modal) {
                  modal.classList.remove('active');
                  document.body.style.overflow = '';
       }
}

function initTiltEffect() {
       const cards = document.querySelectorAll('.portfolio-card, .glass-card, .tilt-card');
       cards.forEach(card => {
                  card.addEventListener('mousemove', e => {
                                 const rect = card.getBoundingClientRect();
                                 const x = e.clientX - rect.left;
                                 const y = e.clientY - rect.top;
                                 const centerX = rect.width / 2;
                                 const centerY = rect.height / 2;
                                 const rotateX = ((y - centerY) / centerY) * -8;
                                 const rotateY = ((x - centerX) / centerX) * 8;
                                 card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
                  });
                  card.addEventListener('mouseleave', () => {
                                 card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                  });
       });
}

document.addEventListener('DOMContentLoaded', () => {
       renderPortfolioGrid();

       const searchInput = document.getElementById('projectSearch');
       if (searchInput) {
                  searchInput.addEventListener('input', handleSearch);
       }

       const modal = document.getElementById('lightboxModal') || document.getElementById('mediaModal');
       if (modal) {
                  modal.addEventListener('click', (e) => {
                                 if (e.target === modal || e.target.classList.contains('modal-close') || e.target.classList.contains('close-btn')) {
                                                    closeLightbox();
                                 }
                  });
       }

       document.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape') closeLightbox();
       });

       const navToggle = document.getElementById('navToggle');
       const navLinks = document.getElementById('navLinks');
       if (navToggle && navLinks) {
                  navToggle.addEventListener('click', () => {
                                 navLinks.classList.toggle('active');
                  });
       }
});
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
