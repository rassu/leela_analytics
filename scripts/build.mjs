import {rm,mkdir,writeFile,copyFile,cp} from 'node:fs/promises';
import {pages,renderPage} from '../src/site.mjs';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for (const [path,page] of Object.entries(pages)) {
  await writeFile('dist/'+path,renderPage(page,path));
}
for (const file of ['styles.css','main.js','_headers']) await copyFile('src/'+file,'dist/'+file);
await mkdir('dist/assets',{recursive:true});
for (const file of ['leela-logo.png','leela-mark.png','workshop-illustration.webp']) await copyFile('src/assets/'+file,'dist/assets/'+file);
await cp('src/fonts','dist/fonts',{recursive:true});
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://www.leelaanalytics.com/sitemap.xml\n');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).filter(p=>p!=='404.html').map(p=>'<url><loc>https://www.leelaanalytics.com/'+(p==='index.html'?'':p.replace(/\.html$/, ''))+'</loc></url>').join('')+'</urlset>\n');
console.log('Built '+Object.keys(pages).length+' pages into dist/.');
