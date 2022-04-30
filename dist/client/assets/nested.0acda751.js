var L=Object.defineProperty;var j=(e,i,t)=>i in e?L(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var u=(e,i,t)=>(j(e,typeof i!="symbol"?i+"":i,t),t);import{a as k}from"./index.a2e70da6.js";class P extends HTMLCanvasElement{constructor(){super();u(this,"ctx");u(this,"img");u(this,"cartelPadding");this.ctx=this.getContext("2d"),this.img=new Image,this.cartelPadding=32}_loadImage(){const t=this.getAttribute("img");t&&(this.img.src!==t?(this.img.crossOrigin="anonymous",this.img.src=t,this.img.onload=()=>{this._draw()}):this._draw())}_img(t,s){const o=t/s,n=this.img.width/this.img.height,a=n<o?n*s:t,d=n>=o?this.img.height/this.img.width*t:s;return{width:a,height:d,drawImg:(g,f)=>{this.ctx.drawImage(this.img,g,f,a,d)}}}_cartel(){const t=this.getAttribute("artiste"),s=this.getAttribute("titre"),o=this.getAttribute("date"),n=this.getAttribute("medium"),a=this.getAttribute("dimensions"),d=this.getAttribute("localisation"),m=[t,s,o,n,a,d].filter(l=>l!==null&&l!==""),g=30;this.ctx.strokeStyle="#ffffff",this.ctx.font=`${g}px Roboto`,this.ctx.fillStyle="#fff";const f=m.reduce((l,w)=>Math.max(this.ctx.measureText(w||"").width,l),0)+this.cartelPadding*2,_=(m.length-1)*g+this.cartelPadding*2;return{draw:(l,w)=>{m.forEach((p,S)=>{this.ctx.fillText(p||"",l+this.cartelPadding,w+this.cartelPadding+S*g)})},width:f,height:_}}_clearCanvas(){this.ctx.fillStyle="#010923",this.ctx.fillRect(0,0,this.width,this.height)}_draw(){this._clearCanvas();const t=this._cartel(),s=this._img(this.width-t.width,this.height),o=Math.floor((this.width-s.width-t.width)*.5),n=Math.floor((this.height-s.height)*.5);s.drawImg(o,n),t.draw(o+s.width,n+s.height-t.height)}refresh(){this._loadImage()}download(){const t=this.getAttribute("titre"),o=[this.getAttribute("artiste")||"anonyme",t||"sans-titre"].join("-"),n=document.createElement("a");n.download=o+".png",n.href=this.toDataURL(),n.click()}}const q=["artiste","titre","date","medium","dimensions","localisation"],c=document.getElementById("slide-js"),y=document.getElementById("export-js"),b=document.getElementById("prevBtn-js"),x=document.getElementById("nextBtn-js"),v=document.querySelector("body > main > form"),I=document.getElementById("loader-js"),E=document.getElementById("fullscreenBtn-js"),A=v==null?void 0:v.querySelectorAll("input");let h,r=0;(async function(){const e=window.location.search,i=new URLSearchParams(e),t=i.get("id"),s=i.get("search");(t||s)&&B({id:t,toSearch:s})})();async function B({id:e,toSearch:i}){const t=e?`/api/infos/byid/${e}`:`/api/infos/bytitle/${i}`,o=(await k.get(t)).data;h=o.images;const n=h[r].source;if(c&&n){I&&(I.className="lds-ellipsis-inactive"),c.setAttribute("img",n);for(const a of q)if(o[a]){c.setAttribute(a,o[a]);const d=document.querySelector("#"+a);d&&(d.value=o[a])}c.refresh()}}y==null||y.addEventListener("click",e=>{e.preventDefault(),c.download()});x==null||x.addEventListener("click",e=>{r=(r+1)%h.length;const i=h[r].source;c.setAttribute("img",i),c.refresh()});b==null||b.addEventListener("click",e=>{r=r>0?r-1:h.length-1;const i=h[r].source;c.setAttribute("img",i),c.refresh()});E==null||E.addEventListener("click",e=>{e.preventDefault(),c.requestFullscreen()});A==null||A.forEach(e=>{e.addEventListener("input",i=>{const t=i.target;console.log(t.value,t.id),c.setAttribute(t.id,t.value),c.refresh()})});customElements.define("slide-view",P,{extends:"canvas"});
