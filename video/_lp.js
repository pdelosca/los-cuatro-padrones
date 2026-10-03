// ═══════════════════ ESTILO 10 · KARAKALEM (lápiz) ═══════════════════
const PAPERCV=mk(),TOOTH=mk(),GR=mk(),gx=GR.getContext('2d');
const GRAPH='rgba(38,36,32,',RED_P='rgba(176,64,44,';
function buildPencilPaper(){const c=PAPERCV.getContext('2d');c.fillStyle='#eeebe3';c.fillRect(0,0,W,H);
  const r=rng(3),low=mk(60,107),lc=low.getContext('2d'),li=lc.createImageData(60,107);
  for(let i=0;i<li.data.length;i+=4){const v=128+(r()-.5)*60;li.data[i]=li.data[i+1]=li.data[i+2]=v;li.data[i+3]=255}lc.putImageData(li,0,0);
  const big=mk(),bc=big.getContext('2d');bc.imageSmoothingQuality='high';bc.drawImage(low,0,0,W,H);
  const bd=bc.getImageData(0,0,W,H).data,id=c.getImageData(0,0,W,H),d=id.data;
  for(let i=0;i<d.length;i+=4){const n=(r()-.5)*14+(bd[i]-128)*.12;d[i]+=n;d[i+1]+=n;d[i+2]+=n*.9}c.putImageData(id,0,0);
  const v=c.createRadialGradient(W/2,H/2,500,W/2,H/2,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(50,40,30,.18)');c.fillStyle=v;c.fillRect(0,0,W,H);
  const tc=TOOTH.getContext('2d'),ti=tc.createImageData(W,H),td=ti.data,r2=rng(11);
  for(let i=0;i<td.length;i+=4){const k=i/4,xx=k%W,yy=(k/W)|0,fib=Math.sin(xx*.9+yy*.35)*.5+.5;td[i]=td[i+1]=td[i+2]=0;td[i+3]=clamp(.42+r2()*.58*(.8+fib*.2)+(bd[i]-128)/400,0,1)*255}tc.putImageData(ti,0,0)}
function pencil(g,pts,u,w,a,seed,t,col=GRAPH){
  const n=Math.min(pts.length-1,Math.floor((pts.length-1)*u));if(n<2)return;const fb=Math.floor(t*12);
  for(let pass=0;pass<2;pass++){g.beginPath();for(let i=0;i<=n;i++){const p=pts[i],j=(hash(i,seed+pass*7,fb)-.5)*2.4,k=(hash(i,seed+pass*7+3,fb)-.5)*2.4;i?g.lineTo(p[0]+j,p[1]+k):g.moveTo(p[0]+j,p[1]+k)}
    g.strokeStyle=col+(a*(pass?.55:1))+')';g.lineWidth=w*(pass?.7:1);g.lineJoin='round';g.lineCap='round';g.stroke()}
}
const lin=(a,b,n=24)=>{const o=[];for(let i=0;i<=n;i++)o.push([lerp(a[0],b[0],i/n),lerp(a[1],b[1],i/n)]);return o};
const rectPts=(x0,y0,w,h)=>[...lin([x0,y0],[x0+w,y0]),...lin([x0+w,y0],[x0+w,y0+h]),...lin([x0+w,y0+h],[x0,y0+h]),...lin([x0,y0+h],[x0,y0])];
const bezPts=(a,b,c,n=60)=>{const o=[];for(let i=0;i<=n;i++){const u=i/n;o.push([(1-u)*(1-u)*a[0]+2*(1-u)*u*c[0]+u*u*b[0],(1-u)*(1-u)*a[1]+2*(1-u)*u*c[1]+u*u*b[1]])}return o};
function hand(g,s,px,py,size,u,col=GRAPH,align='left'){
  g.save();g.font=`500 ${size}px Caveat`;const w=g.measureText(s).width,x0=align==='center'?px-w/2:align==='right'?px-w:px;
  g.beginPath();g.rect(x0-8,py-size,(w+16)*clamp(u),size*1.5);g.clip();g.fillStyle=col+'.92)';g.textAlign='left';g.fillText(s,x0,py);g.restore()}
function circleHand(g,cx,cy,r,u,seed,t,col=RED_P){const pts=[];for(let i=0;i<=44;i++){const a=-1.2+i/44*Math.PI*2.15,e=1+.04*Math.sin(i*.3+seed);pts.push([cx+Math.cos(a)*r*e,cy+Math.sin(a)*r*e*.82])}pencil(g,pts,u,3,.8,seed,t,col)}
function squiggle(g,x0,y,x1,u,seed,t,amp=5,col=GRAPH,a=.7){const pts=[];for(let i=0;i<=40;i++){const px=lerp(x0,x1,i/40);pts.push([px,y+Math.sin(i*1.3+seed)*amp*(hash(i,seed,1)+.3)])}pencil(g,pts,u,2.4,a,seed,t,col)}
function pencilCaps(g,t,caps,y0=1420,size=64){
  caps.forEach(([a,b,ls])=>{if(t<a||t>b)return;const fo=1-seg(t,b-.45,b);g.save();g.globalAlpha=fo;ls.forEach((s,i)=>hand(g,s,W/2,y0+i*(size+14),size,seg(t,a+i*.5,a+i*.5+1.1),GRAPH,'center'));g.restore()});
}
function pencilFinish(x){x.drawImage(PAPERCV,0,0);const mc=mk(),mx=mc.getContext('2d');mx.drawImage(GR,0,0);mx.globalCompositeOperation='destination-in';mx.drawImage(TOOTH,0,0);x.globalCompositeOperation='multiply';x.drawImage(mc,0,0);x.globalCompositeOperation='source-over'}
function docSheet(g,cx,cy,w,h,u,seed,t,rot=0){ // hoja de papel dibujada a lápiz
  g.save();g.translate(cx,cy);g.rotate(rot);g.translate(-w/2,-h/2);
  const o=rectPts(0,0,w,h);pencil(g,o,eIO(u),3.2,.9,seed,t);
  const o2=rectPts(10,10,w,h);pencil(g,o2,eIO(u),1.6,.35,seed+5,t);g.restore()}
