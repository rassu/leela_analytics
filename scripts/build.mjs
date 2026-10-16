import {rm,mkdir,writeFile,copyFile,cp,readFile} from 'node:fs/promises';
import {pages,renderPage} from '../src/site.mjs';
import {createHash} from 'node:crypto';
const target=process.argv.includes('--target=pages')?'pages':'worker';
const assetVersion=createHash('sha256').update(await readFile('src/styles.css')).update(await readFile('src/main.js')).digest('hex').slice(0,12);
const options={contactMode:target==='pages'?'email':'api',assetVersion};
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for (const [path,page] of Object.entries(pages)) {
  await writeFile('dist/'+path,renderPage(page,path,options));
}
for (const file of ['styles.css','main.js',...(target==='worker'?['_headers']:[])]) await copyFile('src/'+file,'dist/'+file);
await mkdir('dist/assets',{recursive:true});
for (const file of ['leela-logo.png','leela-mark.png','workshop-illustration.webp']) await copyFile('src/assets/'+file,'dist/assets/'+file);
await cp('src/fonts','dist/fonts',{recursive:true});
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://www.leelaanalytics.com/sitemap.xml\n');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).filter(p=>p!=='404.html').map(p=>'<url><loc>https://www.leelaanalytics.com/'+(p==='index.html'?'':p.replace(/\.html$/, ''))+'</loc></url>').join('')+'</urlset>\n');
if (target==='pages') await writeFile('dist/.nojekyll','');
console.log('Built '+Object.keys(pages).length+' pages into dist/.');
