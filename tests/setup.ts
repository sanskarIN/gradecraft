import "@testing-library/jest-dom/vitest";
Object.defineProperty(window,"matchMedia",{writable:true,value:(query:string)=>({matches:false,media:query,onchange:null,addListener:()=>undefined,removeListener:()=>undefined,addEventListener:()=>undefined,removeEventListener:()=>undefined,dispatchEvent:()=>false})});
if(typeof HTMLDialogElement!=="undefined"&&!HTMLDialogElement.prototype.showModal){HTMLDialogElement.prototype.showModal=function(){this.open=true;};HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new Event("close"));};}
