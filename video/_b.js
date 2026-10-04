
// ═══════════════ ESTILO 9 · KÂĞIT KESİK: escenas ═══════════════
// cartel de papel con leyenda; tamaño ya ajustado en buildTimeline (nunca se sale de la tarjeta)
function labelCard(x,t,sc){
  const y0=1330,h=370,C=sc.C;
  const v=Math.min(eO(seg(t,C[0].a-.35,C[0].a-.02)),1-seg(t,C[C.length-1].b-.05,C[C.length-1].b+.35));
  if(v<=0.01)return;
  const fontFor=(g,s)=>g.dig?`700 ${s}px ${DIGITF.pc}`:`700 ${s}px Fraunces`;
  x.save();x.globalAlpha=v;x.translate(W/2,y0+h/2+(1-v)*60);x.rotate(-.008);x.translate(-W/2,-(y0+h/2));
  piece(x,rrect(54,y0,W-108,h,18),'#f6efdf');
  piece(x,rrect(54,y0-52,sc.chipW||700,64,12),'#b84a2c',{shadow:1});
  txt(x,sc.chip,78,y0-8,'700 30px Fraunces','#fff3df','left',3);
  if(sc.sub)txt(x,sc.sub,78,y0+54,'700 36px Fraunces','#6b3412','left',1);
  C.forEach(c=>{
    const al=blockAlpha(t,c.a,c.b);if(al<=0)return;
    x.save();x.globalAlpha=v*al;x.translate(0,(1-eO(seg(t,c.a,c.a+.5)))*12);
    const lh=c.s*1.26,top=y0+(sc.sub?108:80)+Math.max(0,(3-c.l.length))*lh*.3;
    c.l.forEach((s,i)=>drawSegs(x,segsOf(s),78,top+c.s+i*lh,c.s,fontFor,()=>'#2c2018'));
    x.restore()});
  x.restore();
}
const PCBAL='#b84a2c';
// ── Miguel cruza el océano (amanecer sobre el mar)
function pcMiguel(x,t,dur,sc){
  const C=sc.C,u=t/dur;
  sky(x,'#2c4a7c','#f1b98a',1250);
  const sun=eO(seg(t,.4,dur*.7));piece(x,circ(820,720-sun*250,88),'#fff1c9',{shadow:0});
  cloud(x,200+Math.sin(t*.4)*30,400,1.1,'#ffe3cc');cloud(x,820+Math.sin(t*.3)*26,350,.8,'#ffe3cc');
  piece(x,hillPath(780,120,3,-t*6,false,80),'#527a62');piece(x,hillPath(850,70,9,t*5,false),'#3f6b52');
  for(let i=0;i<6;i++)pine(x,70+i*54,880-(i%2)*10,.7,'#2e5a40');
  house(x,230,880,.8,'#e8d9bd','#b6573a',false);
  waves(x,960,'#5a8fb0',t,12,40,1);
  const su=eIO(seg(t,1.2,dur-2.4)),sxp=lerp(180,900,su),syp=1000+Math.sin(su*Math.PI*2)*8-Math.sin(t*2)*6;
  ship(x,sxp,syp,1.4,Math.sin(t*1.6)*.05);
  waves(x,1060,'#3f7596',t,14,55,3);waves(x,1160,'#2d5f82',t,16,70,5);waves(x,1260,'#214b6a',t,18,85,7);
  const rc=eO(seg(t,C[2].a-.4,C[2].a+2.4));if(rc>0){x.save();x.translate((1-rc)*360,0);piece(x,x=>{x.moveTo(W+80,H);x.lineTo(W+80,1010);x.quadraticCurveTo(930,900,800,1010);x.quadraticCurveTo(760,1050,740,1120);x.lineTo(740,H);x.closePath()},'#7fa65a');house(x,930,985,.7,'#efe1c4','#c4502f',true);x.restore()}
  labelCard(x,t,sc);
}
// ── el campo entre tres ríos (mediodía)
function pcCampo(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#9fd0ea','#f6e7b4',1200);
  piece(x,circ(200,250,80),'#ffe27a',{shadow:0});cloud(x,640+Math.sin(t*.3)*30,260,1.1);cloud(x,880,420,.7);
  piece(x,hillPath(660,90,2,-t*4,false,90),'#9cc27a');piece(x,hillPath(780,70,6,t*3,false),'#7fb263');
  const sw=eO(seg(t,.5,2.4));
  piece(x,rrect(160,600+(1-sw)*300,760,560,20),'#b8d98a');
  const q=eO(seg(t,1.4,3.2));x.save();x.globalAlpha=q;
  piece(x,x=>{x.moveTo(140,600);for(let px=140;px<=900;px+=40)x.lineTo(px,600+Math.sin(t*1.3+px/70)*6);for(let px=900;px>=140;px-=40)x.lineTo(px,636+Math.sin(t*1.3+px/70)*6);x.closePath()},'#4b93c7');
  piece(x,x=>{x.moveTo(900,620);for(let py=620;py<=1160;py+=40)x.lineTo(900+Math.sin(t*1.3+py/70)*6,py);for(let py=1160;py>=620;py-=40)x.lineTo(936+Math.sin(t*1.3+py/70)*6,py);x.closePath()},'#4b93c7');
  piece(x,x=>{x.moveTo(126,620);for(let py=620;py<=1160;py+=40)x.lineTo(126+Math.sin(t*1.3+py/70)*6,py);for(let py=1160;py>=620;py-=40)x.lineTo(162+Math.sin(t*1.3+py/70)*6,py);x.closePath()},'#4b93c7');
  x.restore();
  const tag=(s,cx,cy,a,b)=>{const al=eO(seg(t,a,b));if(al<=0)return;x.save();x.globalAlpha=al;x.translate(cx,cy);x.rotate(-.05);piece(x,rrect(-120,-30,240,60,10),'#fff4de');txt(x,s,0,12,'700 36px Fraunces','#245a86','center',1);x.restore()};
  const t1=C[1].a;tag('Yí',520,540,t1,t1+.6);tag('Sarandí',930,1080,t1+.7,t1+1.3);tag('Marincho',160,1090,t1+1.4,t1+2.0);
  [[200,660],[870,660],[200,1120],[870,1120]].forEach(([mx,my],i)=>{const k=eBack(seg(t,t1+2+i*.2,t1+2.6+i*.2));if(k>0){x.save();x.translate(mx,my);x.scale(k,k);piece(x,poly([[-16,0],[-12,-52],[0,-70],[12,-52],[16,0]]),'#a79c8a');x.restore()}});
  for(let i=0;i<5;i++){const cx=300+((i*131+t*18)%520),cy=840+((i*97)%240),k=eO(seg(t,2.6+i*.2,3.4));x.save();x.globalAlpha=k;
    piece(x,rrect(cx-30,cy-18,60,34,14),'#fff6e6');piece(x,circ(cx+32,cy-14,13),'#fff6e6',{shadow:0});piece(x,circ(cx-8,cy-8,9),'#3b3128',{shadow:0});x.restore()}
  const fl=eBack(seg(t,C[0].a+1.6,C[0].a+2.4));if(fl>0){x.save();x.translate(W/2,430);x.scale(fl,fl);x.rotate(-.03);piece(x,rrect(-250,-46,500,92,16),PCBAL);txt(x,'hoy: departamento de Flores',0,12,'700 34px Fraunces','#fff3df','center',1);x.restore()}
  labelCard(x,t,sc);
}
// ── la plaza de Trinidad, 1830 (tarde dorada)
// ── bandera de Uruguay (9 franjas, 5 blancas y 4 celestes; Sol de Mayo de 16 rayos en el cantón), ondeando por rebanadas
let UYF=null;
function uyFlagBuild(w,h){
  const c=mk(w,h),g=c.getContext('2d'),sh=h/9;
  for(let i=0;i<9;i++){g.fillStyle=i%2?'#3a80c8':'#fbf8ef';g.fillRect(0,i*sh,w,sh+.6)}
  const cw=sh*4;g.fillStyle='#fbf8ef';g.fillRect(0,0,cw,cw);
  const cx=cw/2,cy=cw/2,r=cw*.2;g.fillStyle='#f2b61d';g.strokeStyle='#f2b61d';g.lineCap='round';
  g.beginPath();g.arc(cx,cy,r,0,7);g.fill();
  for(let k=0;k<16;k++){const an=k*Math.PI/8,long=k%2===0;g.lineWidth=long?3:2.4;g.beginPath();g.moveTo(cx+Math.cos(an)*(r+1),cy+Math.sin(an)*(r+1));g.lineTo(cx+Math.cos(an)*(r+cw*(long?.26:.2)),cy+Math.sin(an)*(r+cw*(long?.26:.2)));g.stroke()}
  g.fillStyle='#8a5a1c';g.beginPath();g.arc(cx-r*.3,cy-r*.15,r*.1,0,7);g.arc(cx+r*.3,cy-r*.15,r*.1,0,7);g.fill();
  g.strokeStyle='#8a5a1c';g.lineWidth=2;g.beginPath();g.arc(cx,cy+r*.15,r*.4,.2,Math.PI-.2);g.stroke();
  return c}
function uyFlag(x,fx,fy,w,h,t){
  if(!UYF||UYF.width!==w)UYF=uyFlagBuild(w,h);
  const sw=4;x.save();
  for(let sx_=0;sx_<w;sx_+=sw){const u=sx_/w,amp=3+16*u,dy=Math.sin(t*4.2-sx_*.035)*amp,dy2=Math.sin(t*4.2-(sx_+sw)*.035)*amp,shade=Math.cos(t*4.2-sx_*.035)*.14*u;
    x.drawImage(UYF,sx_,0,sw,h,fx+sx_,fy+dy,sw+.6,h);
    if(shade>0){x.fillStyle=`rgba(255,255,255,${shade*.6})`}else{x.fillStyle=`rgba(20,30,60,${-shade*.9})`}
    x.fillRect(fx+sx_,fy+dy,sw+.6,h)}
  x.restore()}
function pcPlaza(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#86bde0','#f9dca0',1200);piece(x,circ(880,420,90),'#fff0b8',{shadow:0});cloud(x,260+Math.sin(t*.3)*25,420,1.1);cloud(x,640,360,.8);
  [[120,'#efe1c4','#c4502f'],[330,'#f2cbb0','#8a4a38'],[560,'#d9e6c4','#b6573a'],[790,'#efe1c4','#a24432'],[990,'#f2cbb0','#c4502f']].forEach(([cx,b,r],i)=>{house(x,cx,820-(i%2)*14,.9,b,r,false)});
  piece(x,hillPath(860,25,4,0,false,120),'#9cbf6e');piece(x,rect(-40,860,W+80,520),'#d8b985');
  x.save();x.strokeStyle='#5a3b22';x.lineWidth=4;x.beginPath();x.moveTo(0,330);x.quadraticCurveTo(540,430,W,330);x.stroke();x.restore();
  for(let i=0;i<10;i++){if(i<5)continue;const uu=(i+.5)/10,bx=uu*W,by=330+Math.sin(uu*Math.PI)*92;piece(x,poly([[bx-26,by],[bx+26,by],[bx,by+56]]),['#c4502f','#f5c945','#3f88c5','#fff4de'][i%4],{shadow:0})}
  piece(x,rect(146,396,12,490),'#5a3b22');piece(x,circ(152,392,14),'#e0b030',{shadow:0});
  uyFlag(x,158,414,420,280,t);
  const tb=eO(seg(t,.5,1.8));x.save();x.translate(0,(1-tb)*400);
  piece(x,rect(380,800,420,40),'#8a5a2b');piece(x,rect(400,840,22,130),'#6b4420');piece(x,rect(760,840,22,130),'#6b4420');
  person(x,590,800,1.25,'#b43a2a',t*3,'#26211d');x.restore();
  for(let i=0;i<11;i++){const px=60+i*92,bob=Math.abs(Math.sin(t*4+i))*(t>C[0].a?8:2);person(x,px,1180-(i%3)*38-bob,.9,['#3f7f8a','#c28a2a','#5b5aa0','#8a4a38'][i%4],0,i%2?'#3a2f28':null)}
  const bl=eBack(seg(t,C[1].a,C[1].a+.7),2.2);if(bl>0){x.save();x.translate(760,640);x.scale(bl,bl);piece(x,x=>{x.ellipse(0,0,170,70,0,0,7)},'#fffaf0');piece(x,poly([[-90,50],[-130,110],[-30,64]]),'#fffaf0',{shadow:0});txt(x,'¡Juramos!',0,16,'700 56px Fraunces','#2c2018','center');x.restore()}
  labelCard(x,t,sc);
}
// ── nace el departamento de Flores (amanecer dorado)
function pcFlores(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#5f7bb4','#f9c98a',1250);
  piece(x,circ(540,1120-eO(seg(t,.2,3))*240,110),'#fff0c0',{shadow:0});
  for(let i=0;i<9;i++){const sx_=80+i*115,len=100+((i*53)%140),sw=Math.sin(t*1.5+i)*10;x.save();x.strokeStyle='rgba(255,240,200,.55)';x.lineWidth=2;x.beginPath();x.moveTo(sx_,0);x.lineTo(sx_+sw,len);x.stroke();piece(x,star(sx_+sw,len+30,26,Math.sin(t+i)*.2),'#ffd86a',{shadow:1});x.restore()}
  piece(x,hillPath(1130,70,2,-t*4,false,100),'#c98a5a');piece(x,hillPath(1230,60,6,t*3,false),'#a8664a');
  const fl=eBack(seg(t,.6,2.2),1.2),pts=P.flPts;let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;pts.forEach(([a,b])=>{mnx=Math.min(mnx,a);mxx=Math.max(mxx,a);mny=Math.min(mny,b);mxy=Math.max(mxy,b)});
  const sc2=540/(mxx-mnx),ox=W/2-(mnx+mxx)/2*sc2,oy=700-(mny+mxy)/2*sc2+(1-fl)*700;
  piece(x,x=>{pts.forEach(([a,b],i)=>i?x.lineTo(ox+a*sc2,oy+b*sc2):x.moveTo(ox+a*sc2,oy+b*sc2));x.closePath()},'#f2c14e');
  const ta=eO(seg(t,2.2,3.2));if(ta>0){x.save();x.globalAlpha=ta;txt(x,'FLORES',W/2,oy+(mny+mxy)/2*sc2+10,'700 84px Fraunces','#7a4a1c','center',6);txt(x,'1885',W/2,oy+(mny+mxy)/2*sc2+90,'700 56px Fraunces',PCBAL,'center',4);x.restore()}
  for(let i=0;i<6;i++){const k=eBack(seg(t,C[1].a+i*.18,C[1].a+.8+i*.18));if(k>0){x.save();x.translate(0,(1-k)*200);const hl=i===2;person(x,110+i*172,1190,1.5,hl?PCBAL:'#5b4a78',0,hl?'#f5c945':null);
    if(hl)txt(x,'Sandalio',110+i*172,1236,'700 38px Fraunces','#fff3df','center');x.restore()}}
  labelCard(x,t,sc);
}
// ── Delmiro: la casa del Sarandí y los doce hijos (anochecer estable)
function pcDelmiro(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#3d4876','#d68a64',1250);
  piece(x,circ(210,300,70),'#f4efe0',{shadow:0});
  for(let i=0;i<12;i++){const col=i%6,row=Math.floor(i/6),sx_=110+col*172,len=120+row*190+((i*37)%50),sw=Math.sin(t*1.4+i)*9;
    const off=i<7?seg(t,C[2].a+.4+i*.25,C[2].a+1.6+i*.25):0,eloy=i===9;
    x.save();x.strokeStyle='rgba(255,240,200,.45)';x.lineWidth=2;x.beginPath();x.moveTo(sx_,0);x.lineTo(sx_+sw,len);x.stroke();
    const k=eBack(seg(t,C[1].a+i*.14,C[1].a+.8+i*.14));x.translate(sx_+sw,len+34);x.scale(k,k);
    piece(x,star(0,0,eloy?36:28,Math.sin(t+i)*.15),mix(eloy?'#ffe27a':'#ffd86a','#8a8f9c',off),{shadow:1});x.restore()}
  piece(x,hillPath(1010,100,2,-t*3,true,110),'#6c5a78');piece(x,hillPath(1110,70,5,t*3,false),'#4a5a78');
  piece(x,x=>{x.moveTo(-60,1160);for(let px=-60;px<=W+80;px+=40)x.lineTo(px,1150+Math.sin(t*1.2+px/80)*8);for(let px=W+80;px>=-60;px-=40)x.lineTo(px,1210+Math.sin(t*1.2+px/80)*8);x.closePath()},'#4a86b8');
  txt(x,'Sarandí',W-60,1250,'700 34px Fraunces','#cfe6f6','right',2);
  for(let i=0;i<5;i++)pine(x,70+i*64,1150,1.0,'#233a36');
  house(x,590,1160,2.0,'#e6d4b4','#a24432',true);
  for(let i=0;i<5;i++){const ph=(t*.25+i/5)%1;x.save();x.globalAlpha=(1-ph)*.9;cloud(x,700+Math.sin(ph*6+i)*26+ph*60,860-ph*300,.35+ph*.5,'#e9e1d6');x.restore()}
  for(let i=0;i<16;i++){const fx=(hash(i,1,1)*W+Math.sin(t*.6+i)*60+W)%W,fy=520+hash(i,2,2)*600+Math.cos(t*.8+i*2)*30,tw=.5+.5*Math.sin(t*3+i*1.7);x.save();x.globalAlpha=tw;x.shadowColor='#ffe27a';x.shadowBlur=22;x.fillStyle='#fff1a6';x.beginPath();x.arc(fx,fy,5,0,7);x.fill();x.restore()}
  labelCard(x,t,sc);
}
// ── el chofer (tarde cálida de ruta)
function wheelDraw(x,cx,cy,r,rot,spokes=6){
  x.save();x.translate(cx,cy);x.fillStyle='#1c1a18';x.beginPath();x.arc(0,0,r,0,7);x.fill();
  x.fillStyle='#f4efe4';x.beginPath();x.arc(0,0,r*.72,0,7);x.fill();x.fillStyle='#bfb9ac';x.beginPath();x.arc(0,0,r*.5,0,7);x.fill();
  x.rotate(rot);x.strokeStyle='#8c867a';x.lineWidth=3;for(let i=0;i<spokes;i++){const a=i/spokes*Math.PI*2;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*r*.5,Math.sin(a)*r*.5);x.stroke()}
  x.restore()}
function car(x,cx,cy,s,t){
  x.save();x.translate(cx,cy+Math.sin(t*9)*1.6);x.scale(s,s);
  // taxi Mercedes «Ponton» negro con techo amarillo (como el de la foto de referencia): guardabarros redondeados, parrilla cromada vertical, faros redondos, ruedas de cantero blanco
  const body='#17161a',roofc='#f0be2a',chrome='#dad6cc',glass='#a9c3cf';
  piece(x,rrect(-204,-104,412,70,26),body);
  piece(x,poly([[60,-108],[200,-96],[214,-62],[60,-62]]),body,{shadow:0});
  piece(x,circ(-115,-44,56),body,{shadow:0});piece(x,circ(122,-44,56),body,{shadow:0});
  piece(x,x=>{x.moveTo(-142,-104);x.quadraticCurveTo(-130,-176,-72,-190);x.lineTo(34,-190);x.quadraticCurveTo(84,-170,100,-104);x.closePath()},roofc);
  piece(x,x=>{x.moveTo(-142,-104);x.lineTo(-134,-126);x.lineTo(96,-126);x.lineTo(100,-104);x.closePath()},body,{shadow:0});
  piece(x,poly([[-118,-132],[-106,-172],[-64,-180],[-10,-180],[-10,-132]]),glass,{shadow:0});
  piece(x,poly([[6,-132],[6,-180],[34,-180],[76,-132]]),glass,{shadow:0});
  piece(x,rect(-6,-182,12,54),roofc,{shadow:0});
  piece(x,rect(-198,-72,396,4),chrome,{shadow:0});
  piece(x,rrect(-222,-56,40,11,5),chrome,{shadow:0});piece(x,rrect(172,-56,50,11,5),chrome,{shadow:0});
  piece(x,rrect(194,-98,20,46,6),chrome,{shadow:0});for(let i=0;i<4;i++)piece(x,rect(198+i*4,-94,1.6,38),body,{shadow:0});
  piece(x,circ(168,-92,16),chrome,{shadow:0});piece(x,circ(168,-92,11),'#fff2c4',{shadow:0});
  x.save();x.strokeStyle=chrome;x.lineWidth=3;x.beginPath();x.arc(204,-104,8,0,7);for(let k=0;k<3;k++){const an=-Math.PI/2+k*2.094;x.moveTo(204,-104);x.lineTo(204+Math.cos(an)*8,-104+Math.sin(an)*8)}x.stroke();x.restore();
  piece(x,rrect(-30,-216,60,26,5),'#fbf7e6');txt(x,'TAXI',0,-196,'700 19px Fraunces','#1d1c20','center',2);
  // conductor: cabeza con gorra y manos al volante
  x.save();x.fillStyle='#e2bc94';x.beginPath();x.arc(10,-132,17,0,7);x.fill();x.fillStyle='#26211d';x.beginPath();x.arc(10,-138,18,Math.PI,0);x.fill();x.fillRect(-9,-139,38,5);x.fillStyle='#3a5a8a';x.fillRect(-8,-118,36,22);x.restore();
  wheelDraw(x,-115,-42,42,-t*9);wheelDraw(x,122,-42,42,-t*9);x.save();x.strokeStyle='#f4efe0';x.lineWidth=7;[-115,122].forEach(cx_=>{x.beginPath();x.arc(cx_,-42,30,0,7);x.stroke()});x.restore();piece(x,circ(-115,-42,14),chrome,{shadow:0});piece(x,circ(122,-42,14),chrome,{shadow:0});
  x.restore()}
function eucalyptus(x,cx,by,s,col){piece(x,rect(cx-5*s,by-210*s,10*s,210*s),'#6a4a30',{shadow:0});piece(x,x=>{x.ellipse(cx,by-250*s,38*s,104*s,0,0,7)},col)}
function pole(x,cx,by,s){piece(x,rect(cx-5*s,by-280*s,10*s,280*s),'#5a3b22',{shadow:0});piece(x,rect(cx-46*s,by-262*s,92*s,8*s),'#5a3b22',{shadow:0})}
function pcChofer(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#f4c98a','#fdeccd',1200);piece(x,circ(250,430,100),'#fff5d6',{shadow:0});
  piece(x,hillPath(780,80,3,-t*8,false,100),'#c8b87a');piece(x,hillPath(860,60,8,-t*14,false,110),'#a6b36a');
  for(let i=0;i<7;i++){const ex=((i*190-t*70)%1400+1400)%1400-160;eucalyptus(x,ex,980,.9,'#5a7a4a')}
  piece(x,rect(-40,980,W+80,400),'#8a9b5a');
  for(let i=0;i<5;i++){const px=((i*320-t*180)%1600+1600)%1600-200;pole(x,px,1000,1)}
  piece(x,rect(-40,1000,W+80,200),'#7a746c');
  for(let i=0;i<7;i++){const dx=((i*220-t*320)%1600+1600)%1600-200;piece(x,rect(dx,1098,120,10),'#f1e7c8',{shadow:0})}
  // cartel de Trinidad
  const sg=((1500-t*130)%2100+2100)%2100-450;piece(x,rect(sg-5,820,10,170),'#4a3a2a',{shadow:0});piece(x,rrect(sg-130,760,260,78,10),'#2f6f8f');txt(x,'TRINIDAD',sg,816,'700 40px Fraunces','#fff','center',3);
  // polvo y auto
  for(let i=0;i<6;i++){const ph=(t*.8+i/6)%1;x.save();x.globalAlpha=(1-ph)*.8;cloud(x,260-ph*170,1120-ph*40,.3+ph*.6,'#efe3cf');x.restore()}
  car(x,500,1150,1.5,t);
  labelCard(x,t,sc);
}
// ── Mosaicos Rivas y Cía.
function tileDesign(x,kind,cx,cy,s,seed){
  const l=cx-s/2,tp=cy-s/2;
  const base=['#f3e8d0','#e8e3d8','#f3e8d0','#f3e8d0','#6f8f7a','#f3e8d0'][kind];
  piece(x,rrect(l,tp,s,s,6),base,{shadow:1});
  x.save();x.beginPath();x.rect(l+3,tp+3,s-6,s-6);x.clip();
  if(kind===0){[[l,tp],[l+s,tp],[l,tp+s],[l+s,tp+s]].forEach(([a,b])=>{x.fillStyle='#b84a2c';x.beginPath();x.arc(a,b,s*.42,0,7);x.fill()});
    x.fillStyle='#24385e';x.beginPath();x.moveTo(cx,cy-s*.3);x.lineTo(cx+s*.3,cy);x.lineTo(cx,cy+s*.3);x.lineTo(cx-s*.3,cy);x.closePath();x.fill();
    x.fillStyle='#f3e8d0';x.beginPath();x.arc(cx,cy,s*.1,0,7);x.fill()}
  if(kind===2){[['#24385e',.46],['#f3e8d0',.36],['#b84a2c',.26],['#f3e8d0',.16],['#24385e',.07]].forEach(([c,k])=>{x.fillStyle=c;x.beginPath();x.moveTo(cx,cy-s*k*1.15);x.lineTo(cx+s*k*1.15,cy);x.lineTo(cx,cy+s*k*1.15);x.lineTo(cx-s*k*1.15,cy);x.closePath();x.fill()})}
  if(kind===3){x.fillStyle='#3f7a4f';x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,r=i%2?s*.17:s*.4;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.fill();x.fillStyle='#b84a2c';x.beginPath();x.arc(cx,cy,s*.1,0,7);x.fill()}
  if(kind===5){x.fillStyle='#24385e';[[.12,.12],[.88,.12],[.12,.88],[.88,.88]].forEach(([a,b])=>x.fillRect(l+a*s-s*.09,tp+b*s-s*.09,s*.18,s*.18));x.fillStyle='#b84a2c';x.fillRect(cx-s*.07,tp+s*.22,s*.14,s*.56);x.fillRect(l+s*.22,cy-s*.07,s*.56,s*.14)}
  if(kind===1||kind===4){const r=rng(seed*13+kind);x.lineCap='round';
    for(let i=0;i<7;i++){x.strokeStyle=kind===1?`rgba(110,106,98,${.25+r()*.4})`:`rgba(224,236,226,${.25+r()*.4})`;x.lineWidth=1+r()*2.6;x.beginPath();const y0=tp+r()*s;x.moveTo(l,y0);x.bezierCurveTo(l+s*.3,y0+(r()-.5)*s*.7,l+s*.6,y0+(r()-.5)*s*.7,l+s,y0+(r()-.5)*s*.6);x.stroke()}}
  x.restore();
  x.strokeStyle='rgba(60,45,30,.35)';x.lineWidth=2;x.strokeRect(l+3,tp+3,s-6,s-6);
}
function pcMosaicos(x,t,dur,sc){
  const C=sc.C;
  const g=x.createLinearGradient(0,0,0,1300);g.addColorStop(0,'#f1e6cc');g.addColorStop(1,'#e2d2ae');x.fillStyle=g;x.fillRect(0,0,W,H);
  // zócalo y piso de baldosas
  piece(x,rect(-40,1180,W+80,300),'#cdbb92');
  for(let i=0;i<10;i++)tileDesign(x,i%2?2:0,60+i*108,1250,100,i);
  // cartel del taller
  const sg=eBack(seg(t,.4,1.4),1.4);x.save();x.translate(W/2,372);x.scale(sg,sg);x.rotate(-.012);
  piece(x,rrect(-440,-84,880,168,18),'#5c3220');x.strokeStyle='#f0dfbd';x.lineWidth=5;x.strokeRect(-420,-64,840,128);
  txt(x,'MOSAICOS',0,-8,'900 70px Fraunces','#f3e3c0','center',8);txt(x,'RIVAS Y CÍA.',0,52,'900 54px Fraunces','#e9b46a','center',8);x.restore();
  const pl=eBack(seg(t,1.4,2.2),1.6);if(pl>0){x.save();x.translate(W/2,512);x.scale(pl,pl);piece(x,rrect(-330,-34,660,68,12),PCBAL);txt(x,'pisos finos · imitación mármol',0,12,'700 34px Fraunces','#fff3df','center',1);x.restore()}
  // muestrario
  piece(x,rrect(120,572,840,590,20),'#a77a4a');piece(x,rrect(146,598,788,538,12),'#f7efdc',{shadow:0});
  const kinds=[0,1,2,3,4,5];
  kinds.forEach((k,i)=>{const col=i%3,row=Math.floor(i/3),cx=146+130+col*264,cy=598+138+row*262,tt=C[0].a+.4+i*.55;
    const dr=eBack(seg(t,tt,tt+.7),1.5);if(dr>0){x.save();x.translate(0,(1-dr)*-420);x.globalAlpha=eO(seg(t,tt,tt+.3));tileDesign(x,k,cx,cy,226,i);x.restore()}});
  labelCard(x,t,sc);
}
// ── Club Olimpia y la bicicleta (mañana fresca)
function olimpiaEmblem(x,cx,cy,s,t=0){
  x.save();x.translate(cx,cy);x.scale(s,s);
  for(const sgn of [-1,1])for(let i=0;i<4;i++){x.save();x.scale(sgn,1);x.rotate(-.2+i*.22+Math.sin(t*3+i)*.02);piece(x,x=>{x.moveTo(52,-6+i*0);x.quadraticCurveTo(120+i*8,-30-i*10,170-i*4,-8-i*14);x.quadraticCurveTo(120,6+i*10,56,16+i*4);x.closePath()},'#d6d2c8',{shadow:0});x.restore()}
  piece(x,x=>{x.arc(0,0,58,0,Math.PI*2);x.moveTo(34,0);x.arc(0,0,34,0,Math.PI*2,true)},'#c4302b',{shadow:0});
  x.restore()}
function bike(x,cx,gy,s,t,rider=true){
  x.save();x.translate(cx,gy);x.scale(s,s);
  const R=108,rh=[-170,-R],fh=[170,-R],BB=[-5,-80],S=[-52,-232],Ht=[112,-222],Hb=[128,-168];
  const rot=t*5.2;
  // ruedas: cubierta, llanta, rayos
  [rh,fh].forEach(h=>{x.save();x.translate(h[0],h[1]);x.strokeStyle='#1e1c1a';x.lineWidth=11;x.beginPath();x.arc(0,0,R,0,7);x.stroke();x.strokeStyle='#d6d2c6';x.lineWidth=4;x.beginPath();x.arc(0,0,R-8,0,7);x.stroke();
    x.rotate(rot);x.strokeStyle='rgba(60,56,50,.75)';x.lineWidth=1.6;for(let i=0;i<24;i++){const a=i/24*Math.PI*2;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*(R-9),Math.sin(a)*(R-9));x.stroke()}
    x.fillStyle='#8c867a';x.beginPath();x.arc(0,0,7,0,7);x.fill();x.restore()});
  // cuadro de acero en diamante
  const tube=(a,b,w=9)=>{x.strokeStyle='#b8302b';x.lineWidth=w;x.lineCap='round';x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()};
  x.save();x.shadowColor='rgba(25,12,30,.35)';x.shadowBlur=10;x.shadowOffsetY=6;
  tube(rh,BB);tube(BB,S);tube(S,rh,7);tube(S,Ht);tube(Ht,BB);tube(Hb,fh,8);tube(Ht,Hb,12);
  x.restore();
  x.strokeStyle='#f6efdf';x.lineWidth=3;x.beginPath();x.moveTo(Ht[0]-1,Ht[1]+8);x.lineTo(Hb[0]-1,Hb[1]-6);x.stroke();
  // manubrio de carrera (curvo hacia abajo) y potencia
  x.strokeStyle='#2a2623';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(Ht[0],Ht[1]);x.lineTo(130,-244);x.lineTo(170,-246);x.bezierCurveTo(194,-246,200,-212,178,-196);x.lineTo(152,-196);x.stroke();
  // asiento de cuero
  piece(x,x=>{x.moveTo(-96,-246);x.quadraticCurveTo(-60,-262,-14,-244);x.lineTo(-18,-232);x.lineTo(-92,-232);x.closePath()},'#6a3d1d',{shadow:1});
  x.strokeStyle='#2a2623';x.lineWidth=6;x.beginPath();x.moveTo(S[0],S[1]);x.lineTo(S[0]-4,-232);x.stroke();
  // plato y bielas, pedales con calapiés
  x.strokeStyle='#bfb9ac';x.lineWidth=4;x.beginPath();x.arc(BB[0],BB[1],27,0,7);x.stroke();
  const th=t*5.2,L=56,P1=[BB[0]+Math.cos(th)*L,BB[1]+Math.sin(th)*L],P2=[BB[0]-Math.cos(th)*L,BB[1]-Math.sin(th)*L];
  x.strokeStyle='#2a2623';x.lineWidth=7;x.beginPath();x.moveTo(P2[0],P2[1]);x.lineTo(P1[0],P1[1]);x.stroke();
  [P1,P2].forEach(p=>{x.fillStyle='#2a2623';x.fillRect(p[0]-14,p[1]-3,28,6);x.strokeStyle='#8c867a';x.lineWidth=3;x.beginPath();x.moveTo(p[0]-16,p[1]);x.quadraticCurveTo(p[0]+12,p[1]-22,p[0]+22,p[1]-4);x.stroke()});
  // caramañola
  piece(x,rrect(-24,-176,18,50,6),'#f6efdf',{shadow:0});
  if(rider){
    const hip=[-62,-262],ik=(p)=>{const L1=132,L2=136,dx=p[0]-hip[0],dy=p[1]-hip[1],d=Math.hypot(dx,dy),a=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a)),ux=dx/d,uy=dy/d;return[hip[0]+ux*a+uy*h,hip[1]+uy*a-ux*h]};
    const leg=(p,c1,c2)=>{const k=ik(p);x.lineCap='round';x.strokeStyle=c1;x.lineWidth=40;x.beginPath();x.moveTo(hip[0],hip[1]);x.lineTo(k[0],k[1]);x.stroke();x.strokeStyle=c2;x.lineWidth=28;x.beginPath();x.moveTo(k[0],k[1]);x.lineTo(p[0],p[1]);x.stroke();x.fillStyle='#1c1a18';x.beginPath();x.ellipse(p[0]+10,p[1]+2,24,11,0,0,7);x.fill()};
    leg(P2,'#1d2a52','#e2bc94');
    // torso con la camiseta del Olimpia (blanca, O roja)
    const sh=[78,-336];x.save();x.shadowColor='rgba(25,12,30,.3)';x.shadowBlur=10;x.shadowOffsetY=6;x.lineCap='round';x.strokeStyle='#fbf8ef';x.lineWidth=70;x.beginPath();x.moveTo(hip[0]+4,hip[1]-6);x.lineTo(sh[0],sh[1]);x.stroke();x.restore();
    x.strokeStyle='#c4302b';x.lineWidth=7;x.beginPath();x.arc((hip[0]+sh[0])/2+4,(hip[1]+sh[1])/2-4,17,0,7);x.stroke();
    // brazos a los manubrios
    x.strokeStyle='#fbf8ef';x.lineWidth=26;x.beginPath();x.moveTo(sh[0]-6,sh[1]+6);x.lineTo(150,-222);x.stroke();x.fillStyle='#e2bc94';x.beginPath();x.arc(154,-214,14,0,7);x.fill();
    // cabeza con gorra
    x.fillStyle='#e2bc94';x.beginPath();x.arc(104,-372,28,0,7);x.fill();x.fillStyle='#fbf8ef';x.beginPath();x.arc(104,-380,29,Math.PI,0);x.fill();x.fillStyle='#c4302b';x.fillRect(100,-388,50,8);
    leg(P1,'#1d2a52','#e2bc94');
  }
  x.restore()}
function pcCiclista(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#8ec9ea','#f1f0dc',1200);piece(x,circ(900,520,76),'#fff6c8',{shadow:0});cloud(x,300+Math.sin(t*.3)*30,540,1.1);cloud(x,760,470,.7);
  piece(x,hillPath(820,70,4,-t*10,false,110),'#a9cf8a');piece(x,hillPath(900,50,8,-t*18,false,120),'#86b873');
  for(let i=0;i<7;i++){const ex=((i*190-t*90)%1400+1400)%1400-160;eucalyptus(x,ex,980,.85,'#4f7a52')}
  piece(x,rect(-40,980,W+80,400),'#92b76a');
  for(let i=0;i<5;i++){const px=((i*320-t*210)%1600+1600)%1600-200;pole(x,px,1000,1)}
  piece(x,rect(-40,1000,W+80,230),'#7d776f');
  for(let i=0;i<7;i++){const dx=((i*220-t*380)%1600+1600)%1600-200;piece(x,rect(dx,1118,120,10),'#f1e7c8',{shadow:0})}
  // bandera del club colgada
  const bn=eBack(seg(t,.5,1.5),1.4);x.save();x.translate(W/2,370);x.scale(bn,bn);x.rotate(Math.sin(t*1.3)*.012);
  piece(x,rrect(-420,-64,840,128,10),'#fbf8ef');x.strokeStyle='#c4302b';x.lineWidth=7;x.strokeRect(-410,-54,820,108);
  olimpiaEmblem(x,-310,0,.5,t);txt(x,'CLUB OLIMPIA',100,2,'900 62px Fraunces','#c4302b','center',3);txt(x,'COLÓN · MONTEVIDEO',100,44,'700 28px Fraunces','#6a2a22','center',3);x.restore();
  bike(x,540,1130,1.62,t);
  const eb=eBack(seg(t,C[1].a,C[1].a+.8),1.8);if(eb>0){x.save();x.translate(900,640);x.scale(eb,eb);x.rotate(.06);piece(x,rrect(-110,-110,220,220,24),'#fbf8ef');olimpiaEmblem(x,0,0,.55,t);x.restore()}
  labelCard(x,t,sc);
}
// ── el sótano de Magallanes y las cartas españolas
function naipe(x,cx,cy,w,h,rot,palo,n){
  x.save();x.translate(cx,cy);x.rotate(rot);
  piece(x,rrect(-w/2,-h/2,w,h,12),'#fbf4e2');x.strokeStyle='#b9a37a';x.lineWidth=3;x.strokeRect(-w/2+8,-h/2+8,w-16,h-16);
  const col={oros:'#a87710',espadas:'#2f4f6f',bastos:'#2f6b3a'}[palo];
  txt(x,String(n),-w/2+22,-h/2+40,'700 32px Fraunces',col,'left');txt(x,String(n),w/2-22,h/2-14,'700 32px Fraunces',col,'right');
  const sword=(sx,sy,sc,rr)=>{x.save();x.translate(sx,sy);x.rotate(rr);x.scale(sc,sc);
    x.fillStyle='#7f9bb8';x.strokeStyle='#2f4f6f';x.lineWidth=3;x.beginPath();x.moveTo(0,-96);x.quadraticCurveTo(15,-40,9,34);x.lineTo(-9,34);x.quadraticCurveTo(-15,-40,0,-96);x.closePath();x.fill();x.stroke();
    x.strokeStyle='#e8f0f8';x.lineWidth=2;x.beginPath();x.moveTo(0,-84);x.lineTo(0,28);x.stroke();
    x.fillStyle='#d6a52a';x.strokeStyle='#8a6410';x.lineWidth=3;x.beginPath();x.roundRect(-30,34,60,12,6);x.fill();x.stroke();
    x.fillStyle='#4a2d18';x.fillRect(-6,46,12,34);x.fillStyle='#d6a52a';x.beginPath();x.arc(0,84,9,0,7);x.fill();x.restore()};
  const coin=(cx2,cy2,r)=>{x.fillStyle='#e2ab2c';x.strokeStyle='#8a6410';x.lineWidth=3;x.beginPath();x.arc(cx2,cy2,r,0,7);x.fill();x.stroke();x.strokeStyle='#f6d878';x.lineWidth=3;x.beginPath();x.arc(cx2,cy2,r*.62,0,7);x.stroke();x.fillStyle='#b9861a';x.beginPath();x.arc(cx2,cy2,r*.22,0,7);x.fill()};
  const club=(sx,sy,sc,rr)=>{x.save();x.translate(sx,sy);x.rotate(rr);x.scale(sc,sc);
    x.strokeStyle='#6b4423';x.lineCap='round';x.lineWidth=26;x.beginPath();x.moveTo(0,90);x.bezierCurveTo(-10,30,12,-30,0,-90);x.stroke();
    x.lineWidth=36;x.beginPath();x.moveTo(2,-50);x.lineTo(-1,-84);x.stroke();
    x.fillStyle='#3f8a46';[[-22,-30,-.6],[24,-10,.7],[-24,30,-.5],[22,50,.6],[0,-100,0]].forEach(([lx,ly,lr])=>{x.save();x.translate(lx,ly);x.rotate(lr);x.beginPath();x.ellipse(0,-12,10,22,0,0,7);x.fill();x.restore()});
    x.fillStyle='#f0e0b8';[[-3,-40],[3,10],[-3,50]].forEach(([kx,ky])=>{x.beginPath();x.arc(kx,ky,4,0,7);x.fill()});x.restore()};
  if(palo==='espadas'&&n===1)sword(0,-6,1.1,0);
  if(palo==='espadas'&&n===7){[-60,-40,-20,0,20,40,60].forEach((px,i)=>sword(px,(i%2?-6:12),.58,0))}
  if(palo==='bastos'&&n===1)club(0,-4,1.1,.12);
  if(palo==='oros'&&n===7)[[-48,-92],[48,-92],[-52,-8],[0,-8],[52,-8],[-48,76],[48,76]].forEach(([a,b])=>coin(a,b+10,27));
  x.restore()}
const al0=(t,C)=>{const pa=C[1].a-.2,pb=C[1].b+.1;return Math.min(Math.min(1,Math.max(0,(t-pa)/.8)),1-Math.min(1,Math.max(0,(t-(pb-.4))/.4)))};
function pcSotano(x,t,dur,sc){
  const C=sc.C;
  sky(x,'#27386e','#6f80be',900);
  for(let i=0;i<12;i++){const sx_=60+((i*83)%960),sy=300+((i*131)%260),tw=.5+.5*Math.sin(t*2+i);x.save();x.globalAlpha=.5+.5*tw;piece(x,star(sx_,sy,11),'#fff0b0',{shadow:0});x.restore()}
  piece(x,circ(560,380,58),'#f4efe0',{shadow:0});
  // fachadas vecinas
  [[20,330,'#625584'],[760,420,'#6e5f8e']].forEach(([fx,fh,col],i)=>{piece(x,rect(fx,880-fh,300,fh+40),col);for(let r=0;r<Math.floor(fh/110);r++)for(let c=0;c<2;c++){const on=hash(i,r,c)>.4;piece(x,rect(fx+50+c*130,880-fh+34+r*100,70,58),on?'#ffd27a':'#2b2540',{shadow:0})}});
  // calle y vereda
  piece(x,rect(-40,878,W+80,44),'#4c4166');
  // la casa de la esquina
  piece(x,rect(330,620,420,262),'#7d689e');piece(x,poly([[300,620],[540,520],[780,620]]),'#463a62');
  piece(x,rect(380,690,80,90),'#ffd27a',{shadow:0});piece(x,rect(620,690,80,90),'#ffd27a',{shadow:0});piece(x,rect(500,740,80,142),'#3a2f50',{shadow:0});
  // chimenea que baja hasta las brasas
  piece(x,rect(346,520,34,640),'#5a4a68',{shadow:0});piece(x,rect(336,508,54,18),'#463a62',{shadow:0});
  for(let i=0;i<5;i++){const ph=(t*.32+i/5)%1,sx_=363+Math.sin(ph*7+i)*26+ph*90,sy=500-ph*170;x.save();x.globalAlpha=Math.min(1,(1-ph)*1.7);cloud(x,sx_,sy,.4+ph*.55,'#ece4d8');x.restore()}
  // corte: bajo tierra
  piece(x,rect(40,922,W-80,330),'#5b3f35');
  piece(x,rect(110,960,860,262),'#946243');
  for(let r=0;r<5;r++){x.strokeStyle='rgba(60,35,25,.35)';x.lineWidth=3;x.beginPath();x.moveTo(110,985+r*50);x.lineTo(970,985+r*50);x.stroke()}
  piece(x,rect(110,1190,860,32),'#3f2d25',{shadow:0});
  // escalera desde la puerta
  for(let k=0;k<7;k++)piece(x,rect(520-k*34,960+k*34,70+k*34,34),'#b88a5a',{shadow:1});
  // brasero con parrilla
  const pulse=.8+.2*Math.sin(t*6);
  piece(x,rrect(170,1150,230,44,8),'#3a2b24');piece(x,rrect(184,1158,202,28,6),mix('#ff9a3c','#ff6a1e',pulse),{shadow:0});
  x.strokeStyle='#2a2320';x.lineWidth=5;for(let i=0;i<6;i++){x.beginPath();x.moveTo(190+i*36,1136);x.lineTo(190+i*36,1160);x.stroke()}x.beginPath();x.moveTo(184,1136);x.lineTo(388,1136);x.stroke();
  x.save();x.globalCompositeOperation='screen';const g=x.createRadialGradient(285,1170,10,285,1170,320);g.addColorStop(0,`rgba(255,150,60,${.65*pulse})`);g.addColorStop(1,'rgba(255,150,60,0)');x.fillStyle=g;x.fillRect(60,940,620,300);x.restore();
  // mesa con taburetes y cartas
  piece(x,rect(560,1118,340,22),'#7a4e2a');piece(x,rect(580,1140,22,60),'#5e3a1f',{shadow:0});piece(x,rect(860,1140,22,60),'#5e3a1f',{shadow:0});
  [[560,1170],[620,1176],[830,1176],[890,1170]].forEach(([sx_,sy])=>{piece(x,rrect(sx_-18,sy,36,16,6),'#6b4423',{shadow:0});piece(x,rect(sx_-4,sy+16,8,30),'#5e3a1f',{shadow:0})});
  [[640,-.25],[700,0],[760,.25]].forEach(([cx,r])=>{x.save();x.translate(cx,1100);x.rotate(r);piece(x,rrect(-16,-30,32,48,4),'#fbf4e2',{shadow:0});x.restore()});
  // cartel de calle
  const ca=eBack(seg(t,.8,1.6))*(1-Math.min(1,Math.max(0,al0(t,C))));if(ca>0){x.save();x.translate(150,800);x.scale(ca,ca);piece(x,rect(-6,0,12,100),'#2c2018');piece(x,rrect(-150,-42,300,58,8),'#2f6f8f');txt(x,'Magallanes y Lima',0,0,'700 30px Fraunces','#fff','center',1);x.restore()}
  // las bravas del truco, en un cartel de papel
  const pa=C[1].a-.2,pb=C[1].b+.1,al=Math.min(eBack(seg(t,pa,pa+.8),1.3),1)*(1-seg(t,pb-.4,pb));
  if(al>0.01){x.save();x.translate(W/2,640);x.scale(al,al);x.globalAlpha=Math.min(1,al*1.4);
    piece(x,rrect(-440,-290,880,560,26),'#f2e7cf');txt(x,'LAS BRAVAS DEL TRUCO',0,-236,'700 34px Fraunces','#8f4f26','center',5);
    [['espadas',1],['bastos',1],['espadas',7],['oros',7]].forEach(([p,n],i)=>{const a=(i-1.5)*.17;naipe(x,(i-1.5)*188,18+Math.abs(i-1.5)*14,170,262,a,p,n)});
    x.restore()}
  labelCard(x,t,sc);
}
