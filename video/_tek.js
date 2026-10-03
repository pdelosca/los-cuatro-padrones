// ═══════════════════ ESTILO 8 · TEK ÇİZGİ (una sola línea) ═══════════════════
const TPAPER='#f3eee4',TINK='#1e1c19',TACC='#c4502f',HY=1040,TN=2600,X0=-80,X1=1160;
class Path{
  constructor(){this.p=[]}
  M(x,y){this.p.push([x,y]);return this}
  L(x,y,n){const[a,b]=this.p[this.p.length-1];n=n||Math.max(2,Math.ceil(Math.hypot(x-a,y-b)/4));for(let i=1;i<=n;i++)this.p.push([lerp(a,x,i/n),lerp(b,y,i/n)]);return this}
  A(cx,cy,rx,ry,a0,a1,n){n=n||Math.max(8,Math.ceil(Math.abs(a1-a0)*Math.max(rx,ry)/4));for(let i=0;i<=n;i++){const a=lerp(a0,a1,i/n);this.p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}return this}
  S(pts,n=16){const Pp=this.p.length?[this.p[this.p.length-1],...pts]:pts;if(!this.p.length)this.p.push(Pp[0]);
    for(let i=0;i<Pp.length-1;i++){const p0=Pp[Math.max(0,i-1)],p1=Pp[i],p2=Pp[i+1],p3=Pp[Math.min(Pp.length-1,i+2)];
      const d=(a,b)=>Math.pow(Math.hypot(b[0]-a[0],b[1]-a[1])||1e-3,.5);
      const t0=0,t1=t0+d(p0,p1),t2=t1+d(p1,p2),t3=t2+d(p2,p3);
      for(let k=1;k<=n;k++){const t=lerp(t1,t2,k/n);
        const A1=p0.map((v,j)=>(t1-t)/(t1-t0)*v+(t-t0)/(t1-t0)*p1[j]),A2=p1.map((v,j)=>(t2-t)/(t2-t1)*v+(t-t1)/(t2-t1)*p2[j]),A3=p2.map((v,j)=>(t3-t)/(t3-t2)*v+(t-t2)/(t3-t2)*p3[j]);
        const B1=A1.map((v,j)=>(t2-t)/(t2-t0)*v+(t-t0)/(t2-t0)*A2[j]),B2=A2.map((v,j)=>(t3-t)/(t3-t1)*v+(t-t1)/(t3-t1)*A3[j]);
        this.p.push(B1.map((v,j)=>(t2-t)/(t2-t1)*v+(t-t1)/(t2-t1)*B2[j]))}}return this}
  done(){this.cum=[0];for(let i=1;i<this.p.length;i++)this.cum.push(this.cum[i-1]+Math.hypot(this.p[i][0]-this.p[i-1][0],this.p[i][1]-this.p[i-1][1]));this.len=this.cum[this.cum.length-1];return this}
  at(s){s=clamp(s,0,this.len);let lo=0,hi=this.cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(this.cum[m]<s)lo=m;else hi=m}
    const f=(s-this.cum[lo])/((this.cum[hi]-this.cum[lo])||1),a=this.p[lo],b=this.p[hi];return{x:lerp(a[0],b[0],f),y:lerp(a[1],b[1],f)}}
  resample(N){this.done();const o=new Path();for(let i=0;i<N;i++){const a=this.at(this.len*i/(N-1));o.p.push([a.x,a.y])}return o.done()}
}
const Pn=()=>new Path();
const NI=520,NB=1560,NO=TN-NI-NB;
function tekBuild(a,b,body){ // a: x de entrada, b: x de salida, body: Path
  const A=Pn().M(X0,HY).L(a,HY).resample(NI),O=Pn().M(b,HY).L(X1,HY).resample(NO),B=body.resample(NB);
  const r=new Path();r.p=[...A.p,...B.p,...O.p];return r.done();
}
const CIR=(p,cx,cy,r,a0,turns=1)=>p.A(cx,cy,r,r,a0,a0+Math.PI*2*turns);
