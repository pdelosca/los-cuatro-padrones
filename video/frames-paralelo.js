// Render en paralelo (idea de PDoomVideo): N páginas de Chromium pintan tramos de cuadros a JPEG y ffmpeg los une.
// Uso: SCENE=cadena2.html DUR=240.8 FPS=30 WORKERS=4 OUT=<carpeta> NOMBRE=mudo FF=<ffmpeg> node frames-paralelo.js
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const http=require('http'),fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const dir=__dirname,scene=process.env.SCENE||'cadena2.html',fps=+(process.env.FPS||30),dur=+process.env.DUR,W=+(process.env.WORKERS||4);
const out=process.env.OUT,name=process.env.NOMBRE||'mudo',tmp=path.join(out,'cuadros-'+name);
const total=Math.floor(fps*dur);fs.rmSync(tmp,{recursive:true,force:true});fs.mkdirSync(tmp,{recursive:true});
const srv=http.createServer((q,r)=>{const u=q.url.split('?')[0];const f=path.join(dir,u==='/'?scene:u);if(!fs.existsSync(f)){r.statusCode=404;return r.end()}r.end(fs.readFileSync(f))}).listen(0);
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const t0=Date.now();let done=0;
  await Promise.all([...Array(W).keys()].map(async k=>{
    const p=await b.newPage({viewport:{width:1080,height:1920}});
    await p.goto('http://localhost:'+srv.address().port+'/');await p.waitForFunction('window.READY',null,{timeout:120000});
    for(let i=k;i<total;i+=W){
      await p.evaluate(t=>render(t),i/fps);
      const buf=await p.screenshot({type:'jpeg',quality:94});
      fs.writeFileSync(path.join(tmp,String(i).padStart(6,'0')+'.jpg'),buf);
      if(++done%300===0)console.log(`cuadros ${done}/${total} · ${(done/((Date.now()-t0)/1000)).toFixed(1)} c/s`);
    }
  }));
  await b.close();srv.close();
  const r=spawnSync(process.env.FF,['-y','-loglevel','error','-framerate',String(fps),'-i',path.join(tmp,'%06d.jpg'),'-c:v','libx264','-pix_fmt','yuv420p','-crf',process.env.CRF||'20','-preset','fast',path.join(out,name+'.mp4')],{stdio:'inherit'});
  if(r.status!==0){console.log('FALLÓ ffmpeg');process.exit(1)}
  fs.rmSync(tmp,{recursive:true,force:true});
  console.log('listo',name+'.mp4',((Date.now()-t0)/1000).toFixed(0)+' s');
})();
