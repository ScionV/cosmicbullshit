import {chromium} from 'file:///C:/Users/Entered%20Adepti/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
const files=['assets/plates/fortune-paper-edited.png','assets/receipt-concepts/smudged-stamps-v2.png','assets/receipt-concepts/bureau-seal-v1.png','public/art/signs/leo.png','public/art/bodies/jupiter.png','assets/receipt-concepts/cloud-surround-v1.png'];
const urls=files.map(p=>'data:image/png;base64,'+readFileSync(p).toString('base64'));
const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage();await page.goto('http://127.0.0.1:4321/');
const results=await page.evaluate(async urls=>{
 const face=await new FontFace('ProofTypewriter','url(/fonts/SpecialElite-Regular.ttf)').load();document.fonts.add(face);
 const imgs=await Promise.all(urls.map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i);i.src=src;})));
 const c=document.createElement('canvas');c.width=1600;c.height=1200;const x=c.getContext('2d');
 function lettering(size){x.font=`${size}px ProofTypewriter`;x.fillStyle='#40192e';x.textAlign='center';x.textBaseline='top';}
 function art(cx,cy,size){x.globalAlpha=.15;x.drawImage(imgs[3],cx-size/2,cy-size/2,size,size);x.globalAlpha=1;const p=size*.5;x.drawImage(imgs[4],cx-p/2,cy-p/2,p,p);}
 function variable(dx,dy,w,h){x.drawImage(imgs[1],imgs[1].width*.51,imgs[1].height*.015,imgs[1].width*.46,imgs[1].height*.31,dx,dy,w,h);}
 x.fillStyle='#e8c898';x.fillRect(0,0,1600,1200);
 const scale=Math.min(1482/imgs[0].width,1086/imgs[0].height),pw=imgs[0].width*scale,ph=imgs[0].height*scale;
 x.drawImage(imgs[0],800-pw/2,40,pw,ph);
 lettering(21);x.fillText('REAL SKY · COMIC EXCUSE',800,188);lettering(48);x.fillText('Jupiter in Leo',800,249);
 lettering(35);['Growth is up. Mostly the','slide deck explaining why','nothing shipped.'].forEach((s,i)=>x.fillText(s,800,342+i*48));
 art(800,795,355);x.drawImage(imgs[2],320,720,175,175);variable(1070,636,260,122);
 lettering(18);x.textAlign='right';x.fillText('Filed by the cosmos.',1298,1018);x.fillText('Responsibility declined.',1298,1040);
 const receipt=c.toDataURL();
 c.width=1080;c.height=1350;x.fillStyle='#f4dfb9';x.fillRect(0,0,1080,1350);x.strokeStyle='#40192e';x.lineWidth=1;x.strokeRect(44,44,992,1262);
 lettering(36);x.fillText('Cosmic Bullshit',540,105);lettering(18);x.fillText('REAL SKY · COMIC EXCUSE',540,190);lettering(44);x.fillText('Jupiter in Leo',540,260);
 lettering(40);['Growth is up. Mostly the','slide deck explaining why','nothing shipped.'].forEach((s,i)=>x.fillText(s,540,350+i*57));
 x.drawImage(imgs[5],150,560,780,560);art(540,825,425);
 x.drawImage(imgs[2],112,1123,145,145);variable(738,1125,235,110);
 lettering(15);x.textAlign='right';x.fillText('Filed by the cosmos.',970,1250);x.fillText('Responsibility declined.',970,1272);
 lettering(16);x.fillText('cosmicbullshit.com',540,1272);
 const share=c.toDataURL();c.width=1200;c.height=800;x.fillStyle='#f4dfb9';x.fillRect(0,0,1200,800);x.drawImage(imgs[1],0,0,1200,800);
 return [receipt,share,c.toDataURL()];
},urls);
for(const [i,name] of ['receipt-user-paper-proof-v2','share-typewriter-proof-v2','smudged-stamps-paper-proof-v2'].entries())writeFileSync(`assets/receipt-concepts/${name}.png`,Buffer.from(results[i].split(',')[1],'base64'));
await browser.close();
