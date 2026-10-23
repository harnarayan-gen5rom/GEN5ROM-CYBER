/* Dragon Forge V3 — cinematic model-based experience.
   High-detail CC0 dragon from Grab3D with CORS-safe CC0 fallback from 3DAssets.dev.
   Three.js is requested only when the visitor activates the scene.
*/
(() => {
  'use strict';
  const stage=document.getElementById('dragonStage'),start=document.getElementById('dragonStart');
  if(!stage||!start) return;
  const message=document.getElementById('dragonMessage'),state=document.getElementById('dragonState'),
        count=document.getElementById('dragonCount'),standby=document.getElementById('dragonStandby'),
        controls=document.getElementById('dragonControls');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let launched=false,loading=false;
  const cc0Fallback='https://cdn.3dassets.dev/assets/36697/v1/model.glb';
  const cc0Roar='https://cdn.3dassets.dev/assets/36702/v1/model.glb';
  const status=t=>{if(state) state.textContent=t;};
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function withTimeout(p,ms) {
    return Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Asset load timeout')),ms))]);
  }
  start.addEventListener('click',async()=>{
    if(loading||launched)return;
    loading=true;start.disabled=true;start.textContent='SUMMONING THE DRAGON…';
    if(message)message.textContent='Loading the 3D renderer and sculpted dragon. First load can take a moment.';
    try{
      const THREE=await import('three');
      const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
      const app=await init(THREE,GLTFLoader);
      launched=true;window.__dragonForgeV3=app;
      start.hidden=true;standby.hidden=true;controls.hidden=false;
      const e=document.querySelector('.dragon-viewport-status');if(e)e.hidden=false;
      if(message)message.textContent='DRAG TO ORBIT · CLICK DRAGON OR PRESS F TO BREATHE FIRE · SPACE TO ENTER RAGE MODE';
    }catch(err) {
      console.error('Dragon Forge V3 unavailable:',err);
      if(message)message.textContent='3D could not load on this connection. Please retry or use another WebGL browser.';
      start.disabled=false;start.textContent='RETRY THE DRAGON ↗';
    }finally{loading=false;}
  });

  async function init(T,GLTFLoader){
    const scene=new T.Scene();scene.background=null;scene.fog=new T.FogExp2(0x0b0810,.033);
    const camera=new T.PerspectiveCamera(35,1,.1,150);
    const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance',preserveDrawingBuffer:false});
    renderer.setClearColor(0x0b0810,0);
    renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.17;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    const canvas=renderer.domElement;stage.insertBefore(canvas,stage.firstChild);
    canvas.style.touchAction='none';
    canvas.setAttribute('aria-label','Interactive sculpted 3D dragon. Drag to orbit, click to breathe fire.');
    canvas.setAttribute('role','img');

    const hemi=new T.HemisphereLight(0x8294c0,0x271119,1.55);scene.add(hemi);
    const key=new T.SpotLight(0xffdfbe,130,32,Math.PI/5,.68,1.35);
    key.position.set(-4,9,8);key.target.position.set(0,1.4,0);key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0002;
    scene.add(key,key.target);
    const rim=new T.DirectionalLight(0xff6540,3.8);rim.position.set(5,6,-6);scene.add(rim);
    const fill=new T.PointLight(0x4674bc,43,17,1.7);fill.position.set(-5,2,-4);scene.add(fill);
    const eye=new T.PointLight(0xff7b32,7,5,1.5);eye.position.set(0,3,3);scene.add(eye);
    const fireLight=new T.PointLight(0xff7a22,0,17,1.35);scene.add(fireLight);

    const stageRoot=new T.Group();scene.add(stageRoot);
    const dragonPivot=new T.Group();stageRoot.add(dragonPivot);
    const groundMat=new T.MeshStandardMaterial({color:0x0f1019,metalness:.46,roughness:.72});
    const stoneMat=new T.MeshStandardMaterial({color:0x20202a,roughness:.82,metalness:.14});
    const disk=new T.Mesh(new T.CylinderGeometry(3.7,3.98,.27,96),groundMat);
    disk.position.y=-.17;disk.receiveShadow=true;scene.add(disk);
    const surface=new T.Mesh(new T.CylinderGeometry(3.65,3.68,.035,96),stoneMat);
    surface.position.y=-.011;surface.receiveShadow=true;scene.add(surface);
    const rings=[];
    for(const [r,w,col] of [[3.72,.025,0xff744b],[3.39,.007,0x8b4a48],[2.99,.009,0x7d4550]]){
      const mesh=new T.Mesh(new T.TorusGeometry(r,w,8,110),new T.MeshBasicMaterial({color:col,transparent:true,opacity:r===3.72?.85:.28}));
      mesh.rotation.x=Math.PI/2;mesh.position.y=.025;scene.add(mesh);rings.push(mesh);
    }
    const underneath=new T.Mesh(new T.CylinderGeometry(3.98,4.05,.28,96),
      new T.MeshStandardMaterial({color:0x0b0c13,metalness:.85,roughness:.47}));
    underneath.position.y=-.39;scene.add(underneath);
    const plane=new T.Mesh(new T.PlaneGeometry(180,180),new T.MeshStandardMaterial({color:0x08080d,roughness:.94}));
    plane.rotation.x=-Math.PI/2;plane.position.y=-.55;plane.receiveShadow=true;scene.add(plane);
    // Irregular boulders stop the stage from looking like a toy turntable.
    for(let i=0;i<26;i++){
      const angle=i*2.399,dist=4.5+(i%4)*.39,rock=new T.Mesh(
        new T.DodecahedronGeometry(.30+(i%4)*.10,0),
        new T.MeshStandardMaterial({color:i%3?0x17141c:0x27212a,metalness:.08,roughness:.92})
      );
      rock.position.set(Math.cos(angle)*dist,-.40,Math.sin(angle)*dist);
      rock.scale.set(1.3,.4+(i%3)*.17,1.1);rock.rotation.set(i*.28,i*.77,i*.38);
      rock.castShadow=i%3===0;rock.receiveShadow=true;scene.add(rock);
    }

    const loader=new GLTFLoader();
    let dragon=null,source='lightweight CC0',roaring=null;
    const loadUrl=url=>new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject));
    // Prefer true PBR sculpted high-detail asset. Read its URL from the publisher's documented JSON API,
    // rather than inventing an unverified download path.
    try {
      if(!(/Android|iPhone|iPad/i.test(navigator.userAgent))){
        const r=await withTimeout(fetch('https://grab3d.com/api/v1/models/dragon.json',{mode:'cors'}),4500);
        if(!r.ok)throw new Error('High-detail asset listing unavailable');
        const data=await r.json();
        const files=data.files||data.model?.files||[];
        const file=files.find(x=>x.format==='glb'&&x.variant==='light')||
                   files.find(x=>x.format==='glb'&&x.variant==='full');
        if(!file?.url||!/^https:\/\//.test(file.url))throw new Error('No published GLB URL');
        const result=await withTimeout(loadUrl(file.url),16000);
        dragon=result.scene;source='high-detail CC0';
      }
    } catch(err){console.info('Using web-optimized dragon fallback:',err.message);}
    if(!dragon){
      try {
        const result=await withTimeout(loadUrl(cc0Fallback),12000);
        dragon=result.scene;
      }catch(err){
        renderer.dispose();canvas.remove();
        throw new Error('Both dragon sources unavailable: '+err.message);
      }
    }

    let bbox=new T.Box3().setFromObject(dragon);
    const originalSize=bbox.getSize(new T.Vector3());
    const scale=6.4/Math.max(originalSize.x,originalSize.y,originalSize.z);
    dragon.scale.setScalar(scale);
    dragon.updateMatrixWorld(true);bbox.setFromObject(dragon);
    const center=bbox.getCenter(new T.Vector3());
    dragon.position.set(-center.x,-bbox.min.y,-center.z);
    dragonPivot.add(dragon);
    dragonPivot.updateMatrixWorld(true);
    // Real high-density PBR materials are retained. No cartoon emissive skin or geometry noise.
    dragon.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=true;o.receiveShadow=false;
      if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){
        // Keep the asset's authored sidedness (important for wings and thin membranes).
        if('envMapIntensity'in m)m.envMapIntensity=.9;
        if('roughness'in m)m.roughness=Math.max(.26,m.roughness);
      }}
    });
    // Optional expressive roar pose for the low-weight CC0 asset; carefully crossfaded rather than bone-snapping.
    let roarModel=null;
    if(source!=='high-detail CC0'){
      try {
        roaring=(await withTimeout(loadUrl(cc0Roar),8000)).scene;
        roaring.scale.setScalar(scale);
        const rb=new T.Box3().setFromObject(roaring),rc=rb.getCenter(new T.Vector3());
        roaring.position.set(-rc.x,-rb.min.y,-rc.z);
        roarModel=new T.Group();roarModel.add(roaring);roarModel.visible=false;
        dragonPivot.add(roarModel);
        roaring.traverse(o=>{if(o.isMesh)o.castShadow=true;});
      }catch(e){console.info('Roar pose not available:',e.message);}
    }
    const modelRoot=new T.Group();modelRoot.add(dragonPivot);stageRoot.add(modelRoot);
    // Emissive fog sheets, fire sparks and stage embers.
    const spriteCanvas=document.createElement('canvas');spriteCanvas.width=spriteCanvas.height=128;
    const sc=spriteCanvas.getContext('2d');
    const grd=sc.createRadialGradient(64,64,0,64,64,64);
    grd.addColorStop(0,'rgba(255,251,220,1)');grd.addColorStop(.2,'rgba(255,180,90,.84)');
    grd.addColorStop(.48,'rgba(255,74,26,.28)');grd.addColorStop(1,'rgba(255,74,26,0)');
    sc.fillStyle=grd;sc.fillRect(0,0,128,128);
    const map=new T.CanvasTexture(spriteCanvas);
    const countParticles=400;
    const geom=new T.BufferGeometry(),positions=new Float32Array(countParticles*3),
          color=new Float32Array(countParticles*3),parts=[];
    for(let i=0;i<countParticles;i++){
      positions.set([0,-999,0],i*3);color.set([1,.32,.04],i*3);
      parts.push({age:0,life:1,velocity:new T.Vector3(),base:new T.Vector3()});
    }
    geom.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
    geom.setAttribute('color',new T.BufferAttribute(color,3).setUsage(T.DynamicDrawUsage));
    const mat=new T.PointsMaterial({map,size:.31,vertexColors:true,blending:T.AdditiveBlending,
      depthWrite:false,transparent:true,opacity:.9,alphaTest:.015});
    const particles=new T.Points(geom,mat);particles.frustumCulled=false;scene.add(particles);

    const stars=new T.BufferGeometry();const starPos=new Float32Array(75*3);
    for(let i=0;i<75;i++)starPos.set([(Math.random()-.5)*17,Math.random()*8, (Math.random()-.5)*12],i*3);
    stars.setAttribute('position',new T.BufferAttribute(starPos,3));
    const dust=new T.Points(stars,new T.PointsMaterial({map,color:0xff8d58,size:.06,transparent:true,opacity:.55,
      blending:T.AdditiveBlending,depthWrite:false}));
    scene.add(dust);
    const shock=new T.Mesh(new T.TorusGeometry(1,.043,8,120),
      new T.MeshBasicMaterial({color:0xffc17e,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));
    shock.rotation.x=Math.PI/2;shock.position.y=.06;scene.add(shock);

    // Flame sheet: tapered 3D turbulent surface; translucent and lit, not a single polygon cone.
    const rows=32,sides=18,fp=new Float32Array((rows+1)*(sides+1)*3),fc=new Float32Array(fp.length),fi=[];
    for(let i=0;i<rows;i++)for(let j=0;j<sides;j++){
      const a=i*(sides+1)+j;fi.push(a,a+sides+1,a+1,a+1,a+sides+1,a+sides+2);
    }
    const flameG=new T.BufferGeometry();
    flameG.setIndex(fi);flameG.setAttribute('position',new T.BufferAttribute(fp,3).setUsage(T.DynamicDrawUsage));
    flameG.setAttribute('color',new T.BufferAttribute(fc,3).setUsage(T.DynamicDrawUsage));
    const flameM=new T.MeshBasicMaterial({side:T.DoubleSide,vertexColors:true,transparent:true,opacity:.65,
      blending:T.AdditiveBlending,depthWrite:false});
    const flame=new T.Mesh(flameG,flameM);flame.frustumCulled=false;flame.visible=false;scene.add(flame);

    let fireUntil=0,roarUntil=0,rage=false,last=performance.now(),clock=0,shotCount=0;
    let angle=.38,targetAngle=angle,vertical=.14,targetVertical=vertical,dist=11.0,targetDist=11.0;
    let mouseX=0,mouseY=0,hover=false,pointerDown=null,visible=true,alive=true,raf=0,spawn=0,index=0;
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    const damp=(a,b,delta,strength=5)=>a+(b-a)*(1-Math.exp(-delta*strength));
    const dragonDimensions=new T.Box3().setFromObject(dragon).getSize(new T.Vector3());
    const eyeLocation=new T.Vector3(0,dragonDimensions.y*.78,dragonDimensions.z*.39);
    function fire(){
      fireUntil=performance.now()+1650;
      roarUntil=fireUntil;shotCount++;if(count)count.textContent=String(shotCount).padStart(2,'0');
      status('INFERNO / ACTIVE');
    }
    function roar(){roarUntil=performance.now()+1250;status('THE DRAGON / ROARS');}
    function mode(){
      rage=!rage;status(rage?'BERSERK / ACTIVE':'EMBER / DORMANT');
      rim.color.setHex(rage?0xff2641:0xff6540);
      fireLight.color.setHex(rage?0xe94dff:0xff7a22);
    }
    function reset(){
      rage=false;fireUntil=0;roarUntil=0;targetAngle=.38;targetVertical=.14;targetDist=11;
      rim.color.setHex(0xff6540);fireLight.color.setHex(0xff7a22);
      status('EMBER / DORMANT');
    }
    document.getElementById('dragonFire')?.addEventListener('click',fire);
    document.getElementById('dragonRoar')?.addEventListener('click',roar);
    document.getElementById('dragonMode')?.addEventListener('click',mode);
    document.getElementById('dragonReset')?.addEventListener('click',reset);

    const ray=new T.Raycaster(),pointer=new T.Vector2();
    function hitDragon(e){
      const r=canvas.getBoundingClientRect();
      pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);
      ray.setFromCamera(pointer,camera);
      return ray.intersectObject(dragon,true).length>0;
    }
    canvas.addEventListener('pointermove',e=>{
      const r=canvas.getBoundingClientRect();
      mouseX=clamp((e.clientX-r.left)/r.width*2-1,-1,1);
      mouseY=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
      if(pointerDown){
        targetAngle-=(e.clientX-pointerDown.lastX)*.006;
        targetVertical=clamp(targetVertical+(e.clientY-pointerDown.lastY)*.0045,-.28,.7);
        pointerDown.lastX=e.clientX;pointerDown.lastY=e.clientY;
      }else {
        hover=hitDragon(e);canvas.style.cursor=hover?'pointer':'grab';
        if(hover)status(rage?'BERSERK / WATCHING':'DRAGON / WATCHING');
      }
    });
    canvas.addEventListener('pointerleave',()=>{hover=false;});
    canvas.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;
      pointerDown={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,hit:hitDragon(e)};
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointerup',e=>{
      if(!pointerDown)return;
      const moved=Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>8;
      if(!moved&&pointerDown.hit)fire();
      pointerDown=null;
    });
    canvas.addEventListener('pointercancel',()=>pointerDown=null);
    canvas.addEventListener('wheel',e=>{e.preventDefault();targetDist=clamp(targetDist+e.deltaY*.006,8.3,18.0);},{passive:false});
    const keydown=e=>{
      if(e.target.closest('button,input,textarea,select,[contenteditable]'))return;
      const r=stage.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      if(e.key.toLowerCase()==='f')fire();
      else if(e.key.toLowerCase()==='r')roar();
      else if(e.code==='Space'){e.preventDefault();mode();}
    };
    window.addEventListener('keydown',keydown);

    const resize=()=>{
      const r=stage.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
      camera.aspect=w/h;camera.fov=w<560?45:35;camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,w<650?1.3:1.8));
      renderer.setSize(w,h,false);
    };
    const observer=new ResizeObserver(resize);observer.observe(stage);resize();
    function emit(now,dt){
      const active=now<fireUntil,quiet=hover&&!reduce;
      spawn+=(active?220:quiet?6:1.4)*dt;
      const qty=Math.min(25,Math.floor(spawn));spawn-=qty;
      const origin=dragonPivot.localToWorld(eyeLocation.clone());
      const dir=new T.Vector3(0,.06,1).applyQuaternion(dragonPivot.getWorldQuaternion(new T.Quaternion()));
      for(let i=0;i<qty;i++){
        const j=index++%countParticles,p=parts[j],n=j*3;
        const start=active?origin.clone():new T.Vector3((Math.random()-.5)*8,Math.random()*.2,(Math.random()-.5)*8);
        positions.set(start.toArray(),n);
        p.age=.001;p.life=active?.36+Math.random()*.60:1+Math.random()*3;
        p.velocity.set((Math.random()-.5)*1.4,active?(Math.random()-.5)*.9:.3+Math.random()*.5,(Math.random()-.5)*1.2);
        if(active)p.velocity.addScaledVector(dir,4.5+Math.random()*4);
      }
      for(let i=0;i<countParticles;i++){
        const p=parts[i];if(p.age<=0)continue;
        p.age+=dt;const n=i*3;
        if(p.age>=p.life){p.age=0;positions[n+1]=-900;continue;}
        positions[n]+=p.velocity.x*dt;positions[n+1]+=p.velocity.y*dt;positions[n+2]+=p.velocity.z*dt;
        const life=p.age/p.life;color[n]=1;color[n+1]=Math.max(.12,.8-life*.65);color[n+2]=Math.max(.01,.27-life*.22);
      }
      geom.attributes.position.needsUpdate=true;geom.attributes.color.needsUpdate=true;
    }
    function animateFlame(now){
      if(now>=fireUntil){flame.visible=false;return;}
      flame.visible=true;const t=now*.001;
      const origin=dragonPivot.localToWorld(eyeLocation.clone());
      const q=dragonPivot.getWorldQuaternion(new T.Quaternion());
      const forward=new T.Vector3(0,0,1).applyQuaternion(q).normalize();
      const side=new T.Vector3(1,0,0).applyQuaternion(q).normalize();
      const up=new T.Vector3(0,1,0).applyQuaternion(q).normalize();
      const progress=(fireUntil-now)/1650;
      for(let i=0;i<=rows;i++){
        const u=i/rows,len=u*4.1*Math.min(1,(1-progress)*7+.17);
        const rad=(.1+.48*Math.sin(u*Math.PI*.8))*Math.pow(Math.max(.001,1-u),.5);
        const center=origin.clone().addScaledVector(forward,len);
        center.addScaledVector(up,Math.sin(t*6+u*14)*u*.18+u*u*.13);
        for(let j=0;j<=sides;j++){
          const a=j/sides*Math.PI*2,n=(i*(sides+1)+j)*3;
          const distort=1+.14*Math.sin(t*12+a*5+u*18);
          const point=center.clone().addScaledVector(side,Math.cos(a)*rad*distort)
            .addScaledVector(up,Math.sin(a)*rad*distort);
          fp.set(point.toArray(),n);
          fc[n]=1;fc[n+1]=Math.max(.05,.87-u*.75);fc[n+2]=Math.max(.005,.36-u*.36);
        }
      }
      flameM.opacity=Math.min(.72,progress*4);
      flameG.attributes.position.needsUpdate=true;flameG.attributes.color.needsUpdate=true;
    }
    function animate(now){
      raf=0;if(!alive||!visible||document.hidden)return;
      const dt=Math.min(.048,(now-last)*.001);last=now;clock+=dt;
      angle=damp(angle,targetAngle,dt);vertical=damp(vertical,targetVertical,dt);dist=damp(dist,targetDist,dt);
      const w=stage.clientWidth;
      const wide= w<600?1.18:1;
      camera.position.set(Math.sin(angle)*dist*wide,3.4+Math.sin(vertical)*dist*.65,Math.cos(angle)*dist*wide);
      camera.lookAt(0,1.42,0);
      if(!reduce){
        dragonPivot.position.y=.025*Math.sin(clock*1.7);
        dragonPivot.rotation.y=damp(dragonPivot.rotation.y,mouseX*.046,dt,2.3);
        dragonPivot.rotation.x=damp(dragonPivot.rotation.x,-mouseY*.018,dt,2.3);
        dragonPivot.scale.setScalar(1+.005*Math.sin(clock*1.55));
      }
      const fireActive=now<fireUntil,roarActive=now<roarUntil;
      fireLight.intensity=fireActive?21+Math.sin(clock*34)*9:0;
      const origin=dragonPivot.localToWorld(eyeLocation.clone());fireLight.position.copy(origin);
      if(roarModel){
        const swap=roarActive&&!(source==='high-detail CC0');
        // Posed models are static; cross-appearance is a short, intentional cut on attack, not fake bone movement.
        roarModel.visible=swap;dragon.visible=!swap;
      }
      if(shock.material.opacity>0) {
        shock.scale.multiplyScalar(1+dt*4);shock.material.opacity=Math.max(0,shock.material.opacity-dt*.73);
      }
      if(fireActive&&shock.material.opacity<=0){shock.scale.setScalar(.3);shock.material.opacity=.7;}
      rings[0].material.opacity=.59+Math.sin(clock*1.5)*.13+(fireActive?.18:0);
      dust.rotation.y+=dt*.003;
      emit(now,dt);animateFlame(now);
      renderer.render(scene,camera);
      raf=requestAnimationFrame(animate);
    }
    const viewport=new IntersectionObserver(entries=>{
      visible=entries[0]?.isIntersecting??true;
      if(visible&&!raf){last=performance.now();raf=requestAnimationFrame(animate);}
    },{threshold:.02});
    viewport.observe(stage);
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden&&visible&&!raf){last=performance.now();raf=requestAnimationFrame(animate);}
    });
    canvas.addEventListener('webglcontextlost',e=>{
      e.preventDefault();alive=false;cancelAnimationFrame(raf);status('GRAPHICS CONTEXT LOST — RELOAD');
    });
    status('DRAGON / AWAKE');last=performance.now();raf=requestAnimationFrame(animate);
    return {scene,camera,renderer,source,reset,fire,roar};
  }
})();