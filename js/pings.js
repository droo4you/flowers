/* A photo-inspired Pinguicula bowl. Original procedural SVG artwork.
   The fixed seed keeps the same little garden across replays and themes. */
(() => {
  'use strict';
  const svg = document.getElementById('garden');
  const NS = 'http://www.w3.org/2000/svg';
  let seed = 142;
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
    svg.querySelectorAll(':scope > :not(title):not(desc)').forEach(el => el.remove());
    const defs = node('defs', {});
    const bowl = node('linearGradient', {id:'ceramic',x1:0,y1:0,x2:0,y2:1}, defs);
    node('stop', {offset:'0%', 'stop-color':'var(--rim)'}, bowl);
    node('stop', {offset:'100%', 'stop-color':'var(--bowl)'}, bowl);
    const palette = [ ['#c2d68f','#7d9b62','#d09caa'], ['#d6c799','#b3be86','#c47e94'], ['#dbb1b7','#aeb77f','#b77290'] ];
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
    function rosette(x,y,size,color,offset,pointy=false) {
      const group=node('g',{transform:`translate(${x} ${y}) scale(1 .79)`});
      wash('ellipse',{cx:0,cy:9,rx:size*.93,ry:size*.84,fill:'#111d15','fill-opacity':'.23'},offset,group);
      [1,.71,.43].forEach((scale,layer) => {
        const count=layer===2?5:8;
        for(let i=0;i<count;i++) {
          const angle=i*360/count+layer*25+random()*8;
          const len=size*scale*(.88+random()*.18), w=len*(pointy?.25:.39);
          const leaf=node('g',{transform:`rotate(${angle})`},group);
          const tip=pointy?`Q${w*.6} ${-len*.8} 0 ${-len}`:`Q${w*.93} ${-len*1.13} 0 ${-len}`;
          const d=`M0 5 C${w*.4} -4 ${w*1.25} ${-len*.45} ${w} ${-len*.74} ${tip} Q${-w*.95} ${-len*1.03} ${-w} ${-len*.7} C${-w*1.1} ${-len*.37} ${-w*.35} -2 0 5Z`;
          const delay=offset+layer*.55+i*.075;
          wash('path',{d,fill:`url(#leaf${color})`},delay+.2,leaf);
          line(d,color===2?'#a46b85':'#879467',1,delay,leaf);
          line(`M0 0 Q${-w*.2} ${-len*.5} 0 ${-len*.88}`,'#ecedcd',.65,delay+.45,leaf);
          for(let j=0;j<12;j++) {
            const yy=-len*(.25+random()*.55),xx=(random()-.5)*w;
            wash('circle',{cx:xx,cy:yy,r:.6+random()*.6,fill:'#fff9e6','fill-opacity':'.6'},delay+.6,leaf);
          }
        }
      });
    }
    rosette(315,397,91,0,1.7,true);
    rosette(664,418,100,1,2.1);
    rosette(468,482,58,2,2.5);
    rosette(360,524,79,0,2.8);
    rosette(618,527,61,0,3.1);
    // A fine arched stalk and an asymmetric five-petalled purple bloom.
    line('M664 417 C661 349 737 267 701 217 Q690 200 679 211','#778762',2.1,4.4);
    const flower=node('g',{transform:'translate(678 210) rotate(-14)'});
    const petals=['M0 0 C-26 -4 -41 -22 -27 -34 C-14 -46 -2 -23 0 0Z','M0 0 C-7 -21 1 -48 19 -39 C39 -29 24 -8 0 0Z','M0 0 C17 -13 42 -7 36 10 C31 26 10 15 0 0Z','M0 0 C19 16 18 41 1 41 C-18 41 -14 14 0 0Z','M0 0 C-15 18 -40 22 -40 4 C-39 -13 -16 -10 0 0Z'];
    petals.forEach((d,i)=>{wash('path',{d,fill:i<2?'#b587c7':'#a77ec0'},5+i*.12,flower);line(d,'#805b97',1,4.8+i*.12,flower);});
    wash('ellipse',{cx:0,cy:1,rx:6,ry:4,fill:'#eff0bd'},5.7,flower);
    line('M187 475 C251 615 743 632 815 478','#ffffff',2,1.3);
  }
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
  document.getElementById('replay').addEventListener('click',build);
  build();
})();
