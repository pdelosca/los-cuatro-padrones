const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const dir=__dirname;
const srv=http.createServer((q,r)=>{const f=path.join(dir,q.url.split('?')[0]==='/'?process.env.SCENE||'escena.html':q.url.split('?')[0]);
  if(!fs.existsSync(f)){r.statusCode=404;return r.end()}r.end(fs.readFileSync(f))}).listen(0);
(async()=>{
  const port=srv.address().port;
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('http://localhost:'+port+'/');
  await p.waitForFunction('window.READY');
  const mode=process.argv[2];
  if(mode==='probe'){
    for(const t of process.argv.slice(3).map(Number)){await p.evaluate(t=>render(t),t);
      await p.screenshot({path:process.env.OUT+'/f_'+t+'.png'})}
  } else {
    const {spawn}=require('child_process');
    const fps=30,dur=+(process.env.DUR||72),ff=spawn(process.env.FF,['-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-preset','fast',process.env.OUT+'/'+(process.env.NOMBRE||'mudo')+'.mp4'],{stdio:['pipe','inherit','inherit']});
    for(let i=0;i<fps*dur;i++){
      await p.evaluate(t=>render(t),i/fps);
      const buf=await p.screenshot({type:'jpeg',quality:94});
      if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
    }
    ff.stdin.end();await new Promise(r=>ff.on('close',r));
  }
  await b.close();srv.close();
})();
