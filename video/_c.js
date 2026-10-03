
// ═══════════════ ESTILO 10 · KARAKALEM: escenas ═══════════════
// leyendas a mano; la última línea nunca pasa de 1690 px
function lpCaps(g,t,C){
  C.forEach(c=>{
    const al=blockAlpha(t,c.a,c.b);if(al<=0)return;
    const size=c.s,lh=size+16,y0=Math.min(1530,1690-(c.l.length-1)*lh);
    g.save();g.globalAlpha=al;
    c.l.forEach((s,i)=>hand(g,s,W/2,y0+i*lh,size,seg(t,c.a+i*.3,c.a+i*.3+.7),'rgba(34,31,27,','center'));
    g.restore()});
}
function lpEscritura(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  docSheet(gx,W/2,770,820,980,seg(t,.2,2.2),3,t);
  hand(gx,'ESCRITURA',W/2,400,76,seg(t,1.8,3.0),GRAPH,'center');
  [[470,0],[540,1],[610,2]].forEach(([y,i])=>squiggle(gx,170,y,910,seg(t,2.4+i*.3,3.4+i*.3),i+5,t,5));
  const m0=C[0].a+.6;
  pencil(gx,rectPts(300,700,480,330),seg(t,m0,m0+1.6),3,.85,20,t);
  hand(gx,'Yí',W/2,682,52,seg(t,m0+1.2,m0+1.9),RED_P,'center');hand(gx,'Sarandí',800,880,46,seg(t,m0+1.5,m0+2.3),RED_P,'left');hand(gx,'Marincho',280,880,44,seg(t,m0+1.8,m0+2.6),RED_P,'right');
  hand(gx,'el campo de Miguel',W/2,880,56,seg(t,m0+2.2,m0+3.4),GRAPH,'center');
  [['1810',300,0],['1815',540,1],['1821',780,2]].forEach(([y,cx,i])=>{const t0=C[1].a+.6+i*1.1,u=seg(t,t0,t0+.9);if(u<=0)return;hand(gx,y,cx,1190,70,seg(t,t0,t0+.5),RED_P,'center');circleHand(gx,cx,1170,72,eO(u),i*3+1,t)});
  pencilFinish(x);lpCaps(x,t,C);
}
function lpPapeles(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  const docs=[{a:C[0].a-.4,b:C[0].b,title:'6 de mayo de 1840',key:null,mark:null},
    {a:C[1].a-.4,b:C[1].b,title:'20 de mayo de 1840',key:'«la única autoridad»',mark:'ACTA'},
    {a:C[2].a-.4,b:C[3].b,title:'Agosto de 1864',key:'«respetar la vida»',mark:'FIRMADO'}];
  docs.forEach((d,i)=>{if(t<d.a||t>d.b+.4)return;const lt=t-d.a,fo=1-seg(t,d.b,d.b+.4);gx.save();gx.globalAlpha=fo;
    docSheet(gx,W/2,760,820,860,seg(lt,0,1.2),10+i,t,(i%2?.015:-.015));
    hand(gx,d.title,W/2,430,66,seg(lt,.8,1.8),RED_P,'center');
    [[520,0],[590,1],[660,2],[730,3]].forEach(([y,k])=>squiggle(gx,190,y,890-k*60,seg(lt,1.2+k*.3,2.0+k*.3),30+i*5+k,t,5));
    if(d.key)hand(gx,d.key,W/2,860,70,seg(lt,2.2,3.4),RED_P,'center');
    if(d.mark){const u=seg(lt,3.0,3.7);if(u>0){gx.save();gx.translate(770,1090);gx.rotate(-.2);circleHand(gx,0,0,96,eO(u),i+20,t);hand(gx,d.mark,0,12,d.mark.length>4?38:56,seg(lt,3.1,3.8),RED_P,'center');gx.restore()}}
    gx.restore()});
  pencilFinish(x);lpCaps(x,t,C);
}
function lpRuta(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  const MS=3.4,MC=[540,820],toS=p=>[MC[0]+(p[0]-190)*MS,MC[1]+(p[1]-470)*MS];
  gx.save();gx.setTransform(MS,0,0,MS,MC[0]-190*MS,MC[1]-470*MS);gx.globalAlpha=.25*eO(seg(t,0,1.4));gx.strokeStyle=GRAPH+'1)';gx.lineWidth=.9/MS;for(const d of P.deps)gx.stroke(d.p);gx.restore();
  pencil(gx,P.bordePts.map(toS),eIO(seg(t,.2,2.4)),3.2,.92,5,t);
  const pts=[['el Sarandí',[186,421],'right'],['Trinidad',[158.4,412.5],'left'],['Durazno',[194.6,396.6],'right'],['Villa Colón',[214,556],'left']].map(([n,p,al])=>[n,toS(p),al]);
  const k0=C[0].a,k1=k0+3.0;
  const seq=[[pts[0],pts[1],k0+.2,k0+1.4],[pts[1],pts[2],k0+1.6,k0+2.8],[pts[2],pts[3],k1-.2,k1+2.2]];
  seq.forEach(([a,b,t0,t1],i)=>{const c=[lerp(a[1][0],b[1][0],.5)-70*(i===2?-1:1),lerp(a[1][1],b[1][1],.5)];const r=bezPts(a[1],b[1],c,40);const u=eIO(seg(t,t0,t1));
    for(let k=0;k<r.length-1;k++){if(k/(r.length-1)>u)break;if(k%3!==2)pencil(gx,[r[k],r[k+1]],1,3,.85,100+i*50+k,t,RED_P)}});
  const tts=[k0,k0+1.3,k0+2.6,k1+2.0];
  pts.forEach(([n,p,al],i)=>{const tt=tts[i],u=seg(t,tt,tt+.8);if(u<=0)return;gx.save();gx.globalAlpha=eO(u);gx.fillStyle=RED_P+'1)';gx.beginPath();gx.arc(p[0],p[1],10,0,7);gx.fill();gx.restore();
    const dx=i===0?-8:(al==='right'?26:-26),yy=i===0?p[1]+58:p[1]+8;hand(gx,n,p[0]+dx,yy,52,seg(t,tt+.1,tt+1),GRAPH,i===0?'left':(al==='right'?'left':'right'))});
  if(t>k1+2.4){const p=pts[3][1];hand(gx,'la chacra del Pantanoso',p[0]-20,p[1]+86,50,seg(t,k1+2.5,k1+3.8),GRAPH,'center')}
  pencilFinish(x);lpCaps(x,t,C);
}
const CHAIN=[['Miguel','trastatarabuelo de Mario','1753'],['Felipe Pascual','tatarabuelo de Mario','1800'],['Sandalio','bisabuelo de Mario','h. 1836'],['Delmiro','abuelo de Mario','1867'],['Eloy','padre de Mario','1920'],['Mario','','' ],['Pablo','hijo de Mario',''],['Facundo y Camila','nietos de Mario','']];
function lpArbol(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  const y0=340,gap=150,pos=CHAIN.map((_,i)=>[i%2?490:250,y0+i*gap]);
  for(let i=0;i<7;i++){const tt=1.0+i*1.25,u=seg(t,tt+.6,tt+1.2);if(u>0)pencil(gx,lin([pos[i][0],pos[i][1]+18],[pos[i+1][0],pos[i+1][1]-48],20),u,3.4,.85,40+i,t)}
  CHAIN.forEach(([n,rel,yr],i)=>{const tt=1.0+i*1.25,u=seg(t,tt,tt+.9);if(u<=0)return;const [px,py]=pos[i];
    const mario=i===5;circleHand(gx,px,py-22,mario?78:62,eO(u),i+3,t,mario?RED_P:GRAPH);
    hand(gx,n,px+96,py-8,mario?78:64,seg(t,tt+.1,tt+1.0),mario?RED_P:GRAPH,'left');
    if(rel)hand(gx,rel,px+96,py+34,40,seg(t,tt+.4,tt+1.3),GRAPH,'left');
    if(yr)hand(gx,yr,px-96,py-8,46,seg(t,tt+.3,tt+1.1),RED_P,'right')});
  pencilFinish(x);lpCaps(x,t,C);
  const ta=C[0].b+.3,a=eO(seg(t,ta,ta+1.2));
  if(a>0){x.save();x.globalAlpha=a;x.fillStyle='rgba(238,235,227,.96)';x.fillRect(0,0,W,H);
    txt(x,'LOS DE LOS CAMPOS',W/2+4,740,'600 36px "Cormorant Garamond"','#b84a2c','center',10);
    txt(x,'De Miguel a Mario',W/2,860,'900 96px Fraunces','#2c2018','center');
    txt(x,'y a los que siguen.',W/2,970,'italic 500 80px "Cormorant Garamond"','#2c2018','center');
    x.fillStyle='#b84a2c';x.fillRect(W/2-120,1030,240,6);
    txt(x,'Para Mario y toda la familia.',W/2,1150,'italic 500 58px "Cormorant Garamond"','#2c2018','center');
    txt(x,'pdelosca.github.io/los-cuatro-padrones',W/2,1240,'500 32px "Cormorant Garamond"','rgba(44,32,24,.75)','center',2);x.restore()}
}
// ═══════════════ definición de las escenas (texto = lo único que se escribe) ═══════════════
const chip=(s,w)=>({chip:s,chipW:w});
SCENES.push(
 {id:'linea-apertura',style:'tek',link:-1,lead:2.0,tail:2.4,cfg:{icons:['wheel','mojon'],morphAt:[2]},draw:tekDraw,
  caps:[{l:['Para Mario','y su familia.'],s:70},{l:['Eloy de los Campos,','el padre de Mario,','*fue chofer.*'],s:70},{l:['Su apellido ya figuraba','en una *escritura de campo*','de 1810.'],s:66},{l:['Esta es la cadena','que las une.'],s:76}]},
 {id:'miguel-mar',style:'pc',link:0,lead:1.2,tail:1.2,...chip('MIGUEL DE LOS CAMPOS',560),sub:'trastatarabuelo de Mario',draw:pcMiguel,
  caps:[{l:['1753. Nace en Las Carreras,','una aldea de Vizcaya.'],s:50},{l:['Cruza el océano.'],s:60},{l:['Se casa en Las Piedras','con Clara Chavarría.'],s:52}]},
 {id:'miguel-campo',style:'pc',link:0,lead:1.2,tail:1.0,...chip('MIGUEL DE LOS CAMPOS',560),sub:'trastatarabuelo de Mario',draw:pcCampo,
  caps:[{l:['Consigue un campo','en lo que hoy es Flores.'],s:50},{l:['Entre el Sarandí,','el Marincho y el Yí.'],s:54}]},
 {id:'escritura',style:'lp',link:0,lead:1.6,tail:1.2,draw:lpEscritura,
  caps:[{l:['La escritura de campo','de Miguel.'],s:66},{l:['Tres gobiernos distintos','se la ratifican:','1810, 1815 y 1821.'],s:62}]},
 {id:'felipe-plaza',style:'pc',link:1,lead:1.2,tail:1.0,...chip('FELIPE PASCUAL DE LOS CAMPOS',720),sub:'tatarabuelo de Mario',draw:pcPlaza,
  caps:[{l:['1830. Trinidad jura','la Constitución.'],s:56},{l:['Felipe, juez de paz,','les toma juramento.'],s:52},{l:['Ese año lo eligen diputado.'],s:50}]},
 {id:'felipe-papeles',style:'lp',link:1,lead:1.6,tail:1.2,draw:lpPapeles,
  caps:[{l:['1840. Dos Flores entran','armados al Juzgado.','Según Felipe, le apuntaron.'],s:62},{l:['Dos semanas después firman:','Pascual es «la única autoridad».'],s:60},{l:['1864. Trinidad, sitiada.','Felipe negocia y consigue','un papel firmado.'],s:62},{l:['La familia lo guarda','49 años.'],s:66}]},
 {id:'sandalio-flores',style:'pc',link:2,lead:1.2,tail:1.0,...chip('SANDALIO DE LOS CAMPOS',600),sub:'bisabuelo de Mario',draw:pcFlores,
  caps:[{l:['1885. Nace el departamento','de Flores, con el apellido','de Venancio Flores.'],s:48},{l:['Sandalio es uno de los seis','que lo gobiernan al principio.'],s:48},{l:['Su hermano Rolando','es el primer jefe político.'],s:50}]},
 {id:'delmiro',style:'pc',link:3,lead:1.2,tail:1.2,...chip('DELMIRO DE LOS CAMPOS',600),sub:'abuelo de Mario',draw:pcDelmiro,
  caps:[{l:['Delmiro vuelve al campo:','el Sarandí, el mismo río','de la escritura.'],s:48},{l:['En 1896 se casa con Luisa Soma.','Tienen doce hijos.'],s:48},{l:['Al menos siete mueren','antes que Eloy.'],s:54}]},
 {id:'ruta-villa-colon',style:'lp',link:3,lead:1.6,tail:1.2,draw:lpRuta,
  caps:[{l:['Del Sarandí a Trinidad,','Durazno y Villa Colón:','la chacra que Felipe vendió en 1848.'],s:58}]},
 {id:'eloy-nace',style:'tek',link:4,lead:2.0,tail:2.0,cfg:{icons:['house']},draw:tekDraw,
  caps:[{l:['Eloy nace en Trinidad,','el 9 de enero de 1920.'],s:70},{l:['Según la familia, a los ocho','dejó la escuela y trabajó','en un hotel de Durazno.'],s:62}]},
 {id:'eloy-chofer',style:'pc',link:4,lead:1.2,tail:1.2,...chip('ELOY',200),sub:'padre de Mario',draw:pcChofer,
  caps:[{l:['De grande fue chofer.'],s:60},{l:['En el acta de su boda','figura así: chofer, de Trinidad.'],s:50}]},
 {id:'eloy-mosaicos',style:'pc',link:4,lead:1.4,tail:1.2,...chip('ELOY',200),sub:'padre de Mario',draw:pcMosaicos,
  caps:[{l:['También trabajó en','Mosaicos Rivas y Cía.'],s:56},{l:['Una fábrica de baldosas y pisos','de imitación mármol, con aviso','en la prensa de la época.'],s:46}]},
 {id:'eloy-ciclista',style:'pc',link:4,lead:1.4,tail:1.2,...chip('ELOY',200),sub:'padre de Mario',draw:pcCiclista,
  caps:[{l:['Y corrió en bicicleta','para el Club Olimpia, en Colón.'],s:50},{l:['El club ganaba carreras','y campeonatos de ciclismo.'],s:52}]},
 {id:'eloy-boda',style:'tek',link:4,lead:2.0,tail:2.2,cfg:{icons:['rings']},draw:tekDraw,
  caps:[{l:['*26 de enero de 1946.*','Eloy se casa con Reina,','la muchacha de Fraile Muerto.'],s:60},{l:['Tienen dos hijos:','Walter y *Mario.*'],s:72}]},
 {id:'eloy-sotano',style:'pc',link:4,lead:1.2,tail:1.2,...chip('ELOY',200),sub:'padre de Mario',draw:pcSotano,
  caps:[{l:['Magallanes 1973. Los viernes,','Eloy se juntaba con amigos','en un sótano de la esquina.'],s:46},{l:['Asado con carbón bajo tierra.','Truco, sí. Tute cabrero, no.'],s:48},{l:['Así lo cuenta la familia.'],s:54}]},
 {id:'eloy-final',style:'tek',link:4,lead:2.0,tail:2.4,cfg:{icons:['candle']},draw:tekDraw,
  caps:[{l:['Eloy muere el *9 de enero de 2000,*','el día que cumplía ochenta años.'],s:60}]},
 {id:'arbol',style:'lp',link:7,lead:11.0,tail:7.2,draw:lpArbol,
  caps:[{l:['Una cadena de padres a hijos,','de un vizcaíno a Facundo y Camila.'],s:60,at:11.0}]}
);
const LINKROLE=SCENES;
// ═══════════════ indicador de la cadena (siempre visible) ═══════════════
function chainBar(x,T,sc){
  const cur=sc.link;if(T<1.2)return;
  const a=eO(seg(T,1.0,2.0));
  const nodes=CHAIN.map((_,i)=>[110+i*(W-220)/7,138]);
  x.save();x.globalAlpha=a;
  x.fillStyle='rgba(247,240,224,.9)';x.beginPath();x.roundRect(36,86,W-72,172,24);x.fill();
  x.strokeStyle='rgba(60,45,30,.25)';x.lineWidth=2;x.stroke();
  x.lineCap='round';
  for(let i=0;i<7;i++){x.strokeStyle='rgba(60,45,30,.35)';x.lineWidth=4;x.beginPath();x.moveTo(nodes[i][0]+16,138);x.lineTo(nodes[i+1][0]-16,138);x.stroke();
    if(cur>i||cur===7){x.strokeStyle='#b84a2c';x.lineWidth=5;x.beginPath();x.moveTo(nodes[i][0]+16,138);x.lineTo(nodes[i+1][0]-16,138);x.stroke()}}
  nodes.forEach(([px,py],i)=>{const on=cur===7||i<=cur,now=i===cur||(cur===7&&i===5);
    x.beginPath();x.arc(px,py,now?17:12,0,7);x.fillStyle=on?'#b84a2c':'#f7f0e0';x.fill();x.strokeStyle='#3c2d1e';x.lineWidth=3;x.stroke();
    if(now){x.strokeStyle='rgba(184,74,44,.5)';x.lineWidth=3;x.beginPath();x.arc(px,py,26+(T*1.2%1)*10,0,7);x.stroke()}});
  const names=['Miguel','Felipe','Sandalio','Delmiro','Eloy','Mario','Pablo','F. y C.'];
  nodes.forEach(([px],i)=>{const on=cur===7||i<=cur,now=i===cur||(cur===7&&i===5);x.globalAlpha=a*(on?1:.55);txt(x,names[i],px,196,`${now?800:700} ${now?33:30}px "Cormorant Garamond"`,'#2c2018','center')});
  // línea de relación del eslabón actual
  const rel=cur===7?'Mario, Pablo, Facundo y Camila':(cur>=0?`${CHAIN[cur][0]} · ${CHAIN[cur][1]}`:'');
  if(rel){x.globalAlpha=a;txt(x,rel,W/2,238,'italic 600 32px "Cormorant Garamond"','#8f4f26','center')}
  x.restore();
}
// ═══════════════ render ═══════════════
function drawScene(x,sc,t){x.save();x.globalAlpha=1;x.globalCompositeOperation='source-over';sc.draw(x,t,sc.dur,sc);
  if(sc.style==='pc'){x.globalCompositeOperation='multiply';x.globalAlpha=.3;x.fillStyle='#fff1dc';x.fillRect(0,0,W,H)}x.restore()}
function render(T){
  const sc=sceneAtT(T),local=T-sc.a,idx=SCENES.indexOf(sc);
  if(idx>0&&local<.6){
    const prev=SCENES[idx-1];sx2.clearRect(0,0,W,H);drawScene(sx2,prev,prev.dur-.001);
    sx.clearRect(0,0,W,H);drawScene(sx,sc,local);
    const u=eIO(local/.6),off=(1-u)*W;
    ctx.drawImage(S2,0,0);ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=40;ctx.shadowOffsetX=-12;ctx.drawImage(S,off,0);ctx.restore();
  } else {sx.clearRect(0,0,W,H);drawScene(sx,sc,local);ctx.drawImage(S,0,0)}
  chainBar(ctx,T,sc);
  const fi=1-eO(T/.6),fo=eO((T-(DUR-.8))/.8),f=Math.max(fi,fo);if(f>0){ctx.fillStyle=`rgba(238,235,227,${f})`;ctx.fillRect(0,0,W,H)}
}
window.render=render;
// auditoría: línea de tiempo, lectura, márgenes y color
window.AUDIT=()=>({dur:DUR,lint:LINT.slice(),scenes:SCENES.map(s=>({id:s.id,style:s.style,link:s.link,a:+s.a.toFixed(2),b:+s.b.toFixed(2),caps:s.C.map(c=>({a:+(s.a+c.a).toFixed(2),b:+(s.a+c.b).toFixed(2),d:+(c.b-c.a).toFixed(3),words:c.words,size:c.s,need:+c.need.toFixed(3)}))}))});
window.COLOR=()=>{const out=[];const m=mk(54,96),mx=m.getContext('2d');
  const stat=(T)=>{render(T);mx.drawImage(cv,0,0,54,96);const d=mx.getImageData(0,0,54,96).data;let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];n++}r/=n;g/=n;b/=n;return{r:Math.round(r),g:Math.round(g),b:Math.round(b),L:Math.round(.2126*r+.7152*g+.0722*b)}};
  SCENES.forEach(s=>out.push({id:s.id,first:stat(s.a+.7),last:stat(s.b-.5)}));return out};
window.ready=(async()=>{
  const fs=['700 40px Fraunces','900 40px Fraunces','italic 500 60px "Cormorant Garamond"','500 60px Caveat','600 22px "Cormorant Garamond"','800 30px "Cormorant Garamond"'];
  await Promise.all(fs.map(f=>document.fonts.load(f,'ÁÉÍÓÚáéíóúñÑ¡¿·—«»0123456789ABC')));await document.fonts.ready;
  GEO=await (await fetch('geo.json')).json();prepGeo();
  buildTekPaper();tekIcons();buildPCTex();buildPencilPaper();buildTimeline();
  window.READY=true;return true})();
</script>
