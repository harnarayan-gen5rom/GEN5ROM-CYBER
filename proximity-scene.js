/* GEN5ROM-CYBER / CURSOR FIELD V9 — FULLSCREEN
 * Spline-inspired kinetic cube installation (original procedural design).
 * 3D graphite cloner cubes, amber luminous fissures, distance-driven extrusion.
 * Lazy WebGL2, canvas fallback, touch support and offscreen render suspension.
 */
(()=>{
  "use strict";
  const stage=document.getElementById("proximityStage"),canvas=document.getElementById("proximityCanvas");
  const fallback=document.getElementById("fallbackCubes"),theme=document.getElementById("proximityTheme");
  const label=document.getElementById("proximityThemeName"),meter=document.getElementById("proximityMeter");
  const value=document.getElementById("proximityValue"),message=document.getElementById("proximityMessage");
  const reticle=document.getElementById("proximityReticle");
  if(!stage||!canvas||!fallback||!theme)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile=matchMedia("(max-width:680px)").matches;
  const coarse=matchMedia("(pointer:coarse)").matches;
  const colors=[
    {name:"LIME / 01",seam:0xc7ff54,light:0xdbffb0,sparks:0xd9ffb3,css:"#c7ff54"},
    {name:"GOLD / 02",seam:0xffb34c,light:0xffce8a,sparks:0xffe0a9,css:"#ffc069"},
    {name:"ICE / 03",seam:0x6ed9ff,light:0xa6e9ff,sparks:0xc9f1ff,css:"#86d7ff"}
  ];
  let palette=0,started=false,loaded=false,sceneVisible=false,dragging=false,active=false;
  let frame=0,last=0,elapsed=0,force=0,energy=0.06,nextReadout=0;
  let T,renderer,scene,camera,cubes,plates,geometry,group,mat,glowMat,lightKey,lightFill;
  let particles,particlePositions,particleSeeds,particleMaterial,particleGeo;
  let resizeObs,initPromise;
  const pointer={x:.5,y:.5},smooth={x:.5,y:.5};
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const initialRect=stage.getBoundingClientRect();
  const rows=coarse?21:Math.max(11,Math.min(18,Math.round(initialRect.height/60)));
  const cols=Math.min(52,Math.max(10,Math.ceil(rows*initialRect.width/Math.max(1,initialRect.height))+4));
  const count=cols*rows,spacing=.94;
  const cubesize=.89;
  const baseDepth=new Float32Array(count);
  // CSS fallback loads immediately, before a remote WebGL library resolves.
  for(let i=0;i<count;i++){
    const tile=document.createElement("i");
    tile.style.setProperty("--tile-index",String(i));
    baseDepth[i]=.10+((i*37%29)/29)*.73;
    tile.style.setProperty("--base-depth",(baseDepth[i]*12).toFixed(1)+"px");
    tile.style.filter="brightness("+(0.72+((i*23%13)/13)*.53).toFixed(2)+")";
    fallback.appendChild(tile);
  }
  fallback.style.setProperty("--cols",cols);
  fallback.style.setProperty("--rows",rows);
  function updateText(){
    const percent=clamp(Math.round(energy*100),0,100);
    meter.style.width=Math.max(2,percent)+"%";value.textContent=percent+"%";
    message.textContent=force>.5?"CUBE PULSE":energy>.68?"FULL RESPONSE ACTIVE":energy>.23?"CUBES REACTING TO YOUR CURSOR":"MOVE CURSOR TO INTERACT";
  }
  const toHex=n=>"#"+n.toString(16).padStart(6,"0");
  function changePalette(i){
    palette=(i+colors.length)%colors.length;
    const c=colors[palette];
    label.textContent=c.name;
    stage.style.setProperty("--cube-light",c.css);
    theme.style.setProperty("--field-rose",c.css);
    theme.setAttribute("aria-label","Change cube lighting palette, current "+c.name);
    if(glowMat)glowMat.color.setHex(c.seam);
    if(lightKey)lightKey.color.setHex(c.light);
    if(lightFill)lightFill.color.setHex(c.seam);
    if(particleMaterial)particleMaterial.color.setHex(c.sparks);
    if(reduced&&renderer)renderer.render(scene,camera);
  }
  theme.addEventListener("click",()=>changePalette(palette+1));
  function updatePointer(clientX,clientY){
    const r=stage.getBoundingClientRect();
    if(r.width<1||r.height<1)return;
    pointer.x=clamp((clientX-r.left)/r.width,0,1);
    pointer.y=clamp((clientY-r.top)/r.height,0,1);
    reticle.style.left=(clientX-r.left)+"px";
    reticle.style.top=(clientY-r.top)+"px";
    if(!coarse)stage.classList.add("pointer-active");
    active=true;
    // Keep fallback reactive as well when GPU/web connection is unavailable.
    if(!loaded){
      fallback.style.setProperty("--cursor-x",(pointer.x*100)+"%");
      fallback.style.setProperty("--cursor-y",(pointer.y*100)+"%");
      const cells=fallback.children,focusX=pointer.x*cols,focusY=pointer.y*rows;
      for(let i=0;i<cells.length;i++){
        const dx=i%cols+.5-focusX,dy=Math.floor(i/cols)+.5-focusY;
        const near=Math.exp(-(dx*dx+dy*dy)*.36);
        cells[i].style.setProperty("--push",(near*56)+"px");
        cells[i].style.filter="brightness("+(0.72+((i*23%13)/13)*.53+near*.35).toFixed(2)+")";
      }
    }
    run();
  }
  stage.addEventListener("pointerenter",e=>{if(e.pointerType!=="touch")updatePointer(e.clientX,e.clientY);},{passive:true});
  stage.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch"&&!dragging)return;
    updatePointer(e.clientX,e.clientY);
  },{passive:true});
  stage.addEventListener("pointerdown",e=>{
    if(e.pointerType==="touch"){
      dragging=true;
      try{stage.setPointerCapture(e.pointerId)}catch(_){}
    }
    updatePointer(e.clientX,e.clientY);
    force=1;
    run();
  },{passive:true});
  function leave(){
    active=false;dragging=false;
    stage.classList.remove("pointer-active");
    if(!loaded)Array.from(fallback.children).forEach((cell,i)=>{
      cell.style.setProperty("--push","0px");
      cell.style.filter="brightness("+(0.72+((i*23%13)/13)*.53).toFixed(2)+")";
    });
    run();
  }
  stage.addEventListener("pointerleave",e=>{if(e.pointerType!=="touch")leave();},{passive:true});
  stage.addEventListener("pointerup",e=>{
    if(e.pointerType==="touch"){dragging=false;active=false;force=Math.max(.6,force);}
  },{passive:true});
  stage.addEventListener("pointercancel",leave,{passive:true});
  stage.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){
      e.preventDefault();force=1;active=true;pointer.x=.5;pointer.y=.5;changePalette(palette+1);run();
    }else if(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key)){
      e.preventDefault();active=true;
      if(e.key==="ArrowLeft")pointer.x=clamp(pointer.x-.10,0,1);
      if(e.key==="ArrowRight")pointer.x=clamp(pointer.x+.10,0,1);
      if(e.key==="ArrowUp")pointer.y=clamp(pointer.y-.10,0,1);
      if(e.key==="ArrowDown")pointer.y=clamp(pointer.y+.10,0,1);
      run();
    }else if(e.key==="Escape")leave();
  });
    // The cube wall also reacts when the pointer passes over hero copy and links.
  const wall=stage.closest(".hero-wall");
  if(wall){
    wall.addEventListener("pointermove",e=>{
      if(e.pointerType==="touch")return;
      updatePointer(e.clientX,e.clientY);
    },{passive:true,capture:true});
    wall.addEventListener("pointerleave",()=>leave(),{passive:true});
  }
  const makeRoundedTile=(T,size)=>{
    const r=.048,s=size/2;
    const shape=new T.Shape();
    shape.moveTo(-s+r,-s);
    shape.lineTo(s-r,-s);shape.quadraticCurveTo(s,-s,s,-s+r);
    shape.lineTo(s,s-r);shape.quadraticCurveTo(s,s,s-r,s);
    shape.lineTo(-s+r,s);shape.quadraticCurveTo(-s,s,-s,s-r);
    shape.lineTo(-s,-s+r);shape.quadraticCurveTo(-s,-s,-s+r,-s);
    const g=new T.ExtrudeGeometry(shape,{depth:.68,steps:1,bevelEnabled:true,bevelThickness:.052,bevelSize:.036,bevelSegments:2,curveSegments:3});
    g.translate(0,0,-.34);
    g.computeVertexNormals();
    return g;
  };
  async function initialize(){
    if(started)return initPromise;
    started=true;
    initPromise=(async()=>{
      try{
        const context=canvas.getContext("webgl2",{antialias:!coarse,alpha:true,powerPreference:coarse?"low-power":"high-performance"});
        if(!context)throw Error("WebGL2 not supported");
        T=await import("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js");
        scene=new T.Scene();
        camera=new T.OrthographicCamera(-1,1,1,-1,.1,100);
        camera.position.set(0,0,22);
        camera.lookAt(0,0,0);
        renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:!coarse,powerPreference:coarse?"low-power":"high-performance"});
        renderer.setClearColor(0x000000,0);
        renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.12:1.5));
        renderer.outputColorSpace=T.SRGBColorSpace;
        renderer.toneMapping=T.ACESFilmicToneMapping;
        renderer.toneMappingExposure=1.05;
        scene.add(new T.AmbientLight(0xa2adb0,1.2));
        scene.add(new T.HemisphereLight(0xd0dde0,0x101417,1.0));
        const key=new T.DirectionalLight(0xe3e9eb,2.7);key.position.set(-4,6,9);scene.add(key);
        const edge=new T.DirectionalLight(0x87979f,1.22);edge.position.set(4,-3,4);scene.add(edge);
        lightKey=new T.PointLight(colors[palette].light,25,14,1.4);lightKey.position.set(2,2,4);scene.add(lightKey);
        lightFill=new T.PointLight(colors[palette].seam,16,13,1.2);lightFill.position.set(-3,-1,2);scene.add(lightFill);

        group=new T.Group();
        group.rotation.set(-.015,-.01,0);
        group.position.set(0,0,0);
        scene.add(group);
        geometry=makeRoundedTile(T,cubesize);
        mat=new T.MeshPhysicalMaterial({color:0x30393e,metalness:.53,roughness:.41,clearcoat:.54,clearcoatRoughness:.29,flatShading:false,emissive:0x050709,emissiveIntensity:.18});
        cubes=new T.InstancedMesh(geometry,mat,count);
        cubes.instanceMatrix.setUsage(T.DynamicDrawUsage);
        cubes.frustumCulled=false;
        group.add(cubes);
        glowMat=new T.MeshBasicMaterial({color:colors[palette].seam,side:T.DoubleSide,toneMapped:false,transparent:true,opacity:.15,depthWrite:false});
        const planeGeo=new T.PlaneGeometry(spacing*.99,spacing*.99);
        plates=new T.InstancedMesh(planeGeo,glowMat,count);
        plates.instanceMatrix.setUsage(T.DynamicDrawUsage);
        plates.frustumCulled=false;
        group.add(plates);
        const dummy=new T.Object3D(),panel=new T.Object3D();
        for(let i=0;i<count;i++){
          const x=((i%cols)-(cols-1)/2)*spacing;
          const y=(((rows-1)/2)-Math.floor(i/cols))*spacing;
          dummy.position.set(x,y,baseDepth[i]);dummy.rotation.set(0,0,0);dummy.updateMatrix();cubes.setMatrixAt(i,dummy.matrix);
          panel.position.set(x,y,-.55);panel.updateMatrix();plates.setMatrixAt(i,panel.matrix);
          const shade=.80+(((i*29)%19)/19)*.33;
          cubes.setColorAt(i,new T.Color().setRGB(shade,shade*1.025,shade*1.055));
        }
        cubes.instanceMatrix.needsUpdate=true;plates.instanceMatrix.needsUpdate=true;
        if(cubes.instanceColor)cubes.instanceColor.needsUpdate=true;
        // A handful of warm sparks float between the interlocked segments.
        const seedCount=coarse?24:52;
        particleSeeds=new Float32Array(seedCount*3);
        particlePositions=new Float32Array(seedCount*3);
        for(let i=0;i<seedCount;i++){
          particleSeeds[i*3]=(Math.random()-.5)*cols*spacing;
          particleSeeds[i*3+1]=(Math.random()-.5)*rows*spacing;
          particleSeeds[i*3+2]=(Math.random()-.5)*2+1;
        }
        particlePositions.set(particleSeeds);
        particleGeo=new T.BufferGeometry();
        particleGeo.setAttribute("position",new T.BufferAttribute(particlePositions,3).setUsage(T.DynamicDrawUsage));
        particleMaterial=new T.PointsMaterial({color:colors[palette].sparks,size:coarse?.028:.035,opacity:.58,transparent:true,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true});
        particles=new T.Points(particleGeo,particleMaterial);
        scene.add(particles);
        renderer.setAnimationLoop(null);
        resize();
        if("ResizeObserver" in window){resizeObs=new ResizeObserver(resize);resizeObs.observe(stage);}
        else window.addEventListener("resize",resize,{passive:true});
        loaded=true;stage.classList.add("webgl-ready");
        changePalette(palette);
        if(reduced){renderStill();}
        else if(sceneVisible)run();
      }catch(error){
        stage.classList.add("webgl-fallback");
        message.textContent="INTERACTIVE PREVIEW / LOW-POWER MODE";
        console.warn("Cube field fallback: ",error.message);
      }
    })();
    return initPromise;
  }
  function resize(){
    if(!renderer||!camera)return;
    const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
    renderer.setSize(width,height,false);
    const worldHeight=(rows-1.8)*spacing;
    const worldWidth=worldHeight*(width/height);
    camera.left=-worldWidth/2;camera.right=worldWidth/2;
    camera.top=worldHeight/2;camera.bottom=-worldHeight/2;
    camera.updateProjectionMatrix();
    if(reduced)renderStill();
  }
  function renderStill(){if(renderer&&scene&&camera)renderer.render(scene,camera);}
  function run(){
    if(reduced){renderStill();return;}
    if(sceneVisible&&loaded&&!document.hidden&&!frame){last=0;frame=requestAnimationFrame(animate);}
  }
  const tempMatrix={}; // cached nodes allocated after load
  function animate(now){
    frame=0;
    if(!loaded||!sceneVisible||document.hidden)return;
    const dt=last?clamp((now-last)/1000,.001,.055):.016;
    last=now;elapsed+=dt;
    smooth.x=lerp(smooth.x,active?pointer.x:.5,clamp(dt*4.5,0,1));
    smooth.y=lerp(smooth.y,active?pointer.y:.5,clamp(dt*4.5,0,1));
    const worldHeight=(rows-1.8)*spacing,worldWidth=worldHeight*camera.aspect;
    const px=(smooth.x-.5)*worldWidth;
    const py=(.5-smooth.y)*worldHeight;
    const radial=Math.hypot((smooth.x-.5)*1.25,(smooth.y-.5)*1.35);
    const prox=active?Math.pow(clamp(1-radial/.83,0,1),.8):0;
    energy=lerp(energy,clamp(.05+prox*.9+force*.36,0,1),clamp(dt*4.2,0,1));
    force=Math.max(0,force-dt*.9);
    if(!tempMatrix.tile){tempMatrix.tile=new T.Object3D();tempMatrix.panel=new T.Object3D();}
    let maxLift=0;
    for(let i=0;i<count;i++){
      const x=((i%cols)-(cols-1)/2)*spacing;
      const y=(((rows-1)/2)-Math.floor(i/cols))*spacing;
      const dx=x-px,dy=y-py;
      const d2=dx*dx+dy*dy;
      const field=active?Math.exp(-d2/(mobile?3.2:5.0)):0;
      const pulse=Math.exp(-d2/6.2)*force;
      const lift=field*(1.15+energy*.8)+pulse*.9;
      maxLift=Math.max(lift,maxLift);
      const wobble=Math.sin(elapsed*.72+i*.22)*.009;
      const tile=tempMatrix.tile;
      tile.position.set(x+dx*.014*field,y+dy*.015*field,baseDepth[i]+lift+wobble);
      tile.rotation.set(-dy*.095*field+Math.sin(elapsed*.52+i*.17)*.008,dx*.095*field,-dx*.023*field);
      tile.scale.setScalar(1-field*.055+pulse*.025);
      tile.updateMatrix();cubes.setMatrixAt(i,tile.matrix);
    }
    cubes.instanceMatrix.needsUpdate=true;
    group.rotation.y=lerp(group.rotation.y,-.01+(smooth.x-.5)*.028,clamp(dt*1.9,0,1));
    group.rotation.x=lerp(group.rotation.x,-.015-(smooth.y-.5)*.025,clamp(dt*1.9,0,1));
    lightKey.position.set(px*.8,py*.8,4.0);
    lightKey.intensity=8+energy*22;
    lightFill.intensity=6+energy*15;
    glowMat.opacity=.14+energy*.19;
    if(particles){
      const pos=particleGeo.getAttribute("position");
      for(let i=0;i<particleSeeds.length/3;i++){
        const k=i*3;
        particlePositions[k]=particleSeeds[k]+Math.sin(elapsed*.33+i*.94)*.025;
        particlePositions[k+1]=particleSeeds[k+1]+Math.cos(elapsed*.4+i*.83)*.028;
        particlePositions[k+2]=particleSeeds[k+2]+Math.sin(elapsed*.47+i*.36)*.08;
      }
      pos.needsUpdate=true;
      particleMaterial.opacity=.35+energy*.32;
    }
    renderer.render(scene,camera);
    if(now-nextReadout>85){
      updateText();
      stage.style.setProperty("--field-strength",energy.toFixed(2));
      nextReadout=now;
    }
    frame=requestAnimationFrame(animate);
  }
  function visible(v){
    sceneVisible=v;
    if(v){if(!started)initialize();else run();}
    else if(frame){cancelAnimationFrame(frame);frame=0;last=0;}
  }
  if("IntersectionObserver" in window){
    new IntersectionObserver(entries=>entries.forEach(e=>visible(e.isIntersecting)),{rootMargin:"140px 0px",threshold:0}).observe(stage);
  }else visible(true);
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
    else run();
  });
  changePalette(0);updateText();
})();