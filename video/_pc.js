// ═══════════════════ ESTILO 9 · KÂĞIT KESİK (papel cortado) ═══════════════════
const PCT=mk(768,768);let PCPAT=null;
function buildPCTex(){const c=PCT.getContext('2d'),r=rng(7);c.lineCap='round';
  for(let i=0;i<2200;i++){const x=r()*768,y=r()*768,a=r()*Math.PI*2,l=3+r()*9,dark=r()<.5;c.strokeStyle=dark?`rgba(0,0,0,${.03+r()*.05})`:`rgba(255,255,255,${.035+r()*.05})`;c.lineWidth=.5+r()*.6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a+.6)*l*.5,y+Math.sin(a+.6)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}
  for(let i=0;i<5000;i++){c.fillStyle=r()<.5?'rgba(0,0,0,.035)':'rgba(255,255,255,.05)';c.fillRect(r()*768,r()*768,1.2,1.2)}
  PCPAT=ctx.createPattern(PCT,'repeat')}
// una pieza de papel: sombra + color + borde de luz + fibra
function piece(x,pathFn,color,{shadow=1}={}){
  x.save();if(shadow){x.shadowColor='rgba(25,12,30,.4)';x.shadowBlur=18;x.shadowOffsetY=10;x.shadowOffsetX=3}
  x.beginPath();pathFn(x);x.fillStyle=color;x.fill();x.restore();
  x.save();x.beginPath();pathFn(x);x.clip();x.strokeStyle=shade(color,1.22);x.lineWidth=6;x.beginPath();pathFn(x);x.stroke();
  x.fillStyle=PCPAT;x.fillRect(-200,-200,W+400,H+400);x.restore();
}
function hillPath(y0,amp,seed,off=0,zig=false,step=70){return x=>{const r=rng(seed);x.moveTo(-60,H+80);let first=true;
  for(let px=-120;px<=W+160;px+=step){const k=Math.round((px+off)/step),rr=rng(seed*7+((k%97)+97)%97)();
    const y=y0-(zig?(Math.abs(Math.sin((px+off)/step*1.7+seed))*amp+rr*amp*.3):(Math.sin((px+off)/(step*3.1)+seed)*amp+Math.sin((px+off)/(step*1.3)+seed*2)*amp*.4));
    x.lineTo(px,y)}x.lineTo(W+160,H+80);x.closePath()}}
const rect=(x0,y0,w,h)=>x=>{x.rect(x0,y0,w,h)};
const rrect=(x0,y0,w,h,r)=>x=>{x.roundRect(x0,y0,w,h,r)};
const circ=(cx,cy,r)=>x=>{x.moveTo(cx+r,cy);x.arc(cx,cy,r,0,7)};
const poly=(pts)=>x=>{pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath()};
function star(cx,cy,r,rot=0){return x=>{for(let i=0;i<10;i++){const a=rot+i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}}
function sky(x,top,bot,h=1500){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,W,H)}
function pine(x,cx,by,s,col){piece(x,poly([[cx,by-150*s],[cx+48*s,by-60*s],[cx+22*s,by-60*s],[cx+62*s,by],[cx-62*s,by],[cx-22*s,by-60*s],[cx-48*s,by-60*s]]),col)}
function house(x,cx,by,s,body,roof,lit){
  piece(x,rect(cx-80*s,by-110*s,160*s,110*s),body);piece(x,poly([[cx-100*s,by-110*s],[cx,by-190*s],[cx+100*s,by-110*s]]),roof);
  piece(x,rect(cx+34*s,by-60*s,34*s,60*s),shade(body,.7),{shadow:0});
  piece(x,rect(cx-52*s,by-84*s,40*s,40*s),lit?'#ffd27a':shade(body,.8),{shadow:0});
  if(lit){x.save();x.globalCompositeOperation='screen';const g=x.createRadialGradient(cx-32*s,by-64*s,2,cx-32*s,by-64*s,180*s);g.addColorStop(0,'rgba(255,200,110,.55)');g.addColorStop(1,'rgba(255,200,110,0)');x.fillStyle=g;x.fillRect(cx-250*s,by-250*s,500*s,420*s);x.restore()}
}
function cloud(x,cx,cy,s,col='#fff8ee'){piece(x,x=>{x.moveTo(cx-90*s,cy);x.arc(cx-50*s,cy,40*s,Math.PI,0);x.arc(cx,cy-22*s,52*s,Math.PI,0);x.arc(cx+56*s,cy,38*s,Math.PI,0);x.lineTo(cx+94*s,cy+30*s);x.lineTo(cx-90*s,cy+30*s);x.closePath()},col)}
function waves(x,y0,color,t,amp,sp,seed){piece(x,x=>{x.moveTo(-60,H+80);for(let px=-80;px<=W+120;px+=28){const y=y0+Math.sin((px+t*sp)/60+seed)*amp+Math.sin((px+t*sp*.6)/23)*amp*.3;x.lineTo(px,y)}x.lineTo(W+120,H+80);x.closePath()},color)}
function ship(x,cx,cy,s,rot){x.save();x.translate(cx,cy);x.rotate(rot);x.scale(s,s);
  piece(x,x=>{x.moveTo(-110,0);x.lineTo(110,0);x.lineTo(80,46);x.lineTo(-84,46);x.closePath()},'#7a4a26');
  piece(x,rect(-4,-190,8,190),'#4b2d16',{shadow:0});
  piece(x,x=>{x.moveTo(6,-186);x.quadraticCurveTo(100,-120,86,-24);x.lineTo(6,-24);x.closePath()},'#f4ead2');
  piece(x,x=>{x.moveTo(-6,-160);x.quadraticCurveTo(-82,-110,-70,-24);x.lineTo(-6,-24);x.closePath()},'#eadcbc');
  piece(x,poly([[8,-190],[48,-176],[8,-162]]),'#c4502f',{shadow:0});
  x.restore()}
function person(x,cx,by,s,col,arm=0,hat=null){
  piece(x,rrect(cx-26*s,by-110*s,52*s,110*s,14*s),col);piece(x,circ(cx,by-132*s,22*s),'#e7c39c');
  if(hat)piece(x,poly([[cx-30*s,by-146*s],[cx+30*s,by-146*s],[cx+18*s,by-190*s],[cx-18*s,by-190*s]]),hat,{shadow:0});
  if(arm){x.save();x.translate(cx+22*s,by-96*s);x.rotate(-1.15+Math.sin(arm)*.08);piece(x,rrect(0,-9*s,80*s,18*s,9*s),col,{shadow:0});x.restore()}}
// cartel de papel con la leyenda
function label(x,t,chip,sub,caps){
  const y0=1360,h=390;
  x.save();x.translate(W/2,y0+h/2);x.rotate(-.008);x.translate(-W/2,-(y0+h/2));
  piece(x,rrect(54,y0,W-108,h,18),'#f6efdf');
  // lengüeta con el nombre
  piece(x,rrect(54,y0-52,640,64,12),'#c4502f',{shadow:1});
  txt(x,chip,78,y0-8,'700 30px Fraunces','#fff3df','left',3);
  if(sub)txt(x,sub,78,y0+50,'700 32px Fraunces','#9a5528','left',1);
  caps.forEach(([a,b,ls,size])=>{
    const al=blockAlpha(t,a,b);if(al<=0)return;
    x.save();x.globalAlpha=al;x.translate(0,(1-eO(seg(t,a,a+.5)))*12);
    const lh=size*1.28,top=y0+(sub?96:72)+Math.max(0,(3-ls.length))*lh*.35;
    ls.forEach((s,i)=>txt(x,s,78,top+size+i*lh,`700 ${size}px Fraunces`,'#2c2018'));
    x.restore()});
  x.restore();
}
