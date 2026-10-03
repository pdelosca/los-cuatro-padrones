const W=1080,H=1920,DUR=158;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const eIO=u=>{u=clamp(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2};
const eO=u=>1-Math.pow(1-clamp(u),3);
const eSin=u=>.5-.5*Math.cos(Math.PI*clamp(u));
const eBack=(u,s=1.7)=>{u=clamp(u);return 1+(s+1)*Math.pow(u-1,3)+s*Math.pow(u-1,2)};
function rng(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const hash=(a,b,c)=>{let h=(a*374761393+b*668265263+c*2147483647)>>>0;h=((h^(h>>>13))*1274126177)>>>0;return(h>>>0)/4294967296};
const mk=(w=W,h=H)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const shade=(h,k)=>{const A=hex(h);return`rgb(${A.map(v=>Math.round(clamp(v*k,0,255))).join(',')})`};
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return`rgb(${A.map((v,i)=>Math.round(lerp(v,B[i],t))).join(',')})`};
const S=mk(),sx=S.getContext('2d'),S2=mk(),sx2=S2.getContext('2d');
let GEO=null,P=null;
function prepGeo(){
  P={deps:GEO.deps.map(d=>({c:d.c,p:new Path2D(d.d)})),borde:new Path2D(GEO.borde),rios:GEO.rios.map(d=>new Path2D(d))};
  const pad=P.deps.filter(d=>d.c.includes('padron'));P.fl=pad[2];P.fl.d=GEO.deps.filter(d=>d.c.includes('padron'))[2].d;
  P.bordePts=[...GEO.borde.matchAll(/([\d.]+) ([\d.]+)/g)].map(m=>[+m[1],+m[2]]);
  P.flPts=[...P.fl.d.matchAll(/([\d.]+) ([\d.]+)/g)].map(m=>[+m[1],+m[2]]);
}
function txt(x,s,px,py,font,color,align='left',ls=0){
  x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';
  if('letterSpacing' in x)x.letterSpacing=ls+'px';x.fillText(s,px,py);if('letterSpacing' in x)x.letterSpacing='0px';
}
// bloque de texto que aparece y se va
function blockAlpha(t,a,b,fi=.5,fo=.4){return Math.min(eO(seg(t,a,a+fi)),1-seg(t,b-fo,b))}

