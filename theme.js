(function(){
'use strict';
const themes={gold:{accent:'#d9bc84',bg:'#111412',text:'#e9e4d9',soft:'#22271f',form:'#705729'},emerald:{accent:'#a8d6b4',bg:'#0b2019',text:'#ecf4ed',soft:'#15392a',form:'#24543a'},blue:{accent:'#adc9ef',bg:'#101e33',text:'#edf3fc',soft:'#1b304a',form:'#254f7b'},ivory:{accent:'#63502c',bg:'#f7f3e8',text:'#202d25',soft:'#e3e7d8',form:'#5c4b28'}};
function safeTheme(name){return Object.prototype.hasOwnProperty.call(themes,name)?name:'gold';}
if(typeof module!=='undefined'&&module.exports){module.exports={themes,safeTheme};return;}
const dialog=document.getElementById('themeDialog'),opener=document.getElementById('openTheme');const buttons=Array.from(document.querySelectorAll('.theme-choice'));let saved='gold';try{saved=safeTheme(localStorage.getItem('visitorTheme'));}catch{}
function apply(name){const key=safeTheme(name),t=themes[key];document.documentElement.dataset.theme=key;for(const [field,value] of Object.entries(t))document.documentElement.style.setProperty(field==='form'?'--form-accent':'--visitor-'+field,value);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===key)));try{localStorage.setItem('visitorTheme',key);}catch{} }
function close(){dialog.close();opener.focus();}
opener.addEventListener('click',()=>{if(!dialog.open)dialog.showModal();});document.getElementById('closeTheme').addEventListener('click',close);dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.theme)));document.getElementById('resetTheme').addEventListener('click',()=>apply('gold'));apply(saved);
})();
