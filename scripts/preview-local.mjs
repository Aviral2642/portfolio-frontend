import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const build=path.join(root,'build');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.pdf':'application/pdf','.webm':'video/webm','.mp4':'video/mp4','.json':'application/json'};
const reviews=new Map([
  ['/__review',path.join(root,'output/playwright/designer-review.html')],
  ['/__review/motion.webm',path.join(root,'output/playwright/designer-motion.webm')],
  ...['desktop','mobile'].flatMap(size=>['top','research','disclosures','recognition','projects','experience','speaking','about','education','public-presence','channels','writing','contact'].map(id=>[`/__review/${size}-${id}.png`,path.join(root,`output/playwright/depth/${size}-${id}.png`)])),
  ...['recognition-resolved','disclosures-next'].map(id=>[`/__review/desktop-${id}.png`,path.join(root,`output/playwright/depth/desktop-${id}.png`)]),
]);
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    let file=reviews.get(url.pathname);
    if(!file){
      const name=decodeURIComponent(url.pathname);
      file=path.resolve(build,`.${name}`);
      if(!file.startsWith(build+path.sep)&&file!==build){res.writeHead(403);res.end();return;}
      const info=await stat(file).catch(()=>null);
      if(!info||info.isDirectory()){
        if(path.extname(name)){res.writeHead(404);res.end('Not found');return;}
        file=path.join(build,'index.html');
      }
    }
    const info=await stat(file);
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
    // Byte ranges support reviewing a recording without downloading it all again.
    const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
    if(match){const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),info.size-1):info.size-1;if(start>end){res.writeHead(416);res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});createReadStream(file,{start,end}).pipe(res);}
    else{res.writeHead(200,{...headers,'Content-Length':info.size});createReadStream(file).pipe(res);}
  }catch{res.writeHead(404);res.end('Not found. Run npm run build first.');}
});
server.listen(4174,'127.0.0.1',()=>console.log('Local only: http://127.0.0.1:4174 | Screenshots and recording: /__review'));
