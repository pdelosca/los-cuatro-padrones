
// ═══════════════ LÍNEA DE TIEMPO (una sola fuente de verdad) ═══════════════
const SCENES=[];
const wc=lines=>lines.join(' ').split(/\s+/).filter(Boolean).length;
const dwell=c=>Math.max(3.0,0.9+wc(c.l)/2.8);       // regla de lectura
const LINT=[];
function fitSize(lines,size,maxW,font,minS,id){
  const m=mk(10,10).getContext('2d');let s=size;
  const widest=ss=>{m.font=font(ss);return Math.max(...lines.map(l=>m.measureText(l.replace(/\*/g,'')).width))};
  while(s>minS&&widest(s)>maxW)s-=2;
  if(widest(s)>maxW)LINT.push(`[${id}] texto más ancho que ${maxW}px: «${lines.join(' / ')}»`);
  return s;
}
const CAPFONT={pc:s=>`700 ${s}px Fraunces`,tek:s=>`italic 500 ${s}px "Cormorant Garamond"`,lp:s=>`500 ${s}px Caveat`};
const CAPMAX={pc:924-8,tek:W-150,lp:W-150},CAPMIN={pc:40,tek:54,lp:50};
function buildTimeline(){
  let T=0;LINT.length=0;
  for(const sc of SCENES){
    let tt=sc.lead??1.8;sc.C=[];
    for(const c of sc.caps){
      const a=c.at??tt,d=c.hold??dwell(c);
      const fs=fitSize(c.l,c.s||48,CAPMAX[sc.style],CAPFONT[sc.style],CAPMIN[sc.style],sc.id);
      sc.C.push({a,b:a+d,l:c.l,s:fs,words:wc(c.l),need:Math.max(3.0,0.9+wc(c.l)/2.8)});
      if(d+1e-6<Math.max(3.0,0.9+wc(c.l)/2.8))LINT.push(`[${sc.id}] leyenda corta: ${d.toFixed(1)} s para ${wc(c.l)} palabras`);
      tt=a+d+0.12;
    }
    sc.dur=Math.max(sc.min||0,tt+(sc.tail??1.2));sc.a=T;sc.b=T+sc.dur;T+=sc.dur;
  }
  DUR=T;
}
const sceneAtT=T=>SCENES.find(a=>T>=a.a&&T<a.b)||SCENES[SCENES.length-1];

// ═══════════════ ESTILO 8 · TEK ÇİZGI: íconos y escena ═══════════════
function iconWheel(){const cx=540,cy=HY-300,r=210,p=Pn().M(300,HY);
  p.S([[380,HY-4],[470,HY-30],[540,cy+r]],14);CIR(p,cx,cy,r,Math.PI/2);
  p.L(cx,cy,24);p.L(cx-r,cy,24);p.L(cx,cy,24);p.L(cx+r,cy,24);p.A(cx,cy,r,r,0,Math.PI/2,16);
  p.S([[600,HY-24],[700,HY-4],[780,HY]],14);return tekBuild(300,780,p)}
function iconMojon(){const p=Pn().M(300,HY);
  p.S([[360,HY-2],[430,HY]],10);p.L(450,HY-420,40);p.L(540,HY-560,20);p.L(630,HY-420,20);p.L(650,HY,40);
  p.L(600,HY-40,10);[[500,HY-130],[590,HY-190],[490,HY-250],[590,HY-310],[520,HY-370]].forEach(([x,y])=>p.L(x,y,10));p.L(540,HY-30,16);
  p.S([[600,HY-4],[700,HY]],10);return tekBuild(300,700,p)}
function iconHouse(){const l=380,r=700,t=HY-300,p=Pn().M(220,HY);
  p.S([[300,HY-2],[l,HY]],12);p.L(l,t,36);p.L(540,HY-520,24);p.L(r,t,24);p.L(r,HY,36);p.L(l,HY,40);
  p.L(l,t,10);p.L(r,t,40);p.L(r,HY,10);p.L(600,HY,16);p.L(600,HY-170,24);p.L(480,HY-170,16);p.L(480,HY,24);p.L(540,HY,10);
  p.S([[620,HY-4],[760,HY]],12);return tekBuild(220,760,p)}
function iconRings(){const rr=135,ax=465,bx=615,cy=HY-300,dy=Math.sqrt(rr*rr-75*75),p=Pn().M(300,HY);
  const aa=Math.atan2(dy,540-ax),ab=Math.atan2(dy,540-bx);
  p.S([[380,HY-8],[470,HY-60],[540,cy+dy]],12);CIR(p,ax,cy,rr,aa);p.A(bx,cy,rr,rr,ab,ab+Math.PI*2);
  p.S([[560,cy+dy+40],[640,HY-30],[760,HY]],12);return tekBuild(300,760,p)}
function iconCandle(){const p=Pn().M(300,HY);
  p.S([[420,HY-4],[480,HY]],10);p.L(480,HY-400,40);p.L(600,HY-400,20);p.L(600,HY,40);p.L(600,HY-400,40);p.L(540,HY-400,12);p.L(540,HY-450,10);
  p.S([[510,HY-500],[520,HY-570],[540,HY-620],[562,HY-570],[572,HY-500],[540,HY-450]],12);p.L(540,HY-400,12);p.L(540,HY-5,50);
  p.S([[640,HY-4],[740,HY]],10);return tekBuild(300,740,p)}
const TICONS={};
function tekIcons(){TICONS.wheel=iconWheel();TICONS.mojon=iconMojon();TICONS.house=iconHouse();TICONS.rings=iconRings();TICONS.candle=iconCandle();
  TICONS.wid=new Float32Array(TN);for(let i=0;i<TN;i++){const u=i/TN;TICONS.wid[i]=6.2+1.3*Math.sin(u*37)*Math.sin(u*11.3+1)+.6*Math.sin(u*91)}}
function strokePts(x,pts,i0,i1){
  x.lineCap='round';x.lineJoin='round';x.strokeStyle=TINK;
  for(let a=Math.max(0,Math.floor(i0));a<i1-1;a+=6){const b=Math.min(Math.ceil(i1)-1,a+6);x.lineWidth=TICONS.wid[a];x.beginPath();x.moveTo(pts[a][0],pts[a][1]);for(let k=a+1;k<=b;k++)x.lineTo(pts[k][0],pts[k][1]);x.stroke()}
}
function morph(A,B,tau,stag=.55){const out=new Array(TN);for(let i=0;i<TN;i++){const u=eIO(tau*(1+stag)-stag*(i/TN));out[i]=[lerp(A.p[i][0],B.p[i][0],u),lerp(A.p[i][1],B.p[i][1],u)]}return out}
const PAPERT=mk();
function buildTekPaper(){const c=PAPERT.getContext('2d');c.fillStyle=TPAPER;c.fillRect(0,0,W,H);
  const g=c.createRadialGradient(540,900,300,540,960,1500);g.addColorStop(0,'rgba(255,252,245,.22)');g.addColorStop(1,'rgba(120,100,70,.14)');c.fillStyle=g;c.fillRect(0,0,W,H);
  const id=c.getImageData(0,0,W,H),d=id.data,r=rng(7);for(let k=0;k<d.length;k+=4){const n=(r()-.5)*10;d[k]+=n;d[k+1]+=n;d[k+2]+=n}c.putImageData(id,0,0)}
// leyendas manuscritas de la línea, con *acento*
function tekCaps(x,t,C){
  C.forEach(c=>{
    const al=blockAlpha(t,c.a,c.b);if(al<=0)return;
    x.save();x.globalAlpha=al;x.translate(0,(1-eO(seg(t,c.a,c.a+.6)))*14);
    const size=c.s,lh=size*1.2,y0=Math.min(1250,1690-(c.l.length-1)*lh);
    c.l.forEach((s,i)=>{
      const parts=s.split(/(\*[^*]*\*)/).filter(Boolean),font=`italic 500 ${size}px "Cormorant Garamond"`;x.font=font;
      const clean=pp=>pp.replace(/\*/g,''),w=parts.reduce((m,pp)=>m+x.measureText(clean(pp)).width,0);let px=W/2-w/2;
      parts.forEach(pp=>{const acc=pp.startsWith('*'),tx=clean(pp);txt(x,tx,px,y0+i*lh,font,acc?TACC:TINK);px+=x.measureText(tx).width})});
    x.restore()});
}
// escena de línea. cfg.icons y cfg.morphAt (índices de leyenda donde cambia de ícono)
function tekDraw(x,t,dur,sc){
  x.drawImage(PAPERT,0,0);
  const cfg=sc.cfg,ic=cfg.icons.map(k=>TICONS[k]),n=ic.length,C=sc.C;
  const in0=cfg.in0??.5,in1=cfg.in1??3.6,out1=dur-.5,out0=out1-2.0;
  const m=(cfg.morphAt||[]).map(i=>[C[i].a-.5,C[i].a+.9]);
  let pts=ic[0].p,i0=0,i1=TN,head=null,tail=null;
  if(n===1||t<m[0][0]){const u=eIO(seg(t,in0,in1));i1=u*(TN-1)+1;if(u>0&&u<1)head=pts[Math.min(TN-1,Math.floor(i1))];if(u<=0)i1=0;if(n>1)pts=ic[0].p;else if(t>=out0){i1=TN}}
  else{let k=0;while(k<n-2&&t>=m[k+1][0])k++;pts=morph(ic[k],ic[k+1],seg(t,m[k][0],m[k][1]))}
  if(t>=out0){const u=eIO(seg(t,out0,out1));i0=u*(TN-1);if(u<1)tail=pts[Math.floor(i0)]}
  if(i1-i0>1)strokePts(x,pts,i0,i1);
  const dot=p=>{x.save();x.fillStyle=TACC;x.beginPath();x.arc(p[0],p[1],8.5,0,7);x.fill();x.restore()};
  if(head)dot(head);if(tail&&i0>1)dot(tail);
  tekCaps(x,t,C);
  const fo=seg(t,dur-.4,dur);if(fo>0){x.globalAlpha=fo*.35;x.drawImage(PAPERT,0,0);x.globalAlpha=1}
}
