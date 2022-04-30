var S=Object.defineProperty;var p=(e,i,t)=>i in e?S(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var u=(e,i,t)=>(p(e,typeof i!="symbol"?i+"":i,t),t);import{a as L}from"./index.a2e70da6.js";class P extends HTMLCanvasElement{constructor(){super();u(this,"ctx");u(this,"img");u(this,"cartelPadding");this.ctx=this.getContext("2d"),this.img=new Image,this.cartelPadding=32}_loadImage(){const t=this.getAttribute("img");t&&(this.img.src!==t?(this.img.crossOrigin="anonymous",this.img.src=t,this.img.onload=()=>{this._draw()}):this._draw())}_img(t,s){const o=t/s,n=this.img.width/this.img.height,l=n<o?n*s:t,g=n>=o?this.img.height/this.img.width*t:s;return{width:l,height:g,drawImg:(d,f)=>{this.ctx.drawImage(this.img,d,f,l,g)}}}_cartel(){const t=this.getAttribute("artiste"),s=this.getAttribute("titre"),o=this.getAttribute("date"),n=this.getAttribute("medium"),l=this.getAttribute("dimensions"),g=this.getAttribute("localisation"),m=[t,s,o,n,l,g].filter(r=>r!==null&&r!==""),d=30;this.ctx.strokeStyle="#ffffff",this.ctx.font=`${d}px Roboto`,this.ctx.fillStyle="#fff";const f=m.reduce((r,w)=>Math.max(this.ctx.measureText(w||"").width,r),0)+this.cartelPadding*2,E=(m.length-1)*d+this.cartelPadding*2;return{draw:(r,w)=>{m.forEach((I,_)=>{this.ctx.fillText(I||"",r+this.cartelPadding,w+this.cartelPadding+_*d)})},width:f,height:E}}_clearCanvas(){this.ctx.fillStyle="#010923",this.ctx.fillRect(0,0,this.width,this.height)}_draw(){this._clearCanvas();const t=this._cartel(),s=this._img(this.width-t.width,this.height),o=Math.floor((this.width-s.width-t.width)*.5),n=Math.floor((this.height-s.height)*.5);s.drawImg(o,n),t.draw(o+s.width,n+s.height-t.height)}refresh(){this._loadImage()}download(){const t=this.getAttribute("titre"),o=[this.getAttribute("artiste")||"anonyme",t||"sans-titre"].join("-"),n=document.createElement("a");n.download=o+".png",n.href=this.toDataURL(),n.click()}}const k=["artiste","titre","date","medium","dimensions","localisation"],a=document.getElementById("slide-js"),b=document.getElementById("export-js"),x=document.getElementById("prevBtn-js"),y=document.getElementById("nextBtn-js"),A=document.querySelector("body > main > form"),v=A==null?void 0:A.querySelectorAll("input");let h,c=0;(async function(){const e=window.location.search,t=new URLSearchParams(e).get("search");t&&j(t)})();async function j(e){const t=(await L.get(`/api/infos/byid/${e}`)).data;h=t.images;const s=h[c].source;if(a&&s){a.setAttribute("img",s);for(const o of k){a.setAttribute(o,t[o]);const n=document.querySelector("#"+o);n&&(n.value=t[o])}a.refresh()}}b==null||b.addEventListener("click",e=>{e.preventDefault(),a.download()});y==null||y.addEventListener("click",e=>{c=(c+1)%h.length;const i=h[c].source;a.setAttribute("img",i),a.refresh()});x==null||x.addEventListener("click",e=>{c=c>0?c-1:h.length-1;const i=h[c].source;a.setAttribute("img",i),a.refresh()});v==null||v.forEach(e=>{e.addEventListener("input",i=>{const t=i.target;console.log(t.value,t.id),a.setAttribute(t.id,t.value),a.refresh()})});customElements.define("slide-view",P,{extends:"canvas"});