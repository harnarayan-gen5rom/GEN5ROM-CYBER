/* GEN5ROM CYBER V5 — accessible portfolio interactions.
   Project data is loaded from portfolio-data.js (sourced from original GEN5ROM read-only). */
(()=>{"use strict";
  const $=(sel,ctx=document)=>ctx.querySelector(sel);
  const $$=(sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const work=Array.isArray(window.GEN5ROM_WORK)?window.GEN5ROM_WORK:[];
  const featured=Array.isArray(window.GEN5ROM_FEATURED)?window.GEN5ROM_FEATURED:[];
  const experiments=Array.isArray(window.GEN5ROM_INTERACTIVE)?window.GEN5ROM_INTERACTIVE:[];
  const escapeHTML=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const categories={motion:"Motion graphics",video:"Video editing",design:"Graphic design",kids:"AI kids stories"};
  const viewport=document.documentElement;

  // Navigation + scroll tracking.
  const menuBtn=$("#mobileMenuBtn"),menu=$("#mobileMenu");
  function closeMenu(){if(menuBtn&&menu){menu.hidden=true;menuBtn.setAttribute("aria-expanded","false");menuBtn.setAttribute("aria-label","Open navigation");}}
  if(menuBtn&&menu){
    menuBtn.addEventListener("click",()=>{const open=menu.hidden;menu.hidden=!open;menuBtn.setAttribute("aria-expanded",String(open));menuBtn.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
    $$("a",menu).forEach(a=>a.addEventListener("click",closeMenu));
    window.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
    window.addEventListener("resize",()=>{if(innerWidth>850)closeMenu();},{passive:true});
    document.addEventListener("click",e=>{if(!menu.hidden&&!menu.contains(e.target)&&!menuBtn.contains(e.target))closeMenu();});
  }
  const progress=$("#scrollProgress");
  let scrollScheduled=false;
  function scrollUpdate(){
    scrollScheduled=false;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    if(progress)progress.style.width=(Math.min(1,scrollY/max)*100).toFixed(2)+"%";
  }
  window.addEventListener("scroll",()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(scrollUpdate);}},{passive:true});
  scrollUpdate();
  if(!reduced && "IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target);}});
    },{threshold:.1,rootMargin:"0px 0px -30px 0px"});
    $$(".reveal").forEach(el=>io.observe(el));
  }else $$(".reveal").forEach(el=>el.classList.add("visible"));

  // Interactive, lightweight faux-3D luminous sphere: responsive to mouse/touch.
  const orb=$("#orbStage"),perspective=$("#orbPerspective");
  if(orb&&perspective){
    let targetX=0,targetY=0,curX=0,curY=0,raf=null,tintIndex=0;
    const tints=["0deg","42deg","-43deg","88deg","-103deg"];
    const clamp=(a,b,c)=>Math.min(c,Math.max(b,a));
    const render=()=>{
      raf=null;
      const dx=targetX-curX,dy=targetY-curY;
      curX+=dx*.13;curY+=dy*.13;
      if(!reduced){
        orb.style.setProperty("--ry",((curX*22)+16).toFixed(2)+"deg");
        orb.style.setProperty("--rx",((-curY*20)-13).toFixed(2)+"deg");
      }
      if(Math.abs(dx)+Math.abs(dy)>.018)raf=requestAnimationFrame(render);
    };
    const start=()=>{if(raf===null && !reduced)raf=requestAnimationFrame(render);};
    function move(e){
      if(e.pointerType==="touch" && e.buttons===0)return;
      const r=orb.getBoundingClientRect();
      targetX=clamp(((e.clientX-r.left)/r.width-.5)*2,-1,1);
      targetY=clamp(((e.clientY-r.top)/r.height-.5)*2,-1,1);
      start();
    }
    orb.addEventListener("pointermove",move,{passive:true});
    orb.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"){try{orb.setPointerCapture(e.pointerId)}catch(_){}}move(e);},{passive:true});
    orb.addEventListener("pointerleave",()=>{targetX=targetY=0;start();},{passive:true});
    orb.addEventListener("pointerup",e=>{if(e.pointerType!=="mouse"){targetX=targetY=0;start();}},{passive:true});
    orb.addEventListener("click",()=>{
      tintIndex=(tintIndex+1)%tints.length;
      orb.style.setProperty("--hue",tints[tintIndex]);
      orb.setAttribute("aria-label","Interactive gradient sculpture. Color palette "+(tintIndex+1)+" of "+tints.length+". Move or drag to rotate");
    });
  }

  // Shared accessible media preview for YouTube videos, posters and optional 3D scenes.
  const modal=$("#mediaModal"),modalTitle=$("#modalTitle"),modalBody=$("#modalBody"),modalBottom=$("#modalBottom");
  let lastFocus=null,originalOverflow="",splineLoaded=false;
  function openMedia(opts){
    if(!modal||!modalBody)return;
    lastFocus=document.activeElement;
    originalOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    modal.hidden=false;
    modalTitle.textContent=opts.title||"Project preview";
    modalBody.replaceChildren();
    modalBottom.replaceChildren();
    if(opts.kind==="video"){
      const frame=document.createElement("iframe");
      const id=String(opts.video||"").trim();
      if(!/^[a-zA-Z0-9_-]{11}$/.test(id)){closeMedia();return;}
      frame.src="https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1&rel=0&playsinline=1";
      frame.title=opts.title||"Video";frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen=true;frame.referrerPolicy="strict-origin-when-cross-origin";
      if(opts.isShort)frame.className="portrait-video";
      modalBody.appendChild(frame);
      const a=document.createElement("a");a.href="https://www.youtube.com/watch?v="+id;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Watch on YouTube ↗";modalBottom.appendChild(a);
    }else if(opts.kind==="image"){
      const img=document.createElement("img");img.alt=opts.title||"Graphic design preview";img.src=opts.image;
      modalBody.appendChild(img);
      const a=document.createElement("a");a.href=opts.image;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open full image ↗";modalBottom.appendChild(a);
    }else if(opts.kind==="spline"){
      modalBody.innerHTML='<div class="spline-loading">Loading interactive 3D scene…</div>';
      if(!splineLoaded){
        const script=document.createElement("script");
        script.type="module";script.src="https://cdn.spline.design/@splinetool/viewer@2.0.75/build/spline-viewer.js";
        document.head.appendChild(script);splineLoaded=true;
      }
      const holder=document.createElement("div");holder.className="spline-shell";holder.style.cssText="width:100%;height:min(63dvh,640px);min-height:310px;position:relative";
      const viewer=document.createElement("spline-viewer");viewer.setAttribute("url",opts.scene);viewer.setAttribute("loading-anim-type","spinner");viewer.style.cssText="display:block;width:100%;height:100%";
      holder.appendChild(viewer);modalBody.replaceChildren(holder);
      const a=document.createElement("a");a.href="https://harnarayan-gen5rom.github.io/GEN5ROM/#interactive";a.target="_blank";a.rel="noopener noreferrer";a.textContent="View in original 3D gallery ↗";modalBottom.appendChild(a);
      const desc=document.createElement("span");desc.textContent="Loads only when opened";modalBottom.prepend(desc);
    }
    $("#modalClose")?.focus({preventScroll:true});
  }
  function closeMedia(){
    if(!modal||modal.hidden)return;
    modal.hidden=true;modalBody.replaceChildren();modalBottom.replaceChildren();document.body.style.overflow=originalOverflow;
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  }
  $("#modalClose")?.addEventListener("click",closeMedia);
  modal?.addEventListener("click",e=>{if(e.target.hasAttribute("data-close"))closeMedia();});
  window.addEventListener("keydown",e=>{
    if(!modal||modal.hidden)return;
    if(e.key==="Escape"){e.preventDefault();closeMedia();return;}
    if(e.key!=="Tab")return;
    const focusable=$$("button:not([disabled]),a[href],input:not([disabled])",modal).filter(el=>el.getClientRects().length);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });

  // Featured cases sourced directly from the reference project's real videos.
  const featureGrid=$("#featuredProjects");
  if(featureGrid){
    featureGrid.innerHTML=featured.map((p,i)=>'<button type="button" class="feature-card reveal" data-feature="'+i+'" aria-label="Play '+escapeHTML(p.title)+'">'+
      '<img src="'+escapeHTML(p.image)+'" alt="" loading="'+(i===0?"eager":"lazy")+'" decoding="async">'+
      '<span class="feature-play" aria-hidden="true">↗</span>'+
      '<span class="feature-copy"><span class="feature-tag">'+escapeHTML(p.label)+'</span><strong class="feature-title">'+escapeHTML(p.title)+'</strong><span class="feature-description">'+escapeHTML(p.desc)+'</span></span></button>').join("");
    $$("[data-feature]",featureGrid).forEach(btn=>btn.addEventListener("click",()=>{
      const p=featured[Number(btn.dataset.feature)];if(p)openMedia({kind:"video",video:p.video,title:p.title});
    }));
    $$(".reveal",featureGrid).forEach(el=>el.classList.add("visible"));
  }
  $("#reelBtn")?.addEventListener("click",()=>openMedia({kind:"video",video:"yDnmJa0fTsw",title:"Selected motion reel — Zigency SaaS explainer"}));
  $(".showreel-strip")?.addEventListener("click",e=>{if(e.target.closest("button"))return;openMedia({kind:"video",video:"yDnmJa0fTsw",title:"Selected motion reel — Zigency SaaS explainer"});});

  // Complete 34-item gallery: all entries from source repo, no missing samples.
  const grid=$("#projectGrid"),count=$("#resultsCount"),empty=$("#emptyResults"),search=$("#projectSearch"),filterBtns=$$("[data-filter]");
  let currentFilter="all",searchTerm="";
  function projectMarkup(p,index){
    const label=categories[p.category]||p.category;
    const shortTitle=String(p.title).length>110?String(p.title).slice(0,107)+"…":p.title;
    return '<button class="project" type="button" data-project="'+index+'" aria-label="Open '+escapeHTML(p.title)+'">'+
      '<span class="project-media"><img src="'+escapeHTML(p.image)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">'+
      '<span class="project-type">'+escapeHTML(label)+'</span><span class="project-play" aria-hidden="true">'+(p.video?'▶':'↗')+'</span></span>'+
      '<span class="project-copy"><span class="project-count">PROJECT / '+String(p.order+1).padStart(2,"0")+'</span>'+
      '<strong class="project-title">'+escapeHTML(shortTitle)+'</strong>'+
      '<span class="project-cta">'+(p.video?"Watch project ↗":"View artwork ↗")+'</span></span></button>';
  }
  function renderProjects(){
    if(!grid)return;
    const filtered=work.filter(p=>(currentFilter==="all"||p.category===currentFilter) &&
      (!searchTerm||String(p.title).toLocaleLowerCase().includes(searchTerm)||
       String(categories[p.category]||"").toLocaleLowerCase().includes(searchTerm)));
    grid.innerHTML=filtered.map(p=>projectMarkup(p,work.indexOf(p))).join("");
    if(count)count.textContent="Showing "+filtered.length+" of "+work.length+" projects";
    if(empty)empty.hidden=filtered.length!==0;
    $$("[data-project]",grid).forEach(btn=>btn.addEventListener("click",()=>{
      const p=work[Number(btn.dataset.project)];if(!p)return;
      if(p.video)openMedia({kind:"video",video:p.video,title:p.title,isShort:!!p.short});
      else openMedia({kind:"image",image:p.image,title:p.title});
    }));
    $$("img",grid).forEach(img=>{
      img.addEventListener("error",()=>{if(img.dataset.fallback)return;img.dataset.fallback="1";img.src="./assets/Gfx-poster.webp";});
    });
  }
  filterBtns.forEach(btn=>btn.addEventListener("click",()=>{
    currentFilter=btn.dataset.filter||"all";
    filterBtns.forEach(b=>{const active=b===btn;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
    renderProjects();
  }));
  search?.addEventListener("input",e=>{searchTerm=String(e.target.value||"").toLocaleLowerCase().trim();renderProjects();});
  renderProjects();

  // Archive interactive 3D experiments: no heavy models render until clicked.
  const labs=$("#archivedLabs");
  if(labs){
    labs.innerHTML=experiments.map((x,i)=>'<button type="button" class="lab-card reveal" data-spline="'+i+'">'+
      '<span class="eyebrow">ARCHIVED 3D EXPERIMENT / 0'+(i+1)+'</span>'+
      '<strong>'+escapeHTML(x.title)+'</strong>'+
      '<small>'+escapeHTML(x.description)+'</small>'+
      '<span>Open interactive scene ↗</span></button>').join("");
    $$("[data-spline]",labs).forEach(btn=>btn.addEventListener("click",()=>{
      const p=experiments[Number(btn.dataset.spline)];if(p)openMedia({kind:"spline",title:p.title,scene:p.scene});
    }));
    $$(".reveal",labs).forEach(el=>el.classList.add("visible"));
  }
  // Gentle desktop card parallax is optional and disabled on touch/reduced motion.
  if(!reduced && window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    $$(".feature-card").forEach(card=>{
      card.addEventListener("pointermove",e=>{const b=card.getBoundingClientRect();card.style.setProperty("--x",((e.clientX-b.left)/b.width*100).toFixed(1)+"%");});
    });
  }
})();
