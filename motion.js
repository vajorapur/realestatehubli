(function(root){
'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function motionState(y,viewport,filmTop,filmHeight,journeyTop,journeyHeight,trackWidth,width){
 const film=clamp(-filmTop/Math.max(1,filmHeight-viewport));
 const journey=clamp(-journeyTop/Math.max(1,journeyHeight-viewport));
 return {film,journey,pan:-journey*Math.max(0,trackWidth-width),zoom:1.3-film*.3,second:film>.5,crossfade:clamp((film-.36)/.28),captionOpacity:Math.abs(film-.5)<.09?Math.abs(film-.5)/.09:1,heroShift:Math.min(y*.25,viewport*.3)};
}
if(typeof module!=='undefined'&&module.exports){module.exports={clamp,motionState};return;}
const $=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s));
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,queued=false;
const toggle=$('.motion-toggle'),film=$('.film-scroll'),journey=$('.journey'),track=$('.journey-track'),hero=$('.cine-photo');
function setToggle(){document.body.classList.toggle('motion-paused',paused);document.body.classList.toggle('motion-enabled',!paused);toggle.textContent=paused?'Motion: off':'Motion: on';toggle.setAttribute('aria-pressed',String(!paused));}
setToggle();toggle.addEventListener('click',()=>{
 paused=!paused;setToggle();
 if(!paused){document.body.classList.add('replay-motion');void document.body.offsetWidth;document.body.classList.remove('replay-motion');}
 paint();
});
if('IntersectionObserver' in root){document.body.classList.add('motion-ready');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});all('.reveal,.tile').forEach(e=>io.observe(e));}

function paint(){
 queued=false;const y=scrollY,vh=innerHeight,width=innerWidth,fr=film.getBoundingClientRect(),jr=journey.getBoundingClientRect();
 const s=motionState(y,vh,fr.top,film.offsetHeight,jr.top,journey.offsetHeight,track.scrollWidth,width);
 const total=document.documentElement.scrollHeight-vh;$('.progress').style.transform=`scaleX(${total>0?clamp(y/total):0})`;
 if(paused){hero.style.transform='none';$('.cine-content').style.transform='none';$('.cine-content').style.opacity='1';$('.kinetic>div').style.transform='none';return;}
 hero.style.transform=`translate3d(0,${s.heroShift}px,0) scale(${1.04+clamp(y/vh)*.08})`;
 $('.cine-content').style.transform=`translate3d(0,${-Math.min(y*.12,120)}px,0)`;
 $('.cine-content').style.opacity=String(1-clamp(y/vh)*.8);
 $('.film-primary').style.transform=`scale(${s.zoom}) translate3d(${s.film*-3}%,0,0)`;
 $('.film-primary').style.opacity=String(1-s.crossfade);
 $('.film-alt').style.transform=`scale(${1.12+(1-s.film)*.12})`;
 $('.film-caption').style.opacity=String(s.captionOpacity);
 $('.film-caption').style.transform=`translate3d(0,${(1-s.captionOpacity)*20}px,0)`;
 const key=s.second?'grow':'live';if($('.film-caption').dataset.scene!==key){$('.film-caption').dataset.scene=key;$('.film-count').textContent=s.second?'02 — SPACE TO GROW':'01 — SPACE TO LIVE';$('.film-caption h2').innerHTML=s.second?'Space for<br>your next ambition.':'Room for<br>your next chapter.';$('.film-caption p').textContent=s.second?'Commercial sites. Shops. Agriculture and NA land.':'Independent houses. Apartments. Residential sites.';}
 $('.film-track span').style.transform=`scaleX(${s.film})`;
 track.style.transform=`translate3d(${s.pan}px,0,0)`;
 $('.kinetic>div').style.transform=`translate3d(${-clamp((y-$('.kinetic').offsetTop+vh)/(vh*2),0,2)*width*.25}px,0,0)`;
 all('.editorial h2').forEach(h=>{const r=h.getBoundingClientRect(),t=clamp((vh*.9-r.top)/(vh*.6));h.style.opacity=String(.3+.7*t);});
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);paint();
const form=$('#form');new MutationObserver(()=>{document.body.classList.toggle('in-form',!form.classList.contains('hide'));schedule();}).observe(form,{attributes:true,attributeFilter:['class']});
all('.tile').forEach(tile=>tile.addEventListener('click',()=>setTimeout(()=>form.scrollIntoView({behavior:paused?'instant':'smooth',block:'start'}),0)));
})(typeof window!=='undefined'?window:globalThis);
