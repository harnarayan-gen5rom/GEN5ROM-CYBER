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
    scene.fog = new T.FogExp2(0x09070e, 0.025);
    const camera = new T.PerspectiveCamera(39, 1, 0.1, 120);
    let renderer;
    try { renderer = new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
    catch(error) { throw new Error('This browser could not create WebGL.'); }
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
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
    const membrane = new T.MeshStandardMaterial({color:0x461829,metalness:.18,roughness:.62,side:T.DoubleSide});
    const membraneAlt = new T.MeshStandardMaterial({color:0x7b2e32,emissive:0x5e2119,emissiveIntensity:.4,metalness:.35,roughness:.44,side:T.DoubleSide,transparent:true,opacity:.89});
    const edgeMat = new T.MeshBasicMaterial({color:0xff7545,side:T.DoubleSide,transparent:true,opacity:.68});
    const sphereGeo = new T.SphereGeometry(1,32,24);
    const icoGeo = new T.SphereGeometry(1,20,14);
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
    // V2 — organic sculpt: continuous smooth forms, curved horn tubes and bat wings.
    // Swept mesh surfaces interpolate thickness along Catmull-Rom curves (not straight rods).
    const obsidian = new T.MeshPhysicalMaterial({color:0x181b24,metalness:.57,roughness:.38,clearcoat:.45,clearcoatRoughness:.24});
    const scaleMat = new T.MeshPhysicalMaterial({color:0x30202b,metalness:.42,roughness:.55,clearcoat:.23});
    const crimson = new T.MeshPhysicalMaterial({color:0x77282f,metalness:.48,roughness:.41,clearcoat:.35});
    const bellyMat = new T.MeshStandardMaterial({color:0x9b6556,metalness:.43,roughness:.54});
    const hornMat = new T.MeshStandardMaterial({color:0xb7a9a2,metalness:.5,roughness:.41});
    const eyeMat = new T.MeshBasicMaterial({color:0xffbd58});
    const irisMat = new T.MeshBasicMaterial({color:0x110d12});
    const wingSkin = new T.MeshPhysicalMaterial({color:0x652a39,metalness:.16,roughness:.59,side:T.DoubleSide,transparent:false,clearcoat:.18,vertexColors:true});
    const wingBone = new T.MeshStandardMaterial({color:0x241921,metalness:.48,roughness:.41});
    const mouthMat = new T.MeshStandardMaterial({color:0x260c17,metalness:.12,roughness:.83});
    const sclera=new T.MeshBasicMaterial({color:0xff9a3a});
    const detail=(p,m,x,y,z,sx,sy,sz,h)=>ball(p,m,[x,y,z],[sx,sy,sz],h);
    const V=p=>new T.Vector3(...p);
    const interpolate=(arr,t)=>{
      const x=Math.min(arr.length-1.00001,Math.max(0,t*(arr.length-1))),k=Math.floor(x);
      return arr[k]*(1-(x-k))+arr[k+1]*(x-k);
    };
    const sweep=(parent,material,coords,widths,hot,steps=32,sides=12)=>{
      const curve=new T.CatmullRomCurve3(coords.map(V),false,'centripetal',.5);
      const frames=curve.computeFrenetFrames(steps,false);
      const vertices=[],uv=[],ind=[];
      for(let i=0;i<=steps;i++){
        const u=i/steps,at=curve.getPointAt(u),r=Math.max(.002,interpolate(widths,u));
        for(let j=0;j<=sides;j++){
          const v=j/sides*Math.PI*2;
          const pt=at.clone().addScaledVector(frames.normals[i],Math.cos(v)*r)
            .addScaledVector(frames.binormals[i],Math.sin(v)*r);
          vertices.push(pt.x,pt.y,pt.z);uv.push(u,j/sides);
          if(i<steps&&j<sides){const k=i*(sides+1)+j;ind.push(k,k+sides+1,k+1,k+1,k+sides+1,k+sides+2);}
        }
      }
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(ind);geo.computeVertexNormals();
      const mesh=new T.Mesh(geo,material);parent.add(mesh);
      if(hot){mesh.userData.hotspot=hot;meshes.push(mesh);}
      return mesh;
    };
    const organic=(p,m,pos,scale,rotation,hot)=>{
      const obj=ball(p,m,pos,scale,hot);
      if(rotation)obj.rotation.set(...rotation);
      return obj;
    };
    // Single low-slung musculature transitions seamlessly into a high arched neck.
    organic(dragon,obsidian,[0,1.52,-.2],[.78,.67,1.48],[-.11,0,0],'chest');
    organic(dragon,crimson,[0,1.46,.65],[.67,.56,.67],[-.26,0,0],'chest');
    organic(dragon,scaleMat,[0,1.72,-.58],[.74,.51,.9],[0,0,0],'back');
    sweep(dragon,obsidian,[[0,1.65,.35],[0,2.05,.79],[0,2.48,1.10],[0,2.92,1.43],[0,3.10,1.75]],[.48,.45,.39,.35,.33],'head',45,18);
    // Front throat has overlapping ventral scutes wrapping the entire S-shaped neck.
    for(let i=0;i<10;i++){
      const a=i/9;
      const z=.75+a*.96,y=1.93+a*1.15;
      organic(dragon,i%2?bellyMat:crimson,[0,y-.08,z+.28],[.355-a*.065,.09,.21],[.25+a*.10,0,0],'head');
    }
    // Belly scutes: physically layered curved surfaces with soft highlights.
    for(let i=0;i<9;i++){
      const z=1.05-i*.26;
      organic(dragon,i%2?bellyMat:crimson,[0,1.05+.11*Math.sin(i*.38),z],[.56,.115,.215],[-.19,0,0],'chest');
    }
    // Reactor is embedded into armored breast rather than suspended in empty space.
    const reactor=new T.Group();reactor.position.set(0,1.72,1.10);dragon.add(reactor);
    const front=new T.Mesh(new T.TorusGeometry(.22,.038,12,48),ember);reactor.add(front);
    const innerRing=new T.Mesh(new T.TorusGeometry(.14,.016,10,48),hornMat);reactor.add(innerRing);
    detail(reactor,blue,0,0,.009,.12,.12,.065,'chest');
    for(let s of [-1,1]){
      organic(dragon,scaleMat,[s*.59,1.67,.36],[.29,.49,.64],[0,s*.14,s*.13],'chest');
      for(let i=0;i<7;i++){
        const z=1.06-i*.23,y=1.78+Math.sin(i*.38)*.18;
        organic(dragon,i%2?obsidian:scaleMat,[s*(.58+Math.sin(i*.46)*.09),y,z],[.23,.115,.23],[0,s*.2,s*.11],'back');
      }
    }
    // Crest plated ridge and the individual organic curving dorsal spines.
    for(let i=0;i<11;i++){
      const z=1.33-i*.255,baseY=2.28-Math.max(i-4,0)*.075;
      sweep(dragon,hornMat,[[0,baseY-.12,z],[0,baseY+.11,z-.04],[0,baseY+.21-(i*.012),z-.23]],[.115,.087,.003],'back',9,8);
    }
    // Skull group: shaped upper cranial mass, long tapered snout and expressive side eyes.
    const head=new T.Group();head.position.set(0,3.06,1.74);dragon.add(head);
    organic(head,obsidian,[0,.05,0],[.48,.39,.61],[.08,0,0],'head');
    organic(head,scaleMat,[0,.19,-.15],[.45,.35,.54],[-.04,0,0],'head');
    organic(head,crimson,[0,-.12,.42],[.35,.225,.72],[-.12,0,0],'head');
    organic(head,obsidian,[0,-.18,.75],[.29,.19,.58],[-.13,0,0],'head');
    organic(head,crimson,[0,-.06,1.07],[.27,.16,.27],[-.08,0,0],'head');
    // Functional jaw hinge, lower gums, teeth and glowing molten throat.
    const jaw=new T.Group();jaw.position.set(0,-.255,.18);head.add(jaw);
    organic(jaw,mouthMat,[0,-.105,.65],[.285,.13,.83],[-.05,0,0],'head');
    organic(jaw,crimson,[0,-.175,.65],[.30,.15,.82],[-.05,0,0],'head');
    organic(jaw,ember,[0,-.026,.71],[.16,.015,.42],null,'head');
    for(let s of [-1,1]){
      organic(head,scaleMat,[s*.34,-.035,.20],[.23,.24,.30],[0,s*.28,0],'head');
      organic(head,obsidian,[s*.23,.17,.22],[.225,.16,.31],[0,s*.12,-s*.16],'head');
      organic(head,eyeMat,[s*.31,.145,.33],[.15,.091,.055],[-.18,s*.42,-s*.27],'head');
      organic(head,irisMat,[s*.323,.141,.385],[.040,.079,.012],[-.18,s*.42,-s*.2],'head');
      sweep(head,hornMat,[[s*.28,.37,-.22],[s*.48,.72,-.43],[s*.58,1.05,-.70],[s*.62,1.10,-.98]],[.16,.136,.065,.002],'head',22,12);
      sweep(head,scaleMat,[[s*.46,.15,-.13],[s*.59,.30,-.38],[s*.58,.44,-.60]],[.13,.075,.001],'head',14,10);
      sweep(head,crimson,[[s*.31,-.28,.36],[s*.33,-.25,.72],[s*.28,-.24,1.12]],[.08,.055,.018],'head',16,8);
      // Serrated teeth are paired above and below the mouth.
      for(let j=0;j<5;j++){
        const z=.54+j*.195;
        spike(head,hornMat,[s*(.22-j*.013),-.26,z],[.055,.145-j*.01,.055],[Math.PI,0,0],'head');
        spike(jaw,hornMat,[s*(.21-j*.013),-.09,z],[.049,.11,.049],[0,0,0],'head');
      }
      detail(head,gunmetal,s*.21,-.032,1.267,.048,.027,.053,'head');
    }
    // Scaled muscular hips, haunches, distinct weight-bearing digitigrade feet.
    const legs=[];
    for(const z of [-.97,.67]) for(const s of [-1,1]){
      const leg=new T.Group();leg.position.set(s*.60,1.29,z);dragon.add(leg);
      organic(leg,obsidian,[0,-.08,.04],[.33,.37,.36],null,'leg');
      organic(leg,z>0?crimson:scaleMat,[s*.16,-.27,.07],[.40,.48,.37],[.12,0,-s*.25],'leg');
      sweep(leg,obsidian,[[s*.13,-.31,.04],[s*.23,-.55,-.15],[s*.17,-.89,.18],[s*.22,-1.02,.46]],[.24,.20,.16,.17],'leg',25,12);
      organic(leg,scaleMat,[s*.20,-1.075,.52],[.33,.145,.45],null,'leg');
      for(let j=-1;j<=1;j++){
        sweep(leg,hornMat,[[s*.20+j*.20,-1.09,.75],[s*.20+j*.21,-1.12,1.00],[s*.20+j*.22,-1.13,1.20]],[.09,.07,.001],'leg',12,8);
      }
      for(let j=0;j<4;j++)organic(leg,j%2?scaleMat:crimson,[s*.15,-.52-j*.12,.02],[.19,.092,.19],null,'leg');
      legs.push(leg);
    }
    // An articulated tapering muscular tail, spline segment dynamics and smooth scales.
    const tailLinks=[];const tailRoot=new T.Group();
    tailRoot.position.set(0,1.51,-1.42);dragon.add(tailRoot);
    let prev=tailRoot;
    for(let i=0;i<11;i++){
      const part=new T.Group();part.position.set(0,i===0?0:Math.sin(i*.35)*.035,i===0?0:-.36);
      prev.add(part);
      const k=1-i/11;
      sweep(part,obsidian,[[0,0,.10],[0,.015,-.18],[0,.025,-.46]],[.28*k,.25*k,.19*k],'tail',10,10);
      organic(part,i%2?scaleMat:crimson,[0,.12*k,-.22],[.245*k,.12*k,.24],null,'tail');
      if(i<9)sweep(part,hornMat,[[0,.19*k,-.24],[0,.33*k,-.32],[0,.39*k,-.45]],[.08*k,.04*k,.001],'tail',9,7);
      tailLinks.push(part);prev=part;
    }
    sweep(prev,hornMat,[[0,.02,-.43],[0,.03,-.7],[0,.01,-1.04]],[.14,.085,.002],'tail',20,10);
    // Curved skeletal wing architecture with non-planar scalloped membranes.
    const wingHinges=[];
    function makeWing(sign){
      const hinge=new T.Group();hinge.position.set(sign*.53,2.05,-.49);dragon.add(hinge);
      const raw=[
        [.40,.16,0], // root
        [1.00,1.17,-.20],
        [1.80,2.28,-.53],
        [2.72,2.88,-1.00],
        [3.76,2.80,-1.40],
        [3.37,1.18,-1.15],
        [2.83,-.01,-.81],
        [2.00,-.69,-.38],
        [1.00,-.71,.06]
      ];
      const rootP=V([0,0,0]), ends=raw.slice(1).map(p=>new T.Vector3(p[0]*sign,p[1],p[2]));
      const pos=[],colors=[],indices=[];
      const radial=18,across=8;
      // Adjacent digit bones form a scalloped membrane with surface curvature.
      for(let bay=0;bay<ends.length-1;bay++){
        const A=ends[bay],B=ends[bay+1],offset=pos.length/3;
        for(let u=0;u<=radial;u++){
          const t=u/radial;
          for(let j=0;j<=across;j++){
            const v=j/across;const tip=A.clone().lerp(B,v);
            const p=rootP.clone().lerp(tip,t);
            p.y-=Math.sin(Math.PI*v)*.37*Math.pow(t,1.55);
            p.z-=Math.sin(Math.PI*t)*(.28+.05*bay);
            p.z+=Math.sin(Math.PI*v)*.08*t;
            pos.push(p.x,p.y,p.z);
            const shade=1-.18*Math.sin(Math.PI*v)-.11*t;
            colors.push(shade,shade*(.75+.06*bay),shade*(.81+.025*bay));
            if(u<radial&&j<across){
              const n=offset+u*(across+1)+j;
              indices.push(n,n+across+1,n+1,n+1,n+across+1,n+across+2);
            }
          }
        }
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
      g.setIndex(indices);g.computeVertexNormals();
      const wing=new T.Mesh(g,wingSkin);hinge.add(wing);wing.userData.hotspot='wing';meshes.push(wing);
      ends.forEach((end,i)=>{
        if(i>6)return;
        const mid=end.clone().multiplyScalar(.46);
        mid.y+=.16+Math.sin(i*.32)*.06;mid.z-=.15;
        sweep(hinge,wingBone,[[0,0,0],mid.toArray(),end.toArray()],[.105,.071,.012],'wing',27,11);
        if(i<6){
          const p=end.clone().multiplyScalar(.85);
          detail(hinge,scaleMat,p.x,p.y,p.z,.11,.10,.11,'wing');
        }
      });
      // Distinct thick leading edge: creates dramatic silhouetted wing arms.
      sweep(hinge,obsidian,[[0,0,0],[.62*sign,.65,-.09],[1.49*sign,1.90,-.38],[2.72*sign,2.88,-1.0],[3.76*sign,2.8,-1.4]],[.19,.17,.14,.10,.006],'wing',54,14);
      wingHinges.push({hinge,sign});
    }
    makeWing(-1);makeWing(1);
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
    const key=new T.DirectionalLight(0xffdbc4,3.8);key.position.set(4,8,6);scene.add(key);
    const rim=new T.PointLight(0xff542d,90,17,1.6);rim.position.set(-3,4,-1);scene.add(rim);
    const edge=new T.PointLight(0x34a9e1,38,13,1.8);edge.position.set(4,3,-5);scene.add(edge);
    const flash=new T.PointLight(0xffa444,0,8,2);flash.position.set(0,2.5,3.1);dragon.add(flash);
    // Instanced visual particles in a genuine 3D point cloud.
    const CAP=420, positions=new Float32Array(CAP*3),rgb=new Float32Array(CAP*3);
    const motion=Array.from({length:CAP},()=>({age:0,v:new T.Vector3(),life:1}));
    for(let i=0;i<CAP;i++){positions[i*3+1]=-1000;rgb.set([1,.35,.05],i*3);}
    const particles=new T.BufferGeometry();
    particles.setAttribute('position',new T.BufferAttribute(positions,3));
    particles.setAttribute('color',new T.BufferAttribute(rgb,3));
    const pmat=new T.PointsMaterial({size:.29,map:glowTex,vertexColors:true,transparent:true,opacity:.96,blending:T.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
    const flame=new T.Points(particles,pmat);flame.frustumCulled=false;scene.add(flame);
    const sparkCount=95,sparkPos=new Float32Array(sparkCount*3);
    for(let i=0;i<sparkCount;i++){sparkPos.set([(Math.random()-.5)*13,Math.random()*7,(Math.random()-.5)*12],i*3);}
    const sparkg=new T.BufferGeometry();sparkg.setAttribute('position',new T.BufferAttribute(sparkPos,3));
    const sparks=new T.Points(sparkg,new T.PointsMaterial({color:0xff945a,map:glowTex,transparent:true,opacity:.6,blending:T.AdditiveBlending,size:.085,depthWrite:false}));scene.add(sparks);
    const shock = new T.Mesh(new T.TorusGeometry(1,.06,8,90),new T.MeshBasicMaterial({color:0xff7c42,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));
    shock.rotation.x=Math.PI/2;shock.position.y=.06;scene.add(shock);
    const ray=new T.Raycaster(),pointer=new T.Vector2(0,0);
    const target=new T.Vector3(),tempQ=new T.Quaternion();
    let yaw=.40,pitch=.18,zoom=11.9,targetYaw=yaw,targetPitch=pitch,targetZoom=zoom;
    let overPart='',drag=false,pressed=null,lastX=0,lastY=0,still=0;
    let fireUntil=0,roarUntil=0,rage=false,shockAge=99,wingDeployUntil=0,mode='SENTINEL / IDLE';
    let ptIndex=0,spawnAccum=0,t0=performance.now(),last=t0;
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    const smooth=(a,b,s,dt)=>a+(b-a)*(1-Math.exp(-s*dt));
    function mood(text){if(status)status.textContent=text;}
    function mouthLocation(){
      dragon.updateWorldMatrix(true,true);
      return head.localToWorld(new T.Vector3(0,-.29,1.39));
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
      rage=false;fireUntil=0;roarUntil=0;shockAge=99;targetYaw=.40;targetPitch=.18;targetZoom=11.9;
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
      e.preventDefault();targetZoom=clamp(targetZoom+e.deltaY*.006,8.5,17);
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
      camera.position.set(Math.sin(yaw)*Math.cos(pitch)*zoom*factor,2.75+Math.sin(pitch)*zoom*.65,Math.cos(yaw)*Math.cos(pitch)*zoom*factor);
      camera.lookAt(0,2.02,.15);
      const fireActive=now<fireUntil,roaring=now<roarUntil;
      const energy=fireActive?1:overPart==='head'?.45:.06;
      const pulse=1+Math.sin(t*4)*.07;
      reactor.rotation.z+=dt*(fireActive?4:0.7);
      aura.material.opacity=.33+energy*.35;
      aura.scale.setScalar(1.9*pulse+(fireActive?.65:0));
      flash.intensity=fireActive?12+Math.sin(t*38)*10:0;
      const active=fireActive?1:roaring?.65:0;
      jaw.rotation.x=smooth(jaw.rotation.x,active*.62,10,dt);
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
        const follow=Math.sin(t*.9-i*.30)*(.025+i*.013)*(overPart==='tail'?1.8:1);
        tailLinks[i].rotation.y=smooth(tailLinks[i].rotation.y,follow,4.7,dt);
        tailLinks[i].rotation.x=smooth(tailLinks[i].rotation.x,Math.sin(t*.8-i*.33)*.025,4,dt);
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