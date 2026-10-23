/* GEN5ROM CYBER — DRAGON FORGE
 * Procedural real-time 3D character, not a flattened canvas illustration.
 * Three.js is downloaded only after explicit activation.
 */
(() => {
  'use strict';
  const stage = document.getElementById('dragonStage');
  const startButton = document.getElementById('dragonStart');
  const note = document.getElementById('dragonMessage');
  const standby = document.getElementById('dragonStandby');
  const controls = document.getElementById('dragonControls');
  const status = document.getElementById('dragonState');
  const counter = document.getElementById('dragonCount');
  if (!stage || !startButton) return;
  let booted = false, busy = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  startButton.addEventListener('click', async () => {
    if (busy || booted) return;
    busy = true;
    startButton.disabled = true;
    startButton.textContent = 'INITIALIZING REACTOR…';
    note.textContent = 'Loading interactive 3D engine.';
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');
      boot(THREE);
      booted = true;
      standby.hidden = true;
      controls.hidden = false;
      document.querySelector('.dragon-viewport-status').hidden = false;
      startButton.hidden = true;
      note.textContent = '';
    } catch (error) {
      console.error('DRAGON FORGE initialization failed:', error);
      note.textContent = '3D could not start. Check WebGL/browser support and connection, then retry.';
      startButton.textContent = 'RETRY DRAGON ↗';
      startButton.disabled = false;
    } finally {busy = false;}
  });
  function boot(T) {
    const scene = new T.Scene();
    scene.fog = new T.FogExp2(0x08060b, 0.029);
    const camera = new T.PerspectiveCamera(39, 1, 0.1, 120);
    let renderer;
    try { renderer = new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
    catch(error) { throw new Error('This browser could not create WebGL.'); }
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    stage.prepend(renderer.domElement);
    renderer.domElement.setAttribute('aria-label','Orbitable 3D robotic dragon. Drag to orbit; click head to breathe fire; hover parts to inspect.');
    renderer.domElement.setAttribute('role','img');
    const glCanvas = renderer.domElement;
    const $ = s => document.querySelector(s);
    const metal = new T.MeshStandardMaterial({color:0x232833,metalness:.88,roughness:.32});
    const gunmetal = new T.MeshStandardMaterial({color:0x0b111c,metalness:.85,roughness:.3});
    const silver = new T.MeshStandardMaterial({color:0xc2c6d1,metalness:.83,roughness:.28});
    const white = new T.MeshStandardMaterial({color:0xe9e6e7,metalness:.62,roughness:.28});
    const red = new T.MeshStandardMaterial({color:0x9e2535,metalness:.79,roughness:.3});
    const redPlate = new T.MeshStandardMaterial({color:0x631627,metalness:.87,roughness:.28});
    const ember = new T.MeshStandardMaterial({color:0xff712d,emissive:0xe94509,emissiveIntensity:2.3,metalness:.22,roughness:.24});
    const glow = new T.MeshBasicMaterial({color:0xff9b37});
    const blue = new T.MeshStandardMaterial({color:0x5bebff,emissive:0x00a9db,emissiveIntensity:2.4,metalness:.2,roughness:.22});
    const glass = new T.MeshStandardMaterial({color:0x181321,metalness:.4,roughness:.18,transparent:true,opacity:.83});
    const membrane = new T.MeshStandardMaterial({color:0x461829,emissive:0x46101d,emissiveIntensity:.45,metalness:.33,roughness:.55,side:T.DoubleSide,transparent:true,opacity:.87});
    const membraneAlt = new T.MeshStandardMaterial({color:0x7b2e32,emissive:0x5e2119,emissiveIntensity:.4,metalness:.35,roughness:.44,side:T.DoubleSide,transparent:true,opacity:.89});
    const edgeMat = new T.MeshBasicMaterial({color:0xff7545,side:T.DoubleSide,transparent:true,opacity:.68});
    const sphereGeo = new T.SphereGeometry(1,18,12);
    const icoGeo = new T.IcosahedronGeometry(1,1);
    const boxGeo = new T.BoxGeometry(1,1,1);
    const coneGeo = new T.ConeGeometry(1,1,7);
    const cylGeo = new T.CylinderGeometry(1,1,1,10);
    const root = new T.Group();scene.add(root);
    const dragon = new T.Group();root.add(dragon);
    const meshes = [];
    const make = (geo,mat,parent,pos,scale,hotspot) => {
      const m = new T.Mesh(geo,mat);
      m.position.set(...pos);m.scale.set(...scale);
      parent.add(m);
      if(hotspot){m.userData.hotspot=hotspot;meshes.push(m);}
      return m;
    };
    const ball=(p,m,xyz,sc,hot)=>make(sphereGeo,m,p,xyz,sc,hot);
    const shell=(p,m,xyz,sc,hot)=>make(icoGeo,m,p,xyz,sc,hot);
    const block=(p,m,xyz,sc,hot)=>make(boxGeo,m,p,xyz,sc,hot);
    const spike=(p,m,xyz,sc,rot,hot)=>{const k=make(coneGeo,m,p,xyz,sc,hot);if(rot)k.rotation.set(...rot);return k;};
    const rod=(p,m,a,b,r=0.05,hot)=>{
      const start=new T.Vector3(...a),end=new T.Vector3(...b),dir=end.clone().sub(start);
      const k=make(cylGeo,m,p,start.clone().add(end).multiplyScalar(.5).toArray(),[r,dir.length(),r],hot);
      k.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());return k;
    };
    const plate=(p,mat,pts,hot)=>{
      const flat=[];
      for(let i=1;i<pts.length-1;i++) flat.push(...pts[0],...pts[i],...pts[i+1]);
      const geometry=new T.BufferGeometry();
      geometry.setAttribute('position',new T.Float32BufferAttribute(flat,3));
      geometry.computeVertexNormals();
      const mesh=new T.Mesh(geometry,mat);p.add(mesh);
      if(hot){mesh.userData.hotspot=hot;meshes.push(mesh);}
      return mesh;
    };
    // Mech torso, turbine ribs and visible skeleton.
    ball(dragon,gunmetal,[0,1.45,0],[.80,.73,1.28],'chest');
    shell(dragon,redPlate,[0,1.58,-.2],[.87,.73,1.12],'chest');
    ball(dragon,metal,[0,1.35,.66],[.66,.56,.67],'chest');
    for(let s of [-1,1]){
      shell(dragon,white,[s*.57,1.67,.62],[.47,.45,.73],'chest');
      shell(dragon,red,[s*.64,1.78,.68],[.3,.23,.55],'chest');
      rod(dragon,ember,[s*.4,1.6,1.01],[s*.5,1.2,.98],.034,'chest');
      for(let i=0;i<4;i++)rod(dragon,silver,[s*(.66-i*.05),1.38-i*.16,.65],[s*(.50-i*.03),1.28-i*.16,1.02],.045,'chest');
    }
    // Reactor ring, rotating power assembly.
    const reactor = new T.Group();reactor.position.set(0,1.57,1.08);dragon.add(reactor);
    const front=new T.Mesh(new T.TorusGeometry(.29,.055,11,44),ember);reactor.add(front);
    const innerRing=new T.Mesh(new T.TorusGeometry(.19,.025,10,42),silver);reactor.add(innerRing);
    ball(reactor,blue,[0,0,.015],[.19,.19,.09],'chest');
    // Neck pistons and exoskeleton, each joint has its own silhouette.
    const neck = new T.Group();neck.position.set(0,2.0,.66);dragon.add(neck);
    rod(neck,gunmetal,[0,0,0],[0,.46,.53],.28,'head');
    rod(neck,metal,[0,.35,.45],[0,.73,.9],.27,'head');
    for(let s of [-1,1]){
      rod(neck,silver,[s*.18,.04,.12],[s*.17,.5,.61],.064,'head');
      shell(neck,red,[s*.20,.28,.38],[.25,.28,.36],'head');
    }
    const head = new T.Group();head.position.set(0,2.79,1.64);dragon.add(head);
    ball(head,gunmetal,[0,0,0],[.51,.43,.64],'head');
    shell(head,white,[0,.13,.07],[.56,.41,.6],'head');
    ball(head,redPlate,[0,.19,-.11],[.42,.28,.5],'head');
    // Angular muzzle with articulated lower jaw
    const muzzle=block(head,silver,[0,-.12,.59],[.62,.29,.91],'head');
    muzzle.rotation.x=-.09;
    block(head,metal,[0,-.27,.75],[.52,.12,.58],'head');
    const jaw = new T.Group();jaw.position.set(0,-.23,.35);head.add(jaw);
    block(jaw,red,[0,-.17,.36],[.55,.19,.78],'head');
    block(jaw,white,[0,-.06,.43],[.43,.09,.66],'head');
    for(let s of [-1,1]) {
      shell(head,red,[s*.44,-.03,.33],[.17,.22,.42],'head');
      ball(head,gunmetal,[s*.34,.18,.30],[.17,.18,.18],'head');
      ball(head,ember,[s*.36,.18,.42],[.09,.105,.07],'head');
      spike(head,silver,[s*.36,.46,-.20],[.15,.65,.15],[s*.37,0,-s*.2],'head');
      spike(head,red,[s*.50,.3,-.36],[.12,.42,.12],[s*.48,0,-s*.33],'head');
      spike(head,white,[s*.24,.03,.98],[.10,.23,.1],[Math.PI,0,0],'head');
      spike(jaw,white,[s*.22,-.03,.63],[.085,.16,.09],[0,0,0],'head');
      ball(head,glass,[s*.22,-.23,1.02],[.10,.05,.08],'head');
    }
    // Back armor fins and moving tail with joint chain.
    for(let i=0;i<7;i++){
      const z=.16-i*.35,y=2.19-Math.max(0,i-3)*.075;
      spike(dragon,i%2?silver:red,[0,y,z],[.22,.46-i*.035,.31],[.21,0,Math.PI],'back');
    }
    const tailLinks=[];
    const tailRoot=new T.Group();tailRoot.position.set(0,1.7,-1.16);dragon.add(tailRoot);
    let prev=tailRoot;
    for(let i=0;i<8;i++){
      const part=new T.Group();part.position.set(0,i===0?0:-.025,i===0?0:-.42);prev.add(part);
      const size=1-i/10;
      ball(part,metal,[0,0,-.21],[.32*size,.25*size,.35],'tail');
      shell(part,i%2?redPlate:silver,[0,.13*size,-.23],[.29*size,.18*size,.37],'tail');
      spike(part,ember,[0,.32*size,-.20],[.10*size,.29*size,.13*size],[0,0,Math.PI],'tail');
      tailLinks.push(part);prev=part;
    }
    spike(prev,white,[0,0,-.50],[.22,.95,.24],[Math.PI/2,0,0],'tail');
    // Four industrial limbs with segmented pistons, visible hinge and claws.
    const legs=[];
    for (const z of [-.68,.69]) for (const s of [-1,1]) {
      const leg=new T.Group();leg.position.set(s*.68,1.32,z);dragon.add(leg);
      ball(leg,gunmetal,[0,0,0],[.3,.28,.3],'leg');
      shell(leg,z>0?white:red,[s*.09,-.21,.07],[.38,.50,.41],'leg');
      rod(leg,metal,[s*.07,-.39,.1],[s*.19,-.89,.35],.15,'leg');
      rod(leg,ember,[s*.28,-.27,.07],[s*.20,-.66,.25],.045,'leg');
      shell(leg,white,[s*.19,-1.02,.45],[.37,.2,.55],'leg');
      for(let j=-1;j<=1;j++) spike(leg,silver,[s*.19+j*.20,-1.07,.84],[.105,.43,.12],[Math.PI/2,0,0],'leg');
      legs.push(leg);
    }
    // Wings: true double-sided triangular meshes, metal skeleton, neon edge veins.
    const wingHinges=[];
    function createWing(sign){
      const hinge=new T.Group();hinge.position.set(sign*.58,2.12,-.44);dragon.add(hinge);
      const transform=p=>[p[0]*sign,p[1],p[2]];
      const a=[0,0,0],b=[1.15,.67,-.29],c=[2.20,1.35,-.74],d=[3.25,1.60,-1.08],e=[3.10,.42,-.84],f=[2.4,-.15,-.37],g=[1.48,-.44,.04],h=[.32,-.36,.13];
      [[a,b,h],[b,g,h],[b,c,g],[c,f,g],[c,d,f],[d,e,f]].forEach((tri,i)=>plate(hinge,i%2?membrane:membraneAlt,tri.map(transform),'wing'));
      [[a,b],[b,c],[c,d],[b,g],[c,f],[d,e],[f,g]].forEach((pair,i)=>rod(hinge,i<3?gunmetal:ember,transform(pair[0]),transform(pair[1]),i<3?.085:.027,'wing'));
      [b,c,d].forEach(p=>ball(hinge,silver,transform(p),[.12,.12,.13],'wing'));
      [[c,d],[d,e],[e,f]].forEach(pair=>rod(hinge,edgeMat,transform(pair[0]),transform(pair[1]),.024,'wing'));
      for(const p of [g,f,e])spike(hinge,white,transform([p[0],p[1]-.05,p[2]]),[.10,.23,.1],[Math.PI,0,0],'wing');
      wingHinges.push({hinge,sign});
    }
    createWing(-1);createWing(1);
    // Display arena, warehouse architecture, floating embers.
    const plinth=new T.Mesh(new T.CylinderGeometry(2.75,2.92,.33,72),gunmetal);plinth.position.y=-.23;scene.add(plinth);
    const base=new T.Mesh(new T.CylinderGeometry(2.56,2.7,.12,72),metal);base.position.y=-.045;scene.add(base);
    for(let r of [1.85,2.4,2.66]){
      const ring=new T.Mesh(new T.TorusGeometry(r,r===2.4?.028:.016,10,94),r===2.4?ember:red);
      ring.rotation.x=Math.PI/2;ring.position.y=.026;scene.add(ring);
    }
    const grid=new T.GridHelper(46,38,0x62302e,0x27161f);grid.position.y=-.39;grid.material.transparent=true;grid.material.opacity=.26;scene.add(grid);
    for(let s of [-1,1]){
      for(let j=0;j<3;j++){
        const p=block(scene,gunmetal,[s*(4+j*2.1),3.6,-4.5-j*2.4],[.28,8,.36]);
        p.rotation.z=s*.035;
        rod(scene,red,[s*(4+j*2.1),5.6,-4.1-j*2.4],[s*(4+j*2.1),5.6,-3.85-j*2.4],.06);
      }
    }
    const glowTex=(()=>{
      const cn=document.createElement('canvas');cn.width=64;cn.height=64;
      const cx=cn.getContext('2d'),grad=cx.createRadialGradient(32,32,0,32,32,32);
      grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(.25,'rgba(255,235,196,.85)');
      grad.addColorStop(.6,'rgba(255,119,36,.2)');grad.addColorStop(1,'rgba(255,119,36,0)');
      cx.fillStyle=grad;cx.fillRect(0,0,64,64);
      return new T.CanvasTexture(cn);
    })();
    const aura=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0xff6b35,depthWrite:false,blending:T.AdditiveBlending,transparent:true,opacity:.48}));
    aura.position.set(0,1.52,1.42);aura.scale.set(1.75,1.75,1);dragon.add(aura);
    const ambient=new T.HemisphereLight(0x96bbff,0x542025,2.0);scene.add(ambient);
    const key=new T.DirectionalLight(0xffe7d5,3.7);key.position.set(4,8,6);scene.add(key);
    const rim=new T.PointLight(0xff5229,74,15,1.6);rim.position.set(-3,4,-1);scene.add(rim);
    const edge=new T.PointLight(0x26a8ff,52,12,1.8);edge.position.set(4,3,-5);scene.add(edge);
    const flash=new T.PointLight(0xffa444,0,8,2);flash.position.set(0,2.5,3.1);dragon.add(flash);
    // Instanced visual particles in a genuine 3D point cloud.
    const CAP=240, positions=new Float32Array(CAP*3),rgb=new Float32Array(CAP*3);
    const motion=Array.from({length:CAP},()=>({age:0,v:new T.Vector3(),life:1}));
    for(let i=0;i<CAP;i++){positions[i*3+1]=-1000;rgb.set([1,.35,.05],i*3);}
    const particles=new T.BufferGeometry();
    particles.setAttribute('position',new T.BufferAttribute(positions,3));
    particles.setAttribute('color',new T.BufferAttribute(rgb,3));
    const pmat=new T.PointsMaterial({size:.37,map:glowTex,vertexColors:true,transparent:true,opacity:.96,blending:T.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
    const flame=new T.Points(particles,pmat);flame.frustumCulled=false;scene.add(flame);
    const sparkCount=95,sparkPos=new Float32Array(sparkCount*3);
    for(let i=0;i<sparkCount;i++){sparkPos.set([(Math.random()-.5)*13,Math.random()*7,(Math.random()-.5)*12],i*3);}
    const sparkg=new T.BufferGeometry();sparkg.setAttribute('position',new T.BufferAttribute(sparkPos,3));
    const sparks=new T.Points(sparkg,new T.PointsMaterial({color:0xff945a,map:glowTex,transparent:true,opacity:.6,blending:T.AdditiveBlending,size:.085,depthWrite:false}));scene.add(sparks);
    const shock = new T.Mesh(new T.TorusGeometry(1,.06,8,90),new T.MeshBasicMaterial({color:0xff7c42,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));
    shock.rotation.x=Math.PI/2;shock.position.y=.06;scene.add(shock);
    const ray=new T.Raycaster(),pointer=new T.Vector2(0,0);
    const target=new T.Vector3(),tempQ=new T.Quaternion();
    let yaw=.32,pitch=.22,zoom=9.8,targetYaw=yaw,targetPitch=pitch,targetZoom=zoom;
    let overPart='',drag=false,pressed=null,lastX=0,lastY=0,still=0;
    let fireUntil=0,roarUntil=0,rage=false,shockAge=99,wingDeployUntil=0,mode='SENTINEL / IDLE';
    let ptIndex=0,spawnAccum=0,t0=performance.now(),last=t0;
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    const smooth=(a,b,s,dt)=>a+(b-a)*(1-Math.exp(-s*dt));
    function mood(text){if(status)status.textContent=text;}
    function mouthLocation(){
      dragon.updateWorldMatrix(true,true);
      return head.localToWorld(new T.Vector3(0,-.20,1.26));
    }
    function shoot(){
      const now=performance.now();
      fireUntil=now+1850;roarUntil=now+1550;shockAge=0;
      if(counter) counter.textContent=String((Number(counter.textContent)||0)+1).padStart(2,'0');
      mood('INFERNO / ATTACKING');
    }
    function roar(){roarUntil=performance.now()+1150;mood('DRAGON / ROAR');}
    function transformMode(){
      rage=!rage;
      mood(rage?'BERSERK MODE / ARMED':'SENTINEL MODE / ARMED');
      red.emissive=new T.Color(rage?0xff300d:0x000000);
      red.emissiveIntensity=rage?.55:0;
      ember.color.set(rage?0xff3b28:0xff712d);
      blue.color.set(rage?0xff5c18:0x5bebff);
    }
    function scatter(){
      wingDeployUntil=performance.now()+1900;
      mood('WINGS / DEPLOYED');
    }
    function reset(){
      rage=false;fireUntil=0;roarUntil=0;shockAge=99;targetYaw=.32;targetPitch=.22;targetZoom=9.8;
      red.emissive.set(0x000000);red.emissiveIntensity=0;
      ember.color.set(0xff712d);blue.color.set(0x5bebff);
      mood('SENTINEL / IDLE');
    }
    $('#dragonFire')?.addEventListener('click',shoot);
    $('#dragonRoar')?.addEventListener('click',roar);
    $('#dragonMode')?.addEventListener('click',transformMode);
    $('#dragonReset')?.addEventListener('click',reset);
    const bounds=()=>glCanvas.getBoundingClientRect();
    function intersect(event){
      const b=bounds();
      pointer.set((event.clientX-b.left)/b.width*2-1,-((event.clientY-b.top)/b.height*2-1));
      ray.setFromCamera(pointer,camera);
      const hits=ray.intersectObjects(meshes,false);
      return hits[0]?.object.userData.hotspot||'';
    }
    glCanvas.addEventListener('pointermove',e=>{
      const b=bounds();
      const x=(e.clientX-b.left)/b.width*2-1,y=(e.clientY-b.top)/b.height*2-1;
      if(drag){targetYaw-=(e.clientX-lastX)*.007;targetPitch=clamp(targetPitch+(e.clientY-lastY)*.0055,-.15,.78);}
      else {const next=intersect(e);if(next!==overPart){overPart=next;if(next==='head')mood('EYE LOCK / CLICK TO IGNITE');else if(next==='wing')mood('WING ACTUATOR / CLICK TO DEPLOY');else if(next==='tail')mood('TAIL SENSOR / CLICK TO ROAR');else if(next==='chest')mood('REACTOR / CLICK TO SHIFT MODE');else mood(rage?'BERSERK / ARMED':'SENTINEL / ARMED');}glCanvas.style.cursor=overPart?'pointer':'grab';}
      lastX=e.clientX;lastY=e.clientY;still=performance.now();
      if(!drag){head.userData.targetX=clamp(x*.25,-.25,.25);head.userData.targetY=clamp(-y*.17,-.13,.13);}
    });
    glCanvas.addEventListener('pointerdown',e=>{
      if(e.button!==0 && e.pointerType==='mouse')return;
      drag=true;pressed={x:e.clientX,y:e.clientY,hot:intersect(e)};
      lastX=e.clientX;lastY=e.clientY;
      glCanvas.setPointerCapture(e.pointerId);
      glCanvas.style.cursor='grabbing';
    });
    glCanvas.addEventListener('pointerup',e=>{
      if(!drag)return;drag=false;
      const dist=Math.hypot(e.clientX-pressed.x,e.clientY-pressed.y);
      if(dist<9){
        switch(pressed.hot){
          case 'head':shoot();break;
          case 'chest':transformMode();break;
          case 'wing':scatter();break;
          case 'tail':roar();break;
          default:break;
        }
      }
      overPart=intersect(e);glCanvas.style.cursor=overPart?'pointer':'grab';
    });
    glCanvas.addEventListener('pointercancel',()=>{drag=false;});
    glCanvas.addEventListener('wheel',e=>{
      e.preventDefault();targetZoom=clamp(targetZoom+e.deltaY*.006,6.8,15.5);
    },{passive:false});
    const keydown=e=>{
      if(e.target.closest('button,input,textarea,select,[contenteditable]'))return;
      const rect=stage.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)return;
      if(e.key.toLowerCase()==='f'){e.preventDefault();shoot();}
      if(e.key.toLowerCase()==='r'){e.preventDefault();roar();}
      if(e.code==='Space'){e.preventDefault();transformMode();}
    };
    window.addEventListener('keydown',keydown);
    const onResize=()=>{
      const rect=stage.getBoundingClientRect();const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
      camera.aspect=w/h;camera.fov=w<500?48:39;camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,w<640?1.35:1.8));renderer.setSize(w,h,false);
    };
    const resizeObserver=new ResizeObserver(onResize);resizeObserver.observe(stage);onResize();
    let visible=true,alive=true,raf=0;
    const observed=new IntersectionObserver(es=>{
      visible=es[0]?.isIntersecting??true;
      if(visible && alive && !raf){last=performance.now();raf=requestAnimationFrame(animate);}
    },{threshold:.01});
    observed.observe(stage);
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden&&visible&&alive&&!raf){last=performance.now();raf=requestAnimationFrame(animate);}
    });
    renderer.domElement.addEventListener('webglcontextlost',e=>{
      e.preventDefault();alive=false;cancelAnimationFrame(raf);raf=0;mood('GRAPHICS CONTEXT LOST / RELOAD');
    });
    const up=new T.Vector3(0,1,0);
    function emit(dt) {
      const firing=performance.now()<fireUntil;
      if(firing)spawnAccum+=dt*170;
      else if(overPart==='head' && !reducedMotion)spawnAccum+=dt*9;
      let spawnCount=Math.min(25,Math.floor(spawnAccum));
      spawnAccum-=spawnCount;
      if(!firing)spawnAccum=0;
      const origin=spawnCount?mouthLocation():null;
      const direction=spawnCount?new T.Vector3(0,.03,1).applyQuaternion(head.getWorldQuaternion(tempQ)).normalize():null;
      for(let i=0;i<spawnCount;i++){
        const idx=ptIndex++%CAP,j=idx*3,m=motion[idx];
        const at=origin.clone().addScaledVector(direction,Math.random()*.4);
        positions[j]=at.x;positions[j+1]=at.y;positions[j+2]=at.z;
        m.age=.001;m.life=.55+Math.random()*.5;
        m.v.copy(direction).multiplyScalar((firing?6:1.2)+Math.random()*(firing?6:1.4));
        m.v.x+=(Math.random()-.5)*2.1;m.v.y+=(Math.random()-.5)*1.3;m.v.z+=(Math.random()-.5)*1.9;
      }
      for(let i=0;i<CAP;i++){
        const m=motion[i];if(m.age<=0)continue;
        m.age+=dt;
        const j=i*3;
        if(m.age>=m.life){m.age=0;positions[j+1]=-1000;continue;}
        positions[j]+=m.v.x*dt;positions[j+1]+=m.v.y*dt+.35*dt;positions[j+2]+=m.v.z*dt;
        const r=m.age/m.life;rgb[j]=1;rgb[j+1]=Math.max(.02,.8-r*.92);rgb[j+2]=Math.max(.008,.25-r*.30);
      }
      particles.attributes.position.needsUpdate=true;
      particles.attributes.color.needsUpdate=true;
    }
    function animate(now) {
      raf=0;if(!alive||!visible||document.hidden)return;
      const dt=Math.min((now-last)/1000,.045);last=now;
      const t=(now-t0)*.001;
      yaw=smooth(yaw,targetYaw,6,dt);pitch=smooth(pitch,targetPitch,6,dt);zoom=smooth(zoom,targetZoom,5,dt);
      const size=stage.getBoundingClientRect().width;
      const factor=size<600?1.15:1;
      camera.position.set(Math.sin(yaw)*Math.cos(pitch)*zoom*factor,2.0+Math.sin(pitch)*zoom*.65,Math.cos(yaw)*Math.cos(pitch)*zoom*factor);
      camera.lookAt(0,1.55,0);
      const fireActive=now<fireUntil,roaring=now<roarUntil;
      const energy=fireActive?1:overPart==='head'?.45:.06;
      const pulse=1+Math.sin(t*4)*.07;
      reactor.rotation.z+=dt*(fireActive?4:0.7);
      aura.material.opacity=.33+energy*.35;
      aura.scale.setScalar(1.9*pulse+(fireActive?.65:0));
      flash.intensity=fireActive?12+Math.sin(t*38)*10:0;
      const active=fireActive?1:roaring?.65:0;
      jaw.rotation.x=smooth(jaw.rotation.x,active*.67,13,dt);
      head.rotation.y=smooth(head.rotation.y,head.userData.targetX||0,3.7,dt);
      head.rotation.x=smooth(head.rotation.x,head.userData.targetY||0,3.7,dt);
      if(still && now-still>4300){head.userData.targetX=Math.sin(t)*.06;head.userData.targetY=.04;}
      const hoverWing=overPart==='wing'?.24:0;
      const spread=now<wingDeployUntil?.43:0;
      for(const {hinge,sign} of wingHinges) {
        const targetZ=sign*(.07+hoverWing+spread+(!reducedMotion?Math.sin(t*1.45)*.07:0)+(roaring?.19:0));
        hinge.rotation.z=smooth(hinge.rotation.z,targetZ,4.1,dt);
        hinge.rotation.y=sign*Math.sin(t*.9)*.035;
      }
      for(let i=0;i<tailLinks.length;i++){
        tailLinks[i].rotation.y=Math.sin(t*1.35-i*.38)*(.08+i*.009)*(overPart==='tail'?2.4:1);
        tailLinks[i].rotation.x=Math.sin(t*1.1-i*.4)*.025;
      }
      for(let i=0;i<legs.length;i++)legs[i].rotation.x=!reducedMotion?Math.sin(t*1.4+i*Math.PI)*.013:0;
      dragon.position.y=(reducedMotion?0:Math.sin(t*1.5)*.04)+(roaring?Math.sin(t*21)*.055:0);
      if(!fireActive && status?.textContent==='INFERNO / ATTACKING')mood(rage?'BERSERK / ARMED':'SENTINEL / ARMED');
      if(shockAge<1.2){shockAge+=dt;shock.scale.setScalar(.2+shockAge*3.5);shock.material.opacity=Math.max(0,(1-shockAge/1.2)*.8);}
      else shock.material.opacity=0;
      sparks.rotation.y=t*.007;
      emit(dt);
      renderer.render(scene,camera);
      raf=requestAnimationFrame(animate);
    }
    raf=requestAnimationFrame(animate);
    window.addEventListener('pagehide',()=>{alive=false;cancelAnimationFrame(raf);resizeObserver.disconnect();observed.disconnect();},{once:true});
    mood('SENTINEL / ARMED');
  }
})();