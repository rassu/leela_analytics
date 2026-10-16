import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
await import('./build.mjs');
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1:4175');
  if(url.pathname.startsWith('/api/')){
    if(url.pathname!=='/api/contact'){res.writeHead(404,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:{message:'Endpoint not found.'}}));return;}
    try{
      const {handleContact}=await import('../server/contact.mjs');
      const chunks=[];for await(const c of req)chunks.push(c);
      const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
      const response=await handleContact(request,{ALLOWED_ORIGINS:'http://127.0.0.1:4175,http://localhost:4175'});
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
    }catch{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:{message:'Email is not configured in this preview. Please email hello@leelaanalytics.com.'}}));return;}
  }
  if(url.pathname.endsWith('.html')){res.writeHead(307,{Location:(url.pathname==='/index.html'?'/':url.pathname.slice(0,-5))+url.search});res.end();return;}
  let path;try{path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':(extname(url.pathname)?url.pathname:url.pathname+'.html')));}catch{res.writeHead(400);res.end();return;}
  if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}
  try{
    const info=await stat(path);if(!info.isFile())throw Error();
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(path));
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(root+'/404.html'));}
}).listen(4175,'127.0.0.1',()=>console.log('Leela preview: http://127.0.0.1:4175'));
