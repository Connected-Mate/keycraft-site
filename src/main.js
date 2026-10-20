import './style.css';
import { site } from './site-config.js';
if(new URLSearchParams(location.search).has('reduce-motion'))document.documentElement.dataset.reduceMotion='true';
const themes = [
  ['pearl','Pearl','#e8e9e4','Des touches ivoire sculptées, une lumière douce. Le plaisir simple d’un bel objet.','Un toucher sculpté, tout en relief.','Faire une vague'],
  ['meadow','Meadow','#668443','Un jardin miniature où les fleurs violettes se mêlent au trèfle, à la mousse et aux gouttes de rosée.','Dans l’app : vent floral et perspective au mouvement de l’iPhone.','Réveiller le jardin'],
  ['play','Play','#e5c9da','Des touches qui n’ont pas tout à fait envie de rester sages. Une composition douce et décalée.','Dans l’app : secouez pour rassembler, disperser et recomposer les touches.','Remixer'],
  ['aqua','Aqua','#88c6ed','Le bleu des premiers ordinateurs, des reflets bombés et un plateau argenté à fines rayures.','Ripple : une onde qui traverse le verre bleu.','Lancer une onde'],
  ['glass','Glass','#d6dfe8','Des capsules de verre, des contours subtils et une lumière qui glisse sur chaque lettre.','Flow : un mouvement de lumière liquide sur les touches.','Faire couler la lumière'],
  ['aquarium','Aquarium','#537e83','Un poisson rouge, des plantes, du sable et des bulles. Une petite échappée sous la surface.','Dans l’app : un véritable aquarium 3D animé à explorer.','Faire des bulles'],
  ['atelier','Atelier','#e86c32','De l’aluminium, des touches sculptées et juste ce qu’il faut d’orange. L’esprit d’un bel outil.','Dans l’app : une molette pour régler la couleur lumineuse.','Allumer l’atelier'],
  ['bubble','Bubble','#9bd044','Un clin d’œil aux premiers messages : des bulles vertes et argentées, rondes et brillantes.','Squeeze : les bulles se serrent puis reprennent leur place.','Presser les bulles'],
  ['relic','Relic','#a86651','Ivoire patiné, rouge, vert et cobalt. Les couleurs d’un objet que l’on aurait gardé longtemps.','Recast : une vague retourne les touches et recompose les couleurs.','Recomposer'],
  ['aero','Aero','#b4d6ef','Un ciel bleu, des touches blanches dessinées au trait et des accents roses et citron vert.','Orbit : des anneaux holographiques parcourent le clavier.','Mettre en orbite'],
  ['pulse','Pulse','#a6e52f','Du noir profond, du cobalt et une touche de vert électrique. Une collection sous tension.','Dans l’app : la frappe charge une jauge, Pulse libère une onde.','Envoyer une impulsion'],
  ['vault','Vault','#8d9192','De l’acier brossé, des touches encastrées et des détails gravés. Précis jusque dans le toucher.','Unlock : les volets métalliques se ferment puis s’ouvrent.','Déverrouiller'],
  ['mosaic','Mosaic','#e6ba36','Du crème, du noir, une grande touche jaune et des motifs qui donnent le sourire.','Print : un passage d’impression révèle une nouvelle composition.','Imprimer un motif'],
];
const strip=document.querySelector('.theme-strip');
const field=document.querySelector('#demo-input');
let activeTheme='pearl', shifted=false, symbols=false, signatureTimer;
if(strip){
  themes.forEach((theme,i)=>{const b=document.createElement('button');b.className='theme-chip';b.dataset.theme=theme[0];b.setAttribute('aria-pressed',String(i===0));const swatch=document.createElement('i');swatch.style.setProperty('--swatch',theme[2]);swatch.setAttribute('aria-hidden','true');b.append(swatch,document.createTextNode(theme[1]));b.addEventListener('click',()=>selectTheme(theme[0]));strip.append(b)});
  renderKeys();
  document.querySelector('#clear-demo').addEventListener('click',()=>{field.value='';field.focus()});
  document.querySelector('#signature-action').addEventListener('click',runSignature);
  document.querySelector('#toggle-case').addEventListener('click',()=>typeKey('Shift'));
  document.querySelectorAll('[data-explore]').forEach(button=>button.addEventListener('click',()=>{selectTheme(button.dataset.explore);document.querySelector('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
  field.addEventListener('keydown',event=>{const key=event.key.length===1?event.key.toLowerCase():event.key;document.querySelectorAll('.demo-key').forEach(button=>{if(button.dataset.key===key)button.classList.add('pressed')})});
  const clearPresses=()=>document.querySelectorAll('.demo-key.pressed').forEach(button=>button.classList.remove('pressed'));
  field.addEventListener('keyup',clearPresses);field.addEventListener('blur',clearPresses);
  window.addEventListener('blur',clearPresses);
}
function selectTheme(id){
  const index=themes.findIndex(t=>t[0]===id);if(index<0)return;const t=themes[index];activeTheme=id;
  document.querySelector('.theme-showcase').dataset.theme=id;
  document.querySelector('#theme-number').textContent=`${String(index+1).padStart(2,'0')} / 13`;
  document.querySelector('#theme-name').textContent=t[1];document.querySelector('#theme-description').textContent=t[3];document.querySelector('#theme-signature').textContent=t[4];
  document.querySelector('#signature-action').replaceChildren(document.createTextNode(t[5]+' '));const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');document.querySelector('#signature-action').append(arrow);
  document.querySelector('#theme-preview').src=`./assets/themes/${id}.webp`;
  document.querySelector('#demo-keys').setAttribute('aria-label',`Clavier de démonstration ${t[1]}`);
  document.querySelectorAll('.theme-chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===id)));
  document.querySelector('.demo-keyboard').classList.remove('signature-running');
}
function renderKeys(){
  const container=document.querySelector('#demo-keys');container.replaceChildren();document.querySelector('#toggle-case').setAttribute('aria-pressed',String(shifted));document.querySelector('#toggle-case').setAttribute('aria-label',shifted?'Désactiver les majuscules':'Activer les majuscules');
  const rows=symbols?[Array.from('1234567890'),Array.from('@#€&*-+/='),[...Array.from('.,?!:;_'),'Backspace'],['Mode',' ','Enter']]:[Array.from('qwertyuiop'),Array.from('asdfghjkl'),[...Array.from('zxcvbnm'),'Backspace'],['Mode',' ','Enter']];
  let keyIndex=0;
  rows.forEach(keys=>{const row=document.createElement('div');row.className='key-row';keys.forEach(key=>{const b=document.createElement('button');b.type='button';b.className='demo-key';b.dataset.key=key;b.style.setProperty('--i',String(keyIndex++));const label=key==='Shift'?'⇧':key==='Backspace'?'⌫':key==='Enter'?'↵':key==='Mode'?(symbols?'ABC':'123'):key===' '?'':shifted?key.toUpperCase():key;b.textContent=label;b.setAttribute('aria-label',key===' '?'Espace':key==='Shift'?'Majuscule':key==='Backspace'?'Effacer une lettre':key==='Enter'?'Retour à la ligne':key==='Mode'?(symbols?'Afficher les lettres':'Afficher les chiffres'):label);if(key==='Shift')b.setAttribute('aria-pressed',String(shifted));
  b.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();b.classList.add('pressed')});b.addEventListener('pointerleave',()=>b.classList.remove('pressed'));b.addEventListener('pointerup',()=>b.classList.remove('pressed'));b.addEventListener('pointercancel',()=>b.classList.remove('pressed'));b.addEventListener('click',()=>typeKey(key));row.append(b)});container.append(row)});
}
function typeKey(key){
  if(key==='Shift'){shifted=!shifted;renderKeys();return}
  if(key==='Mode'){symbols=!symbols;renderKeys();return}
  let start=field.selectionStart,end=field.selectionEnd;
  if(key==='Backspace'){
    if(start===end&&start>0){const prefix=field.value.slice(0,start);const segments=typeof Intl.Segmenter==='function'?Array.from(new Intl.Segmenter('fr',{granularity:'grapheme'}).segment(prefix),s=>s.segment):Array.from(prefix);start-=segments.at(-1)?.length||0}
    field.setRangeText('',start,end,'end');
  } else {const insertion=key==='Enter'?'\n':shifted?key.toUpperCase():key;if(field.value.length-(end-start)+insertion.length>400)return;field.setRangeText(insertion,start,end,'end');if(shifted){shifted=false;renderKeys()}}
  field.dispatchEvent(new Event('input',{bubbles:true}));
}
function runSignature(){
  const keyboard=document.querySelector('.demo-keyboard');clearTimeout(signatureTimer);keyboard.classList.remove('signature-running');requestAnimationFrame(()=>{keyboard.classList.add('signature-running');signatureTimer=setTimeout(()=>keyboard.classList.remove('signature-running'),1800)});
}
if(site.appStoreURL){document.querySelectorAll('[data-store-link]').forEach(a=>{a.href=site.appStoreURL;a.textContent='Télécharger sur l’App Store'});document.querySelectorAll('[data-store-status]').forEach(el=>el.textContent=`Disponible sur iPhone · iOS ${site.minimumIOS} ou version ultérieure`)}
if(document.querySelector('#keyboard-scene'))import('./scene.js').catch(()=>{
  document.body.classList.add('no-webgl');
  document.querySelector('.object-caption').textContent='Pearl, Glass, Atelier. Trois matières à découvrir.';
  document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{
    const preview=document.querySelector('.hero-fallback');preview.src=`./assets/themes/${button.dataset.material}.webp`;preview.alt=`Aperçu du clavier ${button.textContent}`;
    document.querySelectorAll('[data-material]').forEach(other=>{const selected=other===button;other.classList.toggle('selected',selected);other.setAttribute('aria-pressed',String(selected))});
  }));
});
