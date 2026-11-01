(() => {
'use strict';
const catalog=window.PING_CATALOG,$=id=>document.getElementById(id);let selected=0,seed=71;
function text(tag,value,parent){const n=document.createElement(tag);n.textContent=value;parent.append(n);return n;}
function link(label,url,parent){const a=text('a',label,parent);a.href=url;return a;}
function draw(){const p=catalog[selected];window.PingRenderer.render($('drawing'),p.recipe,seed);$('drawing').setAttribute('aria-label',p.name+' illustrative growing-rosette drawing');$('seed').textContent='Individual seed '+seed+' · leaf study only';}
function choose(index){selected=index;const p=catalog[index];document.querySelectorAll('#chooser button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));$('kind').textContent=p.kind+' / '+p.stage;$('plant-name').textContent=p.name;$('nickname').textContent=p.nickname+' · '+p.nicknameType;$('photo').replaceChildren();$('credit').replaceChildren();
 if(p.photo){const img=document.createElement('img');img.alt=p.name+' — independent photograph by '+p.photo.author;img.src=p.photo.url;img.referrerPolicy='no-referrer';img.addEventListener('error',()=>{img.remove();text('p','Photo could not load here. Open the credited source below.',$('photo'));},{once:true});$('photo').append(img);link('Photo: '+p.photo.author,p.photo.page,$('credit'));text('span',' · ',$('credit'));link(p.photo.license,p.photo.licenseUrl,$('credit'));text('span',' · Displayed uncropped. '+p.photo.note,$('credit'));}
 else {const msg=text('div',p.photoNote,$('photo'));msg.className='placeholder';link('Open original photos',p.sources[0].url,$('credit'));}
 $('fact').textContent=p.fact;$('facts').replaceChildren();for(const [label,key] of [['Origin / breeder','origin'],['Parentage','parentage'],['Leaves','leaf'],['Flowers','flower'],['Seasonal forms','season'],['Cultivation availability','availability'],['Wild conservation','conservation']]){text('dt',label,$('facts'));text('dd',p[key],$('facts'));}
 $('boundaries').textContent=p.lock;$('confidence').textContent=p.confidence+' · reviewed '+p.reviewed;$('render-note').textContent=p.renderNote;$('sources').replaceChildren();p.sources.forEach(s=>link(s.label,s.url,$('sources')));draw();history.replaceState(null,'','#'+p.id);
}
catalog.forEach((p,i)=>{const b=document.createElement('button');text('span',p.kind,b);text('b',p.name.replace('Pinguicula ',''),b);b.addEventListener('click',()=>choose(i));$('chooser').append(b);});
$('reroll').addEventListener('click',()=>{seed+=19;draw();});$('replay').addEventListener('click',draw);
const initial=catalog.findIndex(p=>p.id===location.hash.slice(1));choose(initial<0?0:initial);
})();
