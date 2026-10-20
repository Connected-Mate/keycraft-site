import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const canvas=document.querySelector('#keyboard-scene'),stage=document.querySelector('#hero-stage');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const isReduced=()=>reducedMotion.matches||new URLSearchParams(location.search).has('reduce-motion');
let renderer;
try{if(new URLSearchParams(location.search).has('no3d'))throw new Error('Fallback requested');renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{fallback()}
function fallback(){document.body.classList.add('no-webgl');document.querySelector('.object-caption').textContent='Pearl, Glass, Atelier. Trois matières à découvrir.';document.querySelectorAll('[data-material]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.hero-fallback').src=`./assets/themes/${b.dataset.material}.webp`;document.querySelector('.hero-fallback').alt=`Aperçu du clavier ${b.textContent}`;document.querySelectorAll('[data-material]').forEach(button=>{const selected=button===b;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected))})}));}
if(renderer){
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.88;renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFShadowMap;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,17.5);
  const pmrem=new THREE.PMREMGenerator(renderer),environment=new RoomEnvironment();scene.environment=pmrem.fromScene(environment,.045).texture;scene.environmentIntensity=.6;environment.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf8fbff,0x7184a4,.75));
  const light=new THREE.DirectionalLight(0xffffff,2.8);light.position.set(-5,9,12);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-10;light.shadow.camera.right=10;light.shadow.camera.top=8;light.shadow.camera.bottom=-8;light.shadow.normalBias=.08;light.shadow.bias=-.0003;scene.add(light);
  const rim=new THREE.DirectionalLight(0xaccaff,1.25);rim.position.set(8,-3,5);scene.add(rim);
  const keyboard=new THREE.Group();scene.add(keyboard);keyboard.rotation.set(-.39,-.22,-.16);
  const bodyMaterial=new THREE.MeshStandardMaterial({color:0xcbd3de,metalness:.6,roughness:.34});
  const tray=new THREE.Mesh(new RoundedBoxGeometry(11.3,6.65,.58,6,.4),bodyMaterial);tray.castShadow=true;tray.receiveShadow=true;keyboard.add(tray);
  const underside=new THREE.Mesh(new RoundedBoxGeometry(11.19,6.56,.24,5,.35),new THREE.MeshStandardMaterial({color:0x244d91,metalness:.55,roughness:.25}));underside.position.z=-.29;keyboard.add(underside);
  const inset=new THREE.Mesh(new RoundedBoxGeometry(10.96,6.27,.16,4,.28),new THREE.MeshStandardMaterial({color:0xb6c0ce,metalness:.3,roughness:.5}));inset.position.z=.25;inset.receiveShadow=true;keyboard.add(inset);
  const keyMaterial=new THREE.MeshPhysicalMaterial({color:0xf5f4ec,roughness:.34,metalness:.06,clearcoat:1,clearcoatRoughness:.15});
  const blueMaterial=new THREE.MeshPhysicalMaterial({color:0x2265d6,roughness:.18,metalness:.15,clearcoat:1,clearcoatRoughness:.1});
  const darkMaterial=new THREE.MeshStandardMaterial({color:0x252f3b,roughness:.26,metalness:.25});
  const socketMaterial=new THREE.MeshStandardMaterial({color:0x8794a8,roughness:.6,metalness:.1});
  const keys=[],labelMaterials=[];
  function textTexture(text,color){const c=document.createElement('canvas');c.width=256;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.font=`500 ${text.length>3?56:100}px "Figtree Variable", sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,128,135);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
  function addKey(label,x,y,w,accent=false){
    const group=new THREE.Group();group.position.set(x,y,.48);group.userData={homeZ:.48,label,pressedUntil:0};keyboard.add(group);
    const socket=new THREE.Mesh(new RoundedBoxGeometry(w+.045,1.1,.09,3,.16),socketMaterial);socket.position.set(x,y,.335);keyboard.add(socket);
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,1.06,.46,5,.18),accent?blueMaterial:keyMaterial);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    const material=new THREE.MeshBasicMaterial({map:textTexture(label,accent?'#f6f8fc':'#354355'),transparent:true,depthWrite:false});labelMaterials.push({material,label,accent});
    const glyph=new THREE.Mesh(new THREE.PlaneGeometry(.69,.69),material);glyph.position.z=.236;group.add(glyph);keys.push({group,mesh,accent,w});return group;
  }
  const dx=1.055;Array.from('qwertyuiop').forEach((letter,i)=>addKey(letter,(i-4.5)*dx,1.57,.94));
  Array.from('asdfghjkl').forEach((letter,i)=>addKey(letter,(i-4)*dx,.30,.94));
  addKey('⇧',-4.65,-.97,1.22);Array.from('zxcvbnm').forEach((letter,i)=>addKey(letter,(i-3)*dx,-.97,.94));addKey('⌫',4.65,-.97,1.22);
  addKey('123',-4.17,-2.24,1.85);addKey('',-.36,-2.24,5.5);addKey('↵',4.13,-2.24,1.94,true);
  // Suggestion text belongs to the object, not to an HTML overlay.
  ['“hello”','hello','hey'].forEach((word,i)=>{const material=new THREE.MeshBasicMaterial({map:textTexture(word,'#354355'),transparent:true,depthWrite:false});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.58),material);mesh.position.set((i-1)*3.3,2.7,.36);keyboard.add(mesh)});
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=256;const context=shadowCanvas.getContext('2d');const gradient=context.createRadialGradient(128,128,8,128,128,120);gradient.addColorStop(0,'rgba(21,42,80,.32)');gradient.addColorStop(.5,'rgba(21,42,80,.16)');gradient.addColorStop(1,'rgba(21,42,80,0)');context.fillStyle=gradient;context.fillRect(0,0,256,256);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(14,8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.position.set(0,-1.8,-1.5);scene.add(shadow);
  let visible=true,paused=isReduced(),frame=0,lastFrame=0,targetX=-.39,targetY=-.22,targetZ=-.16,drag=null,press=null;
  const pauseButton=document.querySelector('#pause-model');
  function updatePause(){pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Reprendre le mouvement 3D':'Mettre le mouvement 3D en pause');pauseButton.textContent=paused?'▷':'Ⅱ'}updatePause();
  function resize(){const rect=stage.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();camera.position.z=camera.aspect<1.2?20:17.5;draw(performance.now(),true)}
  new ResizeObserver(resize).observe(stage);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function hit(event){const r=canvas.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(keys.map(k=>k.mesh),false)[0]?.object.parent}
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,tx:targetX,ty:targetY,moved:false};press=hit(e);if(press){press.position.z=.32;press.userData.pressedUntil=Infinity}draw(performance.now(),true)});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)>5){drag.moved=true;targetY=THREE.MathUtils.clamp(drag.ty+dx*.003,-.9,.9);targetX=THREE.MathUtils.clamp(drag.tx+dy*.0015,-.7,.35);if(paused||isReduced()){keyboard.rotation.x=targetX;keyboard.rotation.y=targetY}draw(performance.now(),true)}});
  function release(){if(press){press.userData.pressedUntil=0;press.position.z=.48;press=null}drag=null;draw(performance.now(),true)}
  window.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);window.addEventListener('blur',release);
  document.querySelector('#rotate-model').addEventListener('click',()=>{targetY=targetY>.15?-.30:.35;targetX=targetX<-.3?-.1:-.42;if(paused||isReduced()){keyboard.rotation.x=targetX;keyboard.rotation.y=targetY}draw(performance.now(),true)});
  pauseButton.addEventListener('click',()=>{paused=!paused;updatePause();requestFrame()});
  reducedMotion.addEventListener('change',event=>{paused=event.matches;updatePause();requestFrame()});
  function setMaterial(name){
    const glass=name==='glass',atelier=name==='atelier';keyMaterial.color.set(glass?0xe0e8ee:atelier?0xdfe2e2:0xf5f4ec);keyMaterial.roughness=glass?.08:atelier?.3:.25;keyMaterial.metalness=atelier?.38:.04;keyMaterial.transmission=glass?.42:0;keyMaterial.thickness=glass?.4:0;keyMaterial.ior=1.45;keyMaterial.needsUpdate=true;blueMaterial.color.set(glass?0xd8e5f1:atelier?0xea4d13:0x2265d6);bodyMaterial.color.set(glass?0xe1e6eb:atelier?0x8f979d:0xcbd3de);inset.material.color.set(atelier?0x27313a:glass?0xc8d1dd:0xb6c0ce);socketMaterial.color.set(atelier?0x1c2835:0x8794a8);
    keys.forEach(({mesh,accent},i)=>{mesh.material=atelier&&i===0?darkMaterial:accent?blueMaterial:keyMaterial});
    document.querySelectorAll('[data-material]').forEach(button=>{const selected=button.dataset.material===name;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected))});
    draw(performance.now(),true);
  }
  document.querySelectorAll('[data-material]').forEach(b=>b.addEventListener('click',()=>setMaterial(b.dataset.material)));
  function draw(time,force=false){
    if(!visible||document.hidden)return;
    if(!force&&time-lastFrame<33)return;
    lastFrame=time;
    if(!paused&&!isReduced()){keyboard.rotation.x+=(targetX+Math.sin(time*.00045)*.035-keyboard.rotation.x)*.08;keyboard.rotation.y+=(targetY+Math.cos(time*.00032)*.04-keyboard.rotation.y)*.08;keyboard.rotation.z+=(targetZ-keyboard.rotation.z)*.08;keyboard.position.y=Math.sin(time*.0006)*.07}
    renderer.render(scene,camera);
  }
  function requestFrame(){if(frame||!visible||document.hidden)return;frame=requestAnimationFrame(t=>{frame=0;draw(t);if(!paused&&!isReduced())requestFrame()})}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){draw(performance.now(),true);requestFrame()}else if(frame){cancelAnimationFrame(frame);frame=0}},{rootMargin:'60px'}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;release()}else{draw(performance.now(),true);requestFrame()}});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stage.classList.remove('is-ready');document.body.classList.add('no-webgl');if(frame)cancelAnimationFrame(frame);frame=0;visible=false;fallback()},{once:true});
  document.fonts.ready.then(()=>{for(const {material,label,accent} of labelMaterials){material.map.dispose();material.map=textTexture(label,accent?'#f6f8fc':'#354355');material.needsUpdate=true}draw(performance.now(),true)});
  resize();stage.classList.add('is-ready');requestFrame();
}
