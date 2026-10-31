/* A photo-inspired Pinguicula bowl. Original procedural SVG artwork.
   Tap soil to plant, then tap a rosette to bloom. No notes or external assets. */
(() => {
  'use strict';
  const svg = document.getElementById('garden');
  const NS = 'http://www.w3.org/2000/svg';
  let seed = 142;
  let plants = [];
  let plantLayer;
  const status = document.getElementById('garden-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const say = text => { status.textContent = text; };
  const random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
  function node(tag, attributes, parent = svg) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
    parent.appendChild(el); return el;
  }
  function wash(tag, attributes, delay, parent = svg) {
    return node(tag, { ...attributes, class:'wash', style:`--delay:${delay}s` }, parent);
  }
  function line(d, stroke, width, delay, parent = svg) {
    return node('path', { d, fill:'none', stroke, 'stroke-width':width, 'stroke-linecap':'round', 'stroke-linejoin':'round', pathLength:1, class:'draw', style:`--delay:${delay}s` }, parent);
  }
  function build() {
    seed = 142;
    plants = [];
    svg.querySelectorAll(':scope > :not(title):not(desc)').forEach(el => el.remove());
    const defs = node('defs', {});
    const bowl = node('linearGradient', {id:'ceramic',x1:0,y1:0,x2:0,y2:1}, defs);
    node('stop', {offset:'0%', 'stop-color':'var(--rim)'}, bowl);
    node('stop', {offset:'100%', 'stop-color':'var(--bowl)'}, bowl);
    const palette = [ ['#c2d68f','#7d9b62','#d09caa'], ['#d6c799','#b3be86','#c47e94'], ['#dbb1b7','#aeb77f','#b77290'], ['#bfa1cc','#9e8aaf','#835f9c'], ['#b9d995','#79a471','#96b77c'] ];
    palette.forEach((colors, i) => {
      const g=node('radialGradient',{id:`leaf${i}`,cx:'.44',cy:'.8',r:'.85'},defs);
      node('stop',{offset:'0','stop-color':colors[1]},g);
      node('stop',{offset:'.66','stop-color':colors[0]},g);
      node('stop',{offset:'1','stop-color':colors[2]},g);
    });
    wash('ellipse',{cx:500,cy:644,rx:330,ry:32,fill:'var(--shadow)','fill-opacity':'.08'},0);
    const body='M155 433 C155 703 845 703 845 433 C800 547 200 547 155 433Z';
    wash('path',{d:body,fill:'url(#ceramic)'},.2);
    line(body,'#7d887b',1.4,.1);
    wash('ellipse',{cx:500,cy:430,rx:345,ry:179,fill:'var(--rim)'},.35);
    wash('ellipse',{cx:500,cy:427,rx:330,ry:164,fill:'var(--soil)'},.5);
    line('M170 427 A330 164 0 1 0 830 427 A330 164 0 1 0 170 427','#8b9686',1,.6);
    for(let i=0;i<1600;i++) {
      const x=175+random()*650,y=265+random()*325;
      if(((x-500)/322)**2+((y-427)/155)**2>1) continue;
      const r=2+random()*3;
      wash('ellipse',{cx:x,cy:y,rx:r,ry:r*.72,fill:random()>.5?'#454c42':'#242d29',stroke:'#697160','stroke-width':'.35'},.5+random()*.7);
    }
    const rock='M383 410 C362 377 377 323 401 288 L435 210 Q447 178 467 198 L496 230 Q516 231 529 252 L561 286 Q577 312 588 351 L595 404 Q562 454 468 455 Q415 449 383 410Z';
    wash('path',{d:rock,fill:'var(--rock)',stroke:'#737c6b','stroke-width':1.4},1);
    line(rock,'#89917b',1.2,.8);
    for(let i=0;i<220;i++) {
      const x=400+random()*170,y=250+random()*180;
      if(y<300 && (x<430||x>520))continue;
      line(`M${x} ${y}l${random()*5-2} ${random()*6}`,random()>.5?'#303d35':'#88907c',.6,1.1+random()*.8);
    }
    ['M449 220l-22 91 14 39-18 63','M505 255l-19 49 19 37-11 72','M552 312l-20 35 29 51'].forEach(d=>line(d,'#303e36',1,1.3));
    // Small loose threads of moss, with room for the rosettes.
    for(let i=0;i<95;i++) {
      const a=random()*Math.PI*2,x=500+Math.cos(a)*(130+random()*150),y=435+Math.sin(a)*(65+random()*75);
      line(`M${x} ${y}q-5 -8 2 -13m-2 8l7 -4m-7 1l-6 -4`,'#8b9564',.85,1.5+random());
    }
    line('M187 475 C251 615 743 632 815 478','#ffffff',2,1.3);
    plantLayer=node('g', {id:'plants'});
    seed = Date.now() >>> 0;
    say('Tap the dark soil to plant your first ping.');
  }
  function rosette(x,y,size,color,offset,pointy=false,countBase=8) {
      const group=node('g',{transform:`translate(${x} ${y}) scale(1 .79)`,class:'ping',role:'button',tabindex:0,'aria-label':`Ping ${plants.length+1}: grow a flower`},plantLayer);
      node('ellipse',{cx:0,cy:0,rx:size,ry:size,fill:'transparent',class:'hit-area'},group);
      wash('ellipse',{cx:0,cy:9,rx:size*.93,ry:size*.84,fill:'#111d15','fill-opacity':'.23'},offset,group);
      [1,.71,.43].forEach((scale,layer) => {
        const count=layer===2?5:countBase;
        for(let i=0;i<count;i++) {
          const angle=i*360/count+layer*25+random()*8;
          const len=size*scale*(.88+random()*.18), w=len*(pointy?.25:.39);
          const leaf=node('g',{transform:`rotate(${angle})`},group);
          const tip=pointy?`Q${w*.6} ${-len*.8} 0 ${-len}`:`Q${w*.93} ${-len*1.13} 0 ${-len}`;
          const d=`M0 5 C${w*.4} -4 ${w*1.25} ${-len*.45} ${w} ${-len*.74} ${tip} Q${-w*.95} ${-len*1.03} ${-w} ${-len*.7} C${-w*1.1} ${-len*.37} ${-w*.35} -2 0 5Z`;
          const delay=offset+layer*.55+i*.075;
          wash('path',{d,fill:`url(#leaf${color})`},delay+1.25,leaf);
          line(d,color===2?'#a46b85':'#879467',1,delay,leaf);
          line(`M0 0 Q${-w*.2} ${-len*.5} 0 ${-len*.88}`,'#ecedcd',.65,delay+.45,leaf);
          for(let j=0;j<12;j++) {
            const yy=-len*(.25+random()*.55),xx=(random()-.5)*w;
            wash('circle',{cx:xx,cy:yy,r:.6+random()*.6,fill:'#fff9e6','fill-opacity':'.6'},delay+1.7,leaf);
          }
        }
      });
      return group;
    }
  function bloom(plant) {
    if(plant.bloomed) {
      if(!reduced.matches) {
        plant.group.getAnimations().forEach(a=>a.cancel());
        plant.group.animate([{opacity:1},{opacity:.65},{opacity:1}],{duration:650});
      }
      say('Already in bloom. Find another little patch of soil.');
      return;
    }
    plant.bloomed=true;
    plant.group.setAttribute('aria-label', `Ping ${plant.id}: flowering. Tap to shimmer`);
    const delay = reduced.matches ? 0 : Math.max(0,(plant.readyAt-performance.now())/1000);
    const {x,y,size}=plant;
    const height=105+random()*65, dx=(random()-.5)*65;
    const topY=Math.max(205,y-height),topX=x+dx;
    const flowers=node('g',{'pointer-events':'none'},plantLayer);
    line(`M${x} ${y} C${x-12} ${y-70} ${topX+35} ${topY+25} ${topX} ${topY}`,'#778762',2,delay,flowers);
    const flower=node('g',{transform:`translate(${topX} ${topY}) rotate(${random()*30-15}) scale(${.45+size/180})`},flowers);
    const colors=['#ad80c7','#d99ab9','#d4c2e5','#e7d9d4','#9c80c8'];
    const color=colors[Math.floor(random()*colors.length)];
    const petals=['M0 0 C-26 -4 -41 -22 -27 -34 C-14 -46 -2 -23 0 0Z','M0 0 C-7 -21 1 -48 19 -39 C39 -29 24 -8 0 0Z','M0 0 C17 -13 42 -7 36 10 C31 26 10 15 0 0Z','M0 0 C19 16 18 41 1 41 C-18 41 -14 14 0 0Z','M0 0 C-15 18 -40 22 -40 4 C-39 -13 -16 -10 0 0Z'];
    petals.forEach((d,i)=>{line(d,'#805b97',1,delay+1.5+i*.12,flower);wash('path',{d,fill:color},delay+2.65+i*.12,flower);});
    wash('ellipse',{cx:0,cy:1,rx:6,ry:4,fill:'#eff0bd'},delay+3.3,flower);
    say('A little bloom is on its way.');
  }
  function fits(x,y,size) {
    // Reserve the rock and keep the entire mature rosette inside the soil.
    if(x+size>375 && x-size<600 && y-size*.79<455) return false;
    for(let i=0;i<12;i++) {
      const a=i*Math.PI/6;
      if(((x+Math.cos(a)*size-500)/316)**2+((y+Math.sin(a)*size*.79-427)/150)**2>1)return false;
    }
    return plants.every(p=>Math.hypot(x-p.x,(y-p.y)/.79)>size+p.size+7);
  }
  function plantAt(x,y) {
    if(plants.length>=12) { say('Your bowl is full. Tap a ping to make it bloom.');return false; }
    let size=40+random()*19;
    while(size>=30 && !fits(x,y,size))size-=4;
    if(size<30){say('Give it a little room: try an open patch away from the rock and rim.');return false;}
    const color=Math.floor(random()*5), pointy=random()>.6, count=6+Math.floor(random()*4);
    const group=rosette(x,y,size,color,0,pointy,count);
    const plant={x,y,size,group,id:plants.length+1,bloomed:false,readyAt:performance.now()+4400};
    plants.push(plant);
    group.addEventListener('click',event=>{event.stopPropagation();bloom(plant);});
    group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();bloom(plant);}});
    say('A new ping! Tap it to grow a flower, or tap more soil to keep planting.');
    return true;
  }
  svg.addEventListener('click',event=>{
    const matrix=svg.getScreenCTM();
    if(!matrix)return;
    const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    if(((point.x-500)/330)**2+((point.y-427)/164)**2>1)return;
    plantAt(point.x,point.y);
  });
  document.getElementById('plant').addEventListener('click',()=>{
    // Keyboard alternative: choose a free patch without requiring pointer precision.
    for(let i=0;i<400;i++) {
      const x=200+random()*600,y=300+random()*260;
      if(fits(x,y,34)) {if(plantAt(x,y))plants[plants.length-1].group.focus();return;}
    }
    say('This bowl is getting cozy. Tap a ping to make it bloom.');
  });
  const light=document.getElementById('light');
  function theme(dark) {
    document.documentElement.dataset.theme=dark?'dark':'light';
    light.setAttribute('aria-pressed',String(dark));
    light.setAttribute('aria-label',dark?'Switch to day mode':'Switch to night mode');
    light.innerHTML=dark?'☀ <span>day</span>':'☾ <span>night</span>';
    document.querySelector('meta[name="theme-color"]').content=dark?'#202b28':'#f5f2e9';
  }
  try { theme(localStorage.getItem('pings:theme')==='dark'); } catch { theme(false); }
  light.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';theme(dark);try{localStorage.setItem('pings:theme',dark?'dark':'light');}catch{}});
  document.getElementById('replay').addEventListener('click',()=>{build();document.getElementById('replay').hidden=true;});
  document.getElementById('reset').addEventListener('click',()=>{document.getElementById('replay').hidden=false;say('Start over clears this bowl. Tap “clear bowl” to confirm.');});
  build();
})();
