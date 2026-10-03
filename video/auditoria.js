// Auditoría de la escena: línea de tiempo, regla de lectura, márgenes y saltos de color.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const dir=__dirname,scene=process.env.SCENE||'cadena2.html';
const srv=http.createServer((q,r)=>{const u=q.url.split('?')[0];const f=path.join(dir,u==='/'?scene:u);if(!fs.existsSync(f)){r.statusCode=404;return r.end()}r.end(fs.readFileSync(f))}).listen(0);
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.log('ERROR DE PÁGINA:',e.message));
  await p.goto('http://localhost:'+srv.address().port+'/');await p.waitForFunction('window.READY',null,{timeout:60000});
  const A=await p.evaluate(()=>window.AUDIT());
  fs.writeFileSync(path.join(dir,'linea-de-tiempo.json'),JSON.stringify(A,null,1));
  console.log('DURACIÓN',A.dur.toFixed(1),'s =',Math.floor(A.dur/60)+':'+String(Math.round(A.dur%60)).padStart(2,'0'));
  let bad=0;
  for(const s of A.scenes){for(const c of s.caps){const d=c.d;if(d+1e-6<c.need){bad++;console.log('LECTURA CORTA',s.id,d.toFixed(1),'<',c.need)}}}
  console.log('Leyendas:',A.scenes.reduce((n,s)=>n+s.caps.length,0),'· menores a la regla:',bad);
  console.log('Avisos de márgenes/tamaño:',A.lint.length);A.lint.forEach(l=>console.log(' ',l));
  const col=await p.evaluate(()=>window.COLOR());let jumps=0;
  for(let i=0;i<col.length;i++){const c=col[i];console.log(c.id.padEnd(18),'inicio L=',String(c.first.L).padStart(3),' fin L=',String(c.last.L).padStart(3));
    if(i>0){const d=Math.abs(col[i-1].last.L-c.first.L)/255;if(d>0.45){jumps++;console.log('   SALTO DE LUZ',col[i-1].id,'->',c.id,(d*100).toFixed(0)+'%')}}}
  console.log('Saltos de luz > 45 %:',jumps);
  await b.close();srv.close();
})();
