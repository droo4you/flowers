/* Photo-derived visual recipes; numerical ranges are artistic, not botanical measurements. */
(() => {
'use strict';
const recipes=[
 {id:'mim',name:'Mad Madam Mim',status:'Named hybrid · label supplied',description:'Broad violet spoons flare down around a pale growing center. Curled rims and gaps between leaves give the rosette its open, sculptural shape.',count:11,width:.53,tip:.23,curl:.17,wave:0,colors:['#c4d19a','#b997b5','#73516f'],rim:'#d3b7d1',point:false},
 {id:'pink',name:'Pink ruffled study',status:'Identity unconfirmed · photo study',description:'Wide salmon leaves lift into uneven folds. A narrow golden lip catches the light above the peach-pink surface.',count:12,width:.62,tip:.38,curl:.23,wave:.15,colors:['#d9c48b','#ec9b9c','#bd6977'],rim:'#f4cc9e',point:false},
 {id:'star',name:'Chartreuse star study',status:'Identity unconfirmed · photo study',description:'Pointed leaves spread into a star, with raised boat-like edges and tightly folded new growth at the center.',count:10,width:.44,tip:.06,curl:.27,wave:.05,colors:['#eff0a0','#cfdc68','#8fa944'],rim:'#f8eab0',point:true}
];
let seed=41;
const ns='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));parent.append(n);return n;}
function rng(s){return ()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};}
function render(svg,p,s){svg.replaceChildren();const random=rng(s),defs=el('defs',{},svg);
const shadow=el('radialGradient',{id:p.id+'shadow'},defs);el('stop',{offset:0,'stop-color':'#48503c','stop-opacity':'.23'},shadow);el('stop',{offset:1,'stop-color':'#48503c','stop-opacity':0},shadow);
el('ellipse',{cx:200,cy:244,rx:157,ry:100,fill:`url(#${p.id}shadow)`},svg);
const plant=el('g',{transform:'translate(200 209) scale(1 .82)'},svg);
const count=p.count+(p.countJitter?Math.floor(random()*(p.countJitter*2+1))-p.countJitter:0);
for(let i=0;i<count;i++){
 const age=i/(count-1),len=(140-(p.shape==='linear'?65:110)*age)*(p.displayScale||1)*( .94+random()*.12),w=len*p.width;
 const angle=i*137.508+(random()-.5)*14;
 const g=el('g',{transform:`rotate(${angle})`},plant),id=p.id+i;
 const gradient=el('radialGradient',{id,cx:'.5',cy:'.93',r:'.96'},defs);
 p.colors.forEach((c,j)=>el('stop',{offset:[0,.62,1][j],'stop-color':c},gradient));
 // Asymmetric broad blades; cubic shoulders control roundness and pointed tips.
 const t=p.tip,wig=p.wave*w,tipX=(random()-.5)*w*.3;
 const rounded=`M0 8 C${w*.20} ${-len*.12} ${w*1.15} ${-len*.40} ${w} ${-len*.72} C${w+wig} ${-len*.98} ${w*t} ${-len*1.07} ${tipX} ${-len} C${-w*t} ${-len*1.04} ${-w-wig} ${-len*.98} ${-w*.94} ${-len*.68} C${-w*.85} ${-len*.32} ${-w*.18} ${-len*.08} 0 8Z`;
 const pointed=p.point ? `M0 8 C${w*.25} ${-len*.15} ${w*1.22} ${-len*.46} ${w*.86} ${-len*.65} Q${w*.32} ${-len*.72} ${tipX} ${-len*1.17} Q${-w*.28} ${-len*.77} ${-w*.87} ${-len*.64} C${-w*1.12} ${-len*.48} ${-w*.22} ${-len*.12} 0 8Z` : rounded;
 const bend=(p.shape==='strap'?len*.12:0);
 const slender=`M0 4 C${w*.5} ${-len*.2} ${w+bend} ${-len*.72} ${bend} ${-len} C${-w+bend} ${-len*.78} ${-w*.65} ${-len*.2} 0 4Z`;
 const d=['linear','strap'].includes(p.shape)?slender:pointed;
 const clip=el('clipPath',{id:id+'clip'},defs);el('path',{d},clip);
 const delay=i*.105;
 const painted=el('g',{class:'paint',style:`animation-delay:${delay+1.05}s`},g);
 el('path',{d,fill:'#3a2335',opacity:'.16',transform:'translate(1 4)'},painted);
 el('path',{d,fill:`url(#${id})`},painted);
 // Folded margins: a second surface with a bright crest and a shaded inner crease.
 const c=p.curl;
 const roundFold=`M0 8 C${w*.2} ${-len*.12} ${w*1.15} ${-len*.40} ${w} ${-len*.72} C${w+wig} ${-len*.98} ${w*t} ${-len*1.07} ${tipX} ${-len} C${w*(t+c)} ${-len*.91} ${w*(1-c)} ${-len*.85} ${w*(1-c)} ${-len*.64} C${w*.82} ${-len*.35} ${w*.13} ${-len*.05} 0 8Z`;
 const fold=p.point ? `M0 8 C${w*.25} ${-len*.15} ${w*1.22} ${-len*.46} ${w*.86} ${-len*.65} Q${w*.32} ${-len*.72} ${tipX} ${-len*1.17} Q${w*.12} ${-len*.74} ${w*.60} ${-len*.56} C${w*.70} ${-len*.40} ${w*.12} ${-len*.10} 0 8Z` : roundFold;
 if(!['linear','strap'].includes(p.shape))el('path',{'clip-path':`url(#${id}clip)`,d:fold,fill:p.rim,opacity:'.77'},painted);
 el('path',{d:`M0 5 C${w*.14} ${-len*.10} ${w*.84} ${-len*.35} ${w*(1-c)} ${-len*.64} Q${w*(1-c)} ${-len*.85} ${tipX} ${-len}`,'clip-path':`url(#${id}clip)`,fill:'none',stroke:p.colors[2],'stroke-width':1.3,opacity:'.55'},painted);
 el('path',{d,fill:'none',stroke:p.rim,'stroke-width':p.shape==='linear'?.6:1.2},painted);
 const dew=el('g',{'clip-path':`url(#${id}clip)`},painted);
 for(let j=0;j<(p.dots??100);j++)el('circle',{cx:(random()*2-1)*w,cy:-random()*len,r:.3+random()*.55,fill:random()>.3?'#fffce1':p.colors[2],opacity:.15+random()*.3},dew);
 el('path',{d,fill:'none',stroke:p.colors[2],'stroke-width':.8,pathLength:1,class:'outline',style:`animation-delay:${delay}s`},g);
}
}
window.PingRenderer={render};
const container=document.getElementById('studies');
if(!container)return;
recipes.forEach((p,i)=>{const card=document.createElement('article');const small=document.createElement('small');small.textContent=p.status;card.append(small);const svg=el('svg',{viewBox:'0 0 400 400',role:'img','aria-label':p.name+' generated leaf study'},card);const h=document.createElement('h2');h.textContent=p.name;card.append(h);const text=document.createElement('p');text.textContent=p.description;card.append(text);const replay=document.createElement('button');replay.textContent='Watch grow';replay.addEventListener('click',()=>render(svg,p,seed+i));card.append(replay);container.append(card);p.svg=svg;render(svg,p,seed+i);});
function drawAll(){recipes.forEach((p,i)=>render(p.svg,p,seed+i));}
document.getElementById('replay').addEventListener('click',drawAll);
document.getElementById('vary').addEventListener('click',()=>{seed+=19;drawAll();});
})();
