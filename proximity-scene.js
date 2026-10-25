/* PROXIMITY / 001 — AETHER FIELD
   A small, lazy-loaded real 3D sculpture powered by Three.js.
   Only GEN5ROM-CYBER is modified. Nothing loads from the original GEN5ROM repo.
   Pauses outside the viewport and while the document is hidden. */
(() => {
  "use strict";
  const stage=document.getElementById("proximityStage");
  const canvas=document.getElementById("proximityCanvas");
  const themeButton=document.getElementById("proximityTheme");
  const themeName=document.getElementById("proximityThemeName");
  const message=document.getElementById("proximityMessage");
  const meter=document.getElementById("proximityMeter");
  const value=document.getElementById("proximityValue");
  const reticle=document.getElementById("proximityReticle");
  if(!stage||!canvas||!themeButton)return;

  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse=window.matchMedia("(pointer:coarse)").matches;
  const palettes=[
    {name:"ROSE / 01",base:0xf9a9d2,edge:0xff66af,secondary:0xbb8cff,dust:0xffcce9,css:"#ff84bd"},
    {name:"VIOLET / 02",base:0xd4adff,edge:0xb77cff,secondary:0x84b6ff,dust:0xe0ccff,css:"#bc8fff"},
    {name:"AURORA / 03",base:0xb5dfff,edge:0x6bbdff,secondary:0xe2a5ff,dust:0xbdefff,css:"#83d1ff"}
  ];
  let paletteIndex=0;
  let active=false,dragging=false,visible=false,loadStarted=false,loaded=false,initPromise=null,renderer=null,scene=null,camera=null;
  let frame=0,lastTime=0,time=0,energy=.08,impulse=0,resizeObserver=null,THREE=null;
  let sculpture=null,knot=null,knotMaterial=null,core=null,lightA=null,lightB=null;
  let rings=[],satellites=[],particles=null,dustMaterial=null,dustBase=null,dustPhases=null,dustGeometry=null;
  const pointer={x:0,y:0},smoothPointer={x:0,y:0};
  let statusAt=0;
  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const toHex=n=>"#"+n.toString(16).padStart(6,"0");

  function updateReadout(force=false){
    const intensity=clamp(Math.round(energy*100),0,100);
    meter.style.width=Math.max(2,intensity)+"%";
    value.textContent=intensity+"%";
    const next=impulse>.5?"PULSE DETECTED":energy>.69?"FIELD FULLY ENGAGED":energy>.29?"PROXIMITY RESPONSE ACTIVE":active?"MOVE TOWARD THE CENTER":"MOVE CLOSER TO INTERACT";
    if(force||next!==message.textContent)message.textContent=next;
  }
  function setPalette(next){
    paletteIndex=(next+palettes.length)%palettes.length;
    const p=palettes[paletteIndex];
    themeName.textContent=p.name;
    stage.style.setProperty("--field-rose",p.css);
    stage.style.setProperty("--field-violet",toHex(p.secondary));
    themeButton.setAttribute("aria-label","Change 3D sculpture palette. Current: "+p.name);
    if(knotMaterial)knotMaterial.color.setHex(p.base);
    if(lightA)lightA.color.setHex(p.edge);
    if(lightB)lightB.color.setHex(p.secondary);
    if(core)core.material.color.setHex(p.secondary);
    if(dustMaterial)dustMaterial.color.setHex(p.dust);
    rings.forEach((ring,i)=>ring.material.color.setHex(i===1?p.secondary:p.edge));
    satellites.forEach((orb,i)=>orb.material.color.setHex(i%2?p.secondary:p.edge));
    if(reduced)renderStill();
  }
  themeButton.addEventListener("click",()=>setPalette(paletteIndex+1));

  function readPointer(e){
    const r=stage.getBoundingClientRect();
    if(!r.width||!r.height)return;
    pointer.x=clamp(((e.clientX-r.left)/r.width-.5)*2,-1,1);
    pointer.y=clamp((.5-(e.clientY-r.top)/r.height)*2,-1,1);
    if(!coarse){
      reticle.style.left=(e.clientX-r.left).toFixed(2)+"px";
      reticle.style.top=(e.clientY-r.top).toFixed(2)+"px";
      stage.classList.add("pointer-active");
    }
    active=true;
    requestAnimation();
  }
  stage.addEventListener("pointerenter",e=>{if(e.pointerType!=="touch")readPointer(e);},{passive:true});
  stage.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch"&&!dragging)return;
    readPointer(e);
  },{passive:true});
  stage.addEventListener("pointerdown",e=>{
    if(e.pointerType==="touch"){
      dragging=true;
      try{stage.setPointerCapture(e.pointerId)}catch(_){}
    }
    readPointer(e);
    impulse=Math.max(impulse,.85);
    requestAnimation();
  },{passive:true});
  function clearPointer(){
    dragging=false;active=false;
    stage.classList.remove("pointer-active");
    requestAnimation();
  }
  stage.addEventListener("pointerleave",e=>{if(e.pointerType!=="touch")clearPointer();},{passive:true});
  stage.addEventListener("pointerup",e=>{
    if(e.pointerType==="touch"){
      dragging=false;
      if(stage.hasPointerCapture(e.pointerId)){try{stage.releasePointerCapture(e.pointerId)}catch(_){}}
      // Keep the sculpture gently energized after a touch.
      impulse=Math.max(impulse,.62);
      active=false;
    }
  },{passive:true});
  stage.addEventListener("pointercancel",clearPointer,{passive:true});
  stage.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){
      e.preventDefault();impulse=1;setPalette(paletteIndex+1);requestAnimation();
    }else if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
      e.preventDefault();active=true;
      pointer.x=clamp(pointer.x+(e.key==="ArrowRight"?.17:e.key==="ArrowLeft"?-.17:0),-1,1);
      pointer.y=clamp(pointer.y+(e.key==="ArrowUp"?.17:e.key==="ArrowDown"?-.17:0),-1,1);
      requestAnimation();
    }else if(e.key==="Escape"){clearPointer();}
  });
  // Fallback still responds to palette changes if WebGL is unavailable.
  function renderStill(){
    if(!renderer||!scene||!camera)return;
    renderer.render(scene,camera);
  }

  async function begin(){
    if(loadStarted)return initPromise;
    loadStarted=true;
    initPromise=(async()=>{
      try{
        // Check first: unsupported GPUs and power-saving browsers get the CSS artwork.
        const context=canvas.getContext("webgl2",{antialias:!coarse,alpha:true,powerPreference:"high-performance"});
        if(!context)throw new Error("WebGL2 unavailable");
        const module=await import("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js");
        THREE=module;
        initScene(context);
        loaded=true;
        stage.classList.add("webgl-ready");
        if(reduced)renderStill();
        else if(visible)requestAnimation();
      }catch(error){
        stage.classList.add("webgl-fallback");
        // Keep beautiful CSS sculpture visible when WebGL or network is blocked.
        if(message)message.textContent="STATIC PREVIEW / WEBGL UNAVAILABLE";
        console.warn("Proximity Aether fallback:",error.message);
      }
    })();
    return initPromise;
  }

  function initScene(context){
    const T=THREE;
    renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:!coarse,powerPreference:"high-performance",premultipliedAlpha:false});
    renderer.setClearColor(0x000000,0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,coarse?1.25:1.7));
    renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.36;
    scene=new T.Scene();
    camera=new T.PerspectiveCamera(coarse?35:33,1,.1,80);
    camera.position.set(0,0,8.75);
    camera.lookAt(0,0,0);
    scene.add(new T.AmbientLight(0xe9caff,.85));
    scene.add(new T.HemisphereLight(0xeac4ff,0x17102a,1.55));

    const key=new T.DirectionalLight(0xffe8f6,3.25);key.position.set(-3.6,4.3,6);scene.add(key);
    const rim=new T.DirectionalLight(0xaac7ff,3.7);rim.position.set(3.8,-2.2,3.5);scene.add(rim);
    const top=new T.DirectionalLight(0xffb2db,2.0);top.position.set(1.5,5,-3.5);scene.add(top);
    lightA=new T.PointLight(0xff68b7,34,16,2);lightA.position.set(-2,1,3.7);scene.add(lightA);
    lightB=new T.PointLight(0xb48aff,27,16,2);lightB.position.set(2.8,-1.8,2.3);scene.add(lightB);

    sculpture=new T.Group();
    sculpture.position.set(coarse?0.12:0.36,-.04,0);
    scene.add(sculpture);
    knotMaterial=new T.MeshPhysicalMaterial({
      color:0xf9a9d2,metalness:.58,roughness:.22,clearcoat:1,clearcoatRoughness:.06,
      iridescence:.88,iridescenceIOR:1.33,iridescenceThicknessRange:[145,710],
      emissive:0x230b31,emissiveIntensity:.25
    });
    knot=new T.Mesh(new T.TorusKnotGeometry(1.03,.295,coarse?170:270,coarse?18:30,2,3),knotMaterial);
    knot.rotation.set(.18,.34,.21);
    sculpture.add(knot);

    const ghostMaterial=new T.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:coarse?.018:.028,depthWrite:false,blending:T.AdditiveBlending});
    const contour=new T.Mesh(knot.geometry,ghostMaterial);
    contour.scale.setScalar(1.013);
    knot.add(contour);

    const coreMaterial=new T.MeshBasicMaterial({color:0xb48aff,transparent:true,opacity:.09,depthWrite:false,blending:T.AdditiveBlending});
    core=new T.Mesh(new T.SphereGeometry(.92,32,22),coreMaterial);
    core.scale.set(.85,.85,.85);sculpture.add(core);

    // Three offset orbital paths add actual stereoscopic 3D depth.
    const orbitConfig=[
      {r:1.87,color:0xff6bbd,rx:.92,ry:.22,rz:-.29,size:.009,opacity:.53},
      {r:1.67,color:0xb48aff,rx:.10,ry:1.18,rz:.25,size:.007,opacity:.48},
      {r:2.08,color:0xff9ed4,rx:.37,ry:.20,rz:1.18,size:.006,opacity:.32}
    ];
    orbitConfig.forEach((cfg,i)=>{
      const material=new T.MeshBasicMaterial({color:cfg.color,transparent:true,opacity:cfg.opacity,depthWrite:false,blending:T.AdditiveBlending});
      const ring=new T.Mesh(new T.TorusGeometry(cfg.r,cfg.size,8,180),material);
      ring.rotation.set(cfg.rx,cfg.ry,cfg.rz);
      ring.userData={rx:cfg.rx,ry:cfg.ry,rz:cfg.rz,i};
      rings.push(ring);sculpture.add(ring);
    });

    // Small luminous nodes travel along different 3D orbital planes.
    const beadGeo=new T.SphereGeometry(.052,12,9);
    for(let i=0;i<(coarse?5:8);i++){
      const material=new T.MeshBasicMaterial({color:i%2?0xb48aff:0xff68b7,transparent:true,opacity:.94});
      const bead=new T.Mesh(beadGeo,material);
      bead.userData={offset:(i/(coarse?5:8))*Math.PI*2,speed:.18+(i%3)*.055,radius:1.74+(i%3)*.16,index:i};
      sculpture.add(bead);satellites.push(bead);
    }

    // Sparse, reactive, depth-varied dust field; CPU work under 250 points.
    const count=coarse?95:235;
    dustBase=new Float32Array(count*3);
    dustPhases=new Float32Array(count);
    const seed=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const angle=Math.random()*Math.PI*2;
      const radius=2.15+Math.pow(Math.random(),.72)*2.9;
      const z=(Math.random()-.5)*3.7;
      seed[i*3]=Math.cos(angle)*radius;
      seed[i*3+1]=Math.sin(angle)*radius*.68;
      seed[i*3+2]=z;
      dustPhases[i]=Math.random()*Math.PI*2;
    }
    dustBase.set(seed);
    dustGeometry=new T.BufferGeometry();
    dustGeometry.setAttribute("position",new T.BufferAttribute(seed.slice(),3).setUsage(T.DynamicDrawUsage));
    dustMaterial=new T.PointsMaterial({
      color:0xffcce9,size:coarse?.025:.032,sizeAttenuation:true,transparent:true,
      opacity:.8,depthWrite:false,blending:T.AdditiveBlending
    });
    particles=new T.Points(dustGeometry,dustMaterial);
    scene.add(particles);
    resize();
    if("ResizeObserver" in window){
      resizeObserver=new ResizeObserver(resize);
      resizeObserver.observe(stage);
    }else window.addEventListener("resize",resize,{passive:true});
    setPalette(paletteIndex);
  }

  function resize(){
    if(!renderer||!camera)return;
    const w=Math.max(1,Math.round(stage.clientWidth));
    const h=Math.max(1,Math.round(stage.clientHeight));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.fov=w<500?37:33;
    camera.updateProjectionMatrix();
    if(reduced)renderStill();
  }

  function requestAnimation(){
    if(reduced){
      if(loaded)renderStill();
      return;
    }
    if(loaded && visible && !document.hidden && frame===0){
      lastTime=0;frame=requestAnimationFrame(animate);
    }
  }
  function animate(now){
    frame=0;
    if(!visible||document.hidden||!renderer)return;
    const dt=lastTime?clamp((now-lastTime)/1000,.001,.05):.016;
    lastTime=now;
    time+=dt;
    // Physics: the closer the cursor, the more energy the sculpture accumulates.
    smoothPointer.x=lerp(smoothPointer.x,active?pointer.x:0,clamp(dt*6,0,1));
    smoothPointer.y=lerp(smoothPointer.y,active?pointer.y:0,clamp(dt*6,0,1));
    const radial=Math.hypot(pointer.x*.98,pointer.y*1.16);
    const proximity=active?Math.pow(clamp(1-radial/1.15,0,1),1.25):.06;
    energy=lerp(energy,clamp(.07+proximity*.88+impulse*.55,0,1),clamp(dt*4.6,0,1));
    impulse=Math.max(0,impulse-dt*.95);
    if(sculpture){
      sculpture.rotation.y=lerp(sculpture.rotation.y,smoothPointer.x*.32+Math.sin(time*.18)*.055,clamp(dt*3.6,0,1));
      sculpture.rotation.x=lerp(sculpture.rotation.x,-smoothPointer.y*.25+Math.cos(time*.19)*.04,clamp(dt*3.6,0,1));
      sculpture.position.x=lerp(sculpture.position.x,(coarse?.12:.36)+smoothPointer.x*.22,clamp(dt*2.7,0,1));
      sculpture.position.y=lerp(sculpture.position.y,-.04+smoothPointer.y*.15,clamp(dt*2.7,0,1));
      const scale=1+Math.sin(time*.69)*.015+energy*.07;
      sculpture.scale.setScalar(scale);
    }
    if(knot){
      knot.rotation.y+=dt*(.13+energy*.3);
      knot.rotation.z+=dt*(.07+energy*.20);
      knot.rotation.x=Math.sin(time*.31)*.15+energy*.06;
      knotMaterial.emissiveIntensity=.16+energy*.32;
    }
    if(core)core.material.opacity=.05+energy*.11;
    rings.forEach((ring,i)=>{
      const r=ring.userData;
      ring.rotation.z=r.rz+Math.sin(time*(.21+i*.06))* (.1+energy*.14)+(i%2?-1:1)*time*(.06+energy*.13);
      ring.rotation.y=r.ry+Math.cos(time*.18+i)*(.08+energy*.15);
      const sc=1+energy*(.04+i*.018)+Math.sin(time*.74+i)*.007;
      ring.scale.setScalar(sc);
      ring.material.opacity=clamp([.51,.48,.29][i]+energy*.24,0,1);
    });
    satellites.forEach(bead=>{
      const u=bead.userData;
      const a=u.offset+time*(u.speed+energy*.22);
      bead.position.set(Math.cos(a)*u.radius,Math.sin(a*1.05)*u.radius*.73,Math.sin(a*.7+u.index)*.72);
      bead.scale.setScalar(.78+energy*.7+Math.sin(time*1.3+u.index)*.08);
    });
    if(particles&&dustGeometry){
      const attr=dustGeometry.getAttribute("position"),positions=attr.array;
      const cursorX=smoothPointer.x*3.25+(coarse?.12:.36);
      const cursorY=smoothPointer.y*2.6;
      for(let i=0;i<dustPhases.length;i++){
        const k=i*3,phase=dustPhases[i];
        const ox=dustBase[k],oy=dustBase[k+1],oz=dustBase[k+2];
        const bx=ox+Math.sin(time*.23+phase)*.045;
        const by=oy+Math.cos(time*.27+phase)*.055;
        const dx=bx-cursorX,dy=by-cursorY;
        const d=Math.max(.12,Math.hypot(dx,dy));
        const push=active?Math.pow(clamp(1-d/1.9,0,1),2)*(.53+energy*.5):0;
        positions[k]=lerp(positions[k],bx+(dx/d)*push,clamp(dt*5.5,0,1));
        positions[k+1]=lerp(positions[k+1],by+(dy/d)*push,clamp(dt*5.5,0,1));
        positions[k+2]=oz+Math.sin(time*.33+phase)*.035;
      }
      attr.needsUpdate=true;
      particles.rotation.y=Math.sin(time*.09)*.12;
      dustMaterial.opacity=.57+energy*.24;
    }
    if(lightA)lightA.intensity=30+energy*24;
    if(lightB)lightB.intensity=22+energy*16;
    if(renderer)renderer.render(scene,camera);
    if(now-statusAt>100){
      updateReadout();
      stage.style.setProperty("--field-strength",energy.toFixed(3));
      statusAt=now;
    }
    frame=requestAnimationFrame(animate);
  }

  function setVisible(next){
    visible=next;
    if(next){
      if(!loadStarted)begin();
      else requestAnimation();
    }else if(frame){
      cancelAnimationFrame(frame);frame=0;
      lastTime=0;
    }
  }
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      if(frame)cancelAnimationFrame(frame);
      frame=0;lastTime=0;
    }else requestAnimation();
  });
  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>setVisible(entry.isIntersecting));
    },{rootMargin:"180px 0px 180px 0px",threshold:0});
    io.observe(stage);
  }else setVisible(true);
  updateReadout(true);
})();
