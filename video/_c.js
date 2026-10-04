
// ═══════════════ ESTILO 10 · KARAKALEM: escenas ═══════════════
// leyendas a mano; la última línea nunca pasa de 1690 px
function lpCaps(g,t,C){
  C.forEach(c=>{
    const al=blockAlpha(t,c.a,c.b);if(al<=0)return;
    const size=c.s,lh=size+16,y0=Math.min(1530,1690-(c.l.length-1)*lh);
    g.save();g.globalAlpha=al;
    c.l.forEach((s,i)=>{const u=c.a<=.2?1:seg(t,c.a+i*.3,c.a+i*.3+.7);hand(g,s,W/2,y0+i*lh,size,u,'rgba(30,27,23,','center');hand(g,s,W/2+.9,y0+i*lh,size,u,'rgba(30,27,23,','center')});
    g.restore()});
}
function lpEscritura(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  docSheet(gx,W/2,770,820,980,seg(t,.2,1.8),3,t);
  hand(gx,'ESCRITURA',W/2,400,76,seg(t,.8,2.2),GRAPH,'center');
  [[470,0],[540,1],[610,2]].forEach(([y,i])=>squiggle(gx,170,y,910,seg(t,1.2+i*.3,2.2+i*.3),i+5,t,5));
  const m0=C[1].a;
  pencil(gx,rectPts(300,700,480,330),seg(t,m0,m0+1.6),3,.85,20,t);
  hand(gx,'Yí',W/2,682,52,seg(t,m0+1.0,m0+1.7),RED_P,'center');hand(gx,'Sarandí',800,880,46,seg(t,m0+1.3,m0+2.1),RED_P,'left');hand(gx,'Marincho',280,880,44,seg(t,m0+1.6,m0+2.4),RED_P,'right');
  hand(gx,'el campo de Miguel',W/2,880,56,seg(t,m0+2.0,m0+3.2),GRAPH,'center');
  [['1810',300,0],['1815',540,1],['1821',780,2]].forEach(([y,cx,i])=>{const t0=C[2].a+.6+i*1.2,u=seg(t,t0,t0+.9);if(u<=0)return;hand(gx,y,cx,1190,70,seg(t,t0,t0+.5),RED_P,'center');circleHand(gx,cx,1170,72,eO(u),i*3+1,t)});
  pencilFinish(x);lpCaps(x,t,C);
}
function lpPapeles(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  const docs=[{a:C[0].a-.4,b:C[0].b,title:'6 de mayo de 1840',key:null,mark:null},
    {a:C[1].a-.4,b:C[1].b,title:'20 de mayo de 1840',key:'«la única autoridad»',mark:'ACTA'},
    {a:C[2].a-.4,b:C[2].b,title:'Agosto de 1864',key:'«respetar la vida»',mark:'FIRMADO'}];
  docs.forEach((d,i)=>{if(t<d.a||t>d.b+.4)return;const lt=t-d.a,fo=1-seg(t,d.b,d.b+.4);gx.save();gx.globalAlpha=fo;
    docSheet(gx,W/2,760,820,860,seg(lt,0,1.0),10+i,t,(i%2?.015:-.015));
    [[520,0],[590,1],[660,2],[730,3]].forEach(([y,k])=>squiggle(gx,190,y,890-k*60,seg(lt,.8+k*.3,1.6+k*.3),30+i*5+k,t,5));
    if(d.mark){const u=seg(lt,2.6,3.3);if(u>0){gx.save();gx.translate(770,1090);gx.rotate(-.2);circleHand(gx,0,0,96,eO(u),i+20,t);gx.restore()}}
    gx.restore()});
  pencilFinish(x);
  // títulos y frases clave, en tinta firme (no se pierden en el grano del lápiz)
  docs.forEach((d,i)=>{if(t<d.a||t>d.b+.4)return;const lt=t-d.a,fo=1-seg(t,d.b,d.b+.4);x.save();x.globalAlpha=fo;
    hand(x,d.title,W/2,430,70,seg(lt,.5,1.4),'rgba(140,36,24,','center');hand(x,d.title,W/2+.9,430,70,seg(lt,.5,1.4),'rgba(140,36,24,','center');
    if(d.key){hand(x,d.key,W/2,860,74,seg(lt,1.6,2.8),'rgba(140,36,24,','center');hand(x,d.key,W/2+.9,860,74,seg(lt,1.6,2.8),'rgba(140,36,24,','center')}
    if(d.mark){const u=seg(lt,2.7,3.4);if(u>0){x.save();x.translate(770,1090);x.rotate(-.2);hand(x,d.mark,0,12,d.mark.length>4?40:58,u,'rgba(140,36,24,','center');x.restore()}}
    x.restore()});
  lpCaps(x,t,C);
}
// ── el puente: la escritura de 1810 y el acta de 1946 llevan el mismo apellido
function lpPuente(x,t,dur,sc){
  const C=sc.C;gx.clearRect(0,0,W,H);
  docSheet(gx,270,700,480,620,seg(t,.2,1.4),61,t,-.03);docSheet(gx,810,700,480,620,seg(t,.8,2.0),62,t,.03);
  [[560,0],[620,1],[680,2],[860,3]].forEach(([y,k])=>{squiggle(gx,60,y,470-k*30,seg(t,1.0+k*.2,1.8+k*.2),70+k,t,4);squiggle(gx,610,y,1020-k*30,seg(t,1.6+k*.2,2.4+k*.2),80+k,t,4)});
  const names=['Miguel','Felipe','Sandalio','Delmiro','Eloy'],cx0=120,cx1=960,cy=1190;
  const t3=C[2].a;
  for(let i=0;i<4;i++){const u=seg(t,t3+i*.45,t3+i*.45+.5);if(u>0)pencil(gx,lin([cx0+i*(cx1-cx0)/4+40,cy],[cx0+(i+1)*(cx1-cx0)/4-40,cy],14),u,3.8,.9,90+i,t)}
  names.forEach((n,i)=>{const u=seg(t,t3+i*.45-.2,t3+i*.45+.5);if(u>0)circleHand(gx,cx0+i*(cx1-cx0)/4,cy,i===4?48:38,eO(u),100+i,t,i===4?RED_P:GRAPH)});
  pencil(gx,bezPts([270,1030],[cx0,cy-52],[150,1100],30),seg(t,t3-.4,t3+.4),3.2,.8,120,t,RED_P);
  pencil(gx,bezPts([810,1030],[cx1,cy-60],[900,1110],30),seg(t,t3+1.6,t3+2.6),3.2,.8,121,t,RED_P);
  pencilFinish(x);
  x.save();
  const ink=(s,px,py,sz,u,col,al='center')=>{hand(x,s,px,py,sz,u,col,al);hand(x,s,px+.9,py,sz,u,col,al)};
  ink('ESCRITURA · 1810',270,450,52,seg(t,.8,1.8),'rgba(30,27,23,');ink('ACTA DE BODA · 1946',810,450,52,seg(t,1.4,2.4),'rgba(30,27,23,');
  ink('de los Campos',270,790,70,seg(t,C[0].a,C[0].a+1.0),'rgba(140,36,24,');ink('chofer',810,790,84,seg(t,C[1].a,C[1].a+1.0),'rgba(140,36,24,');
  names.forEach((n,i)=>ink(n,cx0+i*(cx1-cx0)/4,cy+100,i===4?56:50,seg(t,t3+i*.45,t3+i*.45+.6),i===4?'rgba(140,36,24,':'rgba(30,27,23,'));
  x.restore();
  lpCaps(x,t,C);
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
  const y0=410,gap=140,pos=CHAIN.map((_,i)=>[i%2?490:250,y0+i*gap]);
  for(let i=0;i<7;i++){const tt=1.0+i*1.25,u=seg(t,tt+.6,tt+1.2);if(u>0)pencil(gx,lin([pos[i][0],pos[i][1]+18],[pos[i+1][0],pos[i+1][1]-48],20),u,3.6,.9,40+i,t)}
  CHAIN.forEach(([n,rel,yr],i)=>{const tt=1.0+i*1.25,u=seg(t,tt,tt+.9);if(u<=0)return;circleHand(gx,pos[i][0],pos[i][1]-22,i===5?78:62,eO(u),i+3,t,i===5?RED_P:GRAPH)});
  pencilFinish(x);
  const ink=(s,px,py,sz,u,col,al)=>{hand(x,s,px,py,sz,u,col,al);hand(x,s,px+.8,py,sz,u,col,al)};
  CHAIN.forEach(([n,rel,yr],i)=>{const tt=1.0+i*1.25,[px,py]=pos[i],mario=i===5,K=mario?'rgba(140,36,24,':'rgba(30,27,23,';if(t<tt)return;
    ink(n,px+96,py-8,mario?80:66,seg(t,tt+.1,tt+.9),K,'left');
    if(rel)ink(rel,px+96,py+36,42,seg(t,tt+.3,tt+1.1),'rgba(70,40,20,','left');
    if(yr)ink(yr,px-96,py-8,46,seg(t,tt+.2,tt+.9),'rgba(140,36,24,','right')});
  lpCaps(x,t,C);
  const ta=C[0].b+.1,a=eO(seg(t,ta,ta+.6));
  if(a>0){x.save();x.globalAlpha=a;x.fillStyle='#eeebe3';x.fillRect(0,0,W,H);
    txt(x,'LOS DE LOS CAMPOS',W/2+4,740,'600 38px "Cormorant Garamond"','#b84a2c','center',10);
    txt(x,'De Miguel a Mario',W/2,860,'900 96px Fraunces','#2c2018','center');
    txt(x,'y a los que siguen.',W/2,970,'italic 500 82px "Cormorant Garamond"','#2c2018','center');
    x.fillStyle='#b84a2c';x.fillRect(W/2-120,1030,240,6);
    txt(x,'Para Mario y toda la familia.',W/2,1150,'italic 500 60px "Cormorant Garamond"','#2c2018','center');
    txt(x,'pdelosca.github.io/los-cuatro-padrones',W/2,1240,'500 34px "Cormorant Garamond"','rgba(44,32,24,.8)','center',2);x.restore()}
}
// ═══════════════ definición de las escenas (texto = lo único que se escribe) ═══════════════
const chip=(s,w)=>({chip:s,chipW:w});
SCENES.push(
 {id:'linea-apertura',style:'tek',link:-1,lead:2.0,tail:1.0,cfg:{icons:['wheel','mojon'],morphAt:[2],in0:-3.0,in1:3.0},draw:tekDraw,
  caps:[{l:['Para Mario','y su familia.'],s:76,at:0},{l:['Eloy de los Campos,','el padre de Mario,','*fue chofer.*'],s:72},{l:['Su apellido ya figuraba','en una *escritura de campo*','de 1810.'],s:68},{l:['Esta es la cadena','que las une.'],s:78}]},
 {id:'miguel-mar',style:'pc',link:0,lead:.8,tail:.6,...chip('MIGUEL DE LOS CAMPOS',560),sub:'trastatarabuelo de Mario',draw:pcMiguel,
  caps:[{l:['1753. Nace en Las Carreras,','una aldea de Vizcaya.'],s:52},{l:['Cruza el océano.'],s:62},{l:['Se casa en Las Piedras','con Clara Chavarría.'],s:54}]},
 {id:'escritura',style:'lp',link:0,lead:.8,tail:.6,draw:lpEscritura,
  caps:[{l:['Consigue un campo,','en lo que hoy es Flores.'],s:66},{l:['Entre el Sarandí,','el Marincho y el Yí.'],s:68},{l:['Tres gobiernos distintos','se lo ratifican:','1810, 1815 y 1821.'],s:64}]},
 {id:'felipe-plaza',style:'pc',link:1,lead:.8,tail:.6,...chip('FELIPE PASCUAL DE LOS CAMPOS',720),sub:'tatarabuelo de Mario',draw:pcPlaza,
  caps:[{l:['1830. Trinidad jura','la Constitución.'],s:58},{l:['Felipe, juez de paz,','les toma juramento.'],s:54},{l:['Ese año lo eligen diputado.'],s:52}]},
 {id:'felipe-papeles',style:'lp',link:1,lead:.8,tail:.6,draw:lpPapeles,
  caps:[{l:['1840. Dos Flores entran','armados al Juzgado.','Según Felipe, le apuntaron.'],s:62},{l:['Dos semanas después firman:','Pascual es «la única autoridad».'],s:62},{l:['1864. Trinidad, sitiada.','Felipe consigue un papel firmado,','y la familia lo guarda 49 años.'],s:60}]},
 {id:'sandalio-flores',style:'pc',link:2,lead:.8,tail:.6,...chip('SANDALIO DE LOS CAMPOS',600),sub:'bisabuelo de Mario',draw:pcFlores,
  caps:[{l:['1885. Nace el departamento','de Flores, con el apellido','de Venancio Flores.'],s:48},{l:['Sandalio, nacido hacia 1836,','es uno de los seis que lo','gobiernan al principio.'],s:48},{l:['Su hermano Rolando','es el primer jefe político.'],s:52}]},
 {id:'delmiro',style:'pc',link:3,lead:.8,tail:.8,...chip('DELMIRO DE LOS CAMPOS',600),sub:'abuelo de Mario',draw:pcDelmiro,
  caps:[{l:['Delmiro vuelve al campo:','el Sarandí, el mismo río','de la escritura.'],s:48},{l:['En 1896 se casa con Luisa Soma.','Tienen doce hijos.'],s:50},{l:['Al menos siete mueren','antes que Eloy.'],s:56}]},
 {id:'ruta-villa-colon',style:'lp',link:3,lead:.8,tail:.7,draw:lpRuta,
  caps:[{l:['Del Sarandí a Trinidad,','Durazno y Villa Colón:','la chacra que Felipe vendió en 1848.'],s:58}]},
 {id:'eloy-nace',style:'tek',link:4,lead:1.4,tail:1.0,cfg:{icons:['house']},draw:tekDraw,
  caps:[{l:['Eloy nace en Trinidad,','el 9 de enero de 1920.'],s:72},{l:['Según la familia, a los ocho','dejó la escuela y trabajó','en un hotel de Durazno.'],s:64}]},
 {id:'eloy-chofer',style:'pc',link:4,lead:.8,tail:.6,...chip('ELOY DE LOS CAMPOS',560),sub:'padre de Mario',draw:pcChofer,
  caps:[{l:['De grande fue chofer.'],s:62},{l:['En el acta de su boda','figura así: chofer, de Trinidad.'],s:52}]},
 {id:'eloy-mosaicos',style:'pc',link:4,lead:.8,tail:.6,...chip('ELOY DE LOS CAMPOS',560),sub:'padre de Mario',draw:pcMosaicos,
  caps:[{l:['También trabajó en','Mosaicos Rivas y Cía.'],s:58},{l:['Una fábrica de baldosas','y pisos de imitación mármol.'],s:54}]},
 {id:'eloy-ciclista',style:'pc',link:4,lead:.8,tail:.6,...chip('ELOY DE LOS CAMPOS',560),sub:'padre de Mario',draw:pcCiclista,
  caps:[{l:['Y corrió en bicicleta','para el Club Olimpia, en Colón.'],s:52},{l:['El club ganaba carreras','y campeonatos de ciclismo.'],s:54}]},
 {id:'eloy-boda',style:'tek',link:4,lead:1.2,tail:1.0,cfg:{icons:['rings']},draw:tekDraw,
  caps:[{l:['*26 de enero de 1946.*','Eloy se casa con Reina,','la muchacha de Fraile Muerto.'],s:62},{l:['Tienen dos hijos:','Walter y *Mario.*'],s:74}]},
 {id:'eloy-sotano',style:'pc',link:4,lead:.8,tail:.6,...chip('ELOY DE LOS CAMPOS',560),sub:'padre de Mario',draw:pcSotano,
  caps:[{l:['Magallanes 1973. Los viernes,','Eloy se juntaba con amigos','en un sótano de la esquina.'],s:46},{l:['Asado con carbón bajo tierra.','Truco, sí. Tute cabrero, no.'],s:50},{l:['Así lo cuenta la familia.'],s:56}]},
 {id:'eloy-final',style:'tek',link:4,lead:1.2,tail:1.2,cfg:{icons:['candle']},draw:tekDraw,
  caps:[{l:['Eloy muere el *9 de enero de 2000,*','el día que cumplía ochenta años.'],s:62}]},
 {id:'puente',style:'lp',link:4,lead:.8,tail:.8,draw:lpPuente,
  caps:[{l:['En 1810, el apellido estaba','en una escritura de campo.'],s:62},{l:['En 1946, en el acta de boda','de un chofer.'],s:62},{l:['En el medio, cinco generaciones','de padres a hijos.'],s:60}]},
 {id:'arbol',style:'lp',link:7,lead:10.4,tail:6.4,draw:lpArbol,
  caps:[{l:['Una cadena de padres a hijos,','de un vizcaíno a Facundo y Camila.'],s:60,at:10.4}]}
);
const LINKROLE=SCENES;
// ═══════════════ indicador de la cadena (siempre visible) ═══════════════
function chainBar(x,T,sc){
  const cur=sc.link;
  const a=1;
  const nodes=CHAIN.map((_,i)=>[104+i*(W-208)/7,134]);
  x.save();x.globalAlpha=a;
  x.fillStyle='rgba(247,240,224,.93)';x.beginPath();x.roundRect(30,82,W-60,190,24);x.fill();
  x.strokeStyle='rgba(60,45,30,.3)';x.lineWidth=2;x.stroke();
  x.lineCap='round';
  for(let i=0;i<7;i++){x.strokeStyle='rgba(60,45,30,.35)';x.lineWidth=4;x.beginPath();x.moveTo(nodes[i][0]+16,134);x.lineTo(nodes[i+1][0]-16,134);x.stroke();
    if(cur>i||cur===7){x.strokeStyle='#b84a2c';x.lineWidth=5;x.beginPath();x.moveTo(nodes[i][0]+16,134);x.lineTo(nodes[i+1][0]-16,134);x.stroke()}}
  nodes.forEach(([px,py],i)=>{const on=cur===7||i<=cur,now=i===cur||(cur===7&&i>=5);
    x.beginPath();x.arc(px,py,now?18:13,0,7);x.fillStyle=on?'#b84a2c':'#f7f0e0';x.fill();x.strokeStyle='#3c2d1e';x.lineWidth=3;x.stroke();
    if(now){x.strokeStyle='rgba(184,74,44,.5)';x.lineWidth=3;x.beginPath();x.arc(px,py,27+(T*1.2%1)*10,0,7);x.stroke()}});
  const names=['Miguel','Felipe','Sandalio','Delmiro','Eloy','Mario','Pablo','Nietos'];
  nodes.forEach(([px],i)=>{const on=cur===7||i<=cur,now=i===cur||(cur===7&&i>=5);x.globalAlpha=a*(on?1:.8);txt(x,names[i],px,198,`800 ${now?37:35}px "Cormorant Garamond"`,'#2c2018','center')});
  const rel=cur===7?'Mario, Pablo, Facundo y Camila':(cur>=0?`${CHAIN[cur][0]} · ${CHAIN[cur][1]}`:'Cada punto es un padre y su hijo');
  x.globalAlpha=a;txt(x,rel,W/2,252,'italic 700 40px "Cormorant Garamond"','#5a2f12','center');
  x.restore();
}
// ═══════════════ render ═══════════════
function drawScene(x,sc,t){x.save();x.globalAlpha=1;x.globalCompositeOperation='source-over';sc.draw(x,t,sc.dur,sc);
  if(sc.style==='pc'){x.globalCompositeOperation='multiply';x.globalAlpha=.3;x.fillStyle='#fff1dc';x.fillRect(0,0,W,H)}x.restore()}
const pushZ=(sc,local)=>1+.035*clamp(local/sc.dur);
function drawPush(c2,img,z){c2.save();c2.translate(W/2,H/2);c2.scale(z,z);c2.translate(-W/2,-H/2);c2.drawImage(img,0,0);c2.restore()}
function render(T){
  const sc=sceneAtT(T),local=T-sc.a,idx=SCENES.indexOf(sc);
  if(idx>0&&local<.6){
    const prev=SCENES[idx-1];sx2.clearRect(0,0,W,H);drawScene(sx2,prev,prev.dur-.001);
    sx.clearRect(0,0,W,H);drawScene(sx,sc,local);
    const u=eIO(local/.6),off=(1-u)*W;
    drawPush(ctx,S2,pushZ(prev,prev.dur));ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=40;ctx.shadowOffsetX=-12;ctx.drawImage(S,off,0);ctx.restore();
  } else {sx.clearRect(0,0,W,H);drawScene(sx,sc,local);drawPush(ctx,S,pushZ(sc,local))}
  chainBar(ctx,T,sc);
  const fo=eO((T-(DUR-.8))/.8),f=fo;if(f>0){ctx.fillStyle=`rgba(238,235,227,${f})`;ctx.fillRect(0,0,W,H)}
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
