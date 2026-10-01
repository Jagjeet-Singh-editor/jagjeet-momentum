const menu=document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#navigation').classList.toggle('open',open)});
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.querySelector('#navigation').classList.remove('open')}));

const portfolio=document.querySelector('#portfolio');
const workStatus=document.querySelector('#work-status');
const featuredIds=['ai-vedios-01','vsl-reels-for-ads-02','podcast-03','event-reels-01','ai-vedios-05','achor-reel-shoot-and-edit-06'];
let projects=[];
const filters=[...document.querySelectorAll('[data-filter]')];
const dialog=document.querySelector('#video-dialog');
const player=document.querySelector('#player');
const videoError=document.querySelector('#video-error');
const motionMedia=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionMedia.matches;
let lastTrigger=null;
const playIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v18l16-9z"/></svg>';

function renderWork(filter='Featured'){
 const selected=filter==='Featured'?featuredIds.map(id=>projects.find(p=>p.id===id)).filter(Boolean):filter==='All'?projects:projects.filter(p=>p.category===filter);
 portfolio.replaceChildren();
 for(const p of selected){
  const article=document.createElement('article');article.className='project';
  const button=document.createElement('button');button.className='project-play';button.setAttribute('aria-label',`Play ${p.title}, ${p.length}`);
  const img=document.createElement('img');img.src=p.poster;img.alt=p.title;img.loading='lazy';img.width=p.width;img.height=p.height;button.style.aspectRatio=`${p.width} / ${p.height}`;img.addEventListener('load',()=>{button.style.aspectRatio=`${img.naturalWidth} / ${img.naturalHeight}`;});
  const circle=document.createElement('span');circle.className='play-circle';circle.innerHTML=playIcon;
  const duration=document.createElement('span');duration.className='project-time';duration.textContent=p.length;
  button.append(img,circle,duration);button.addEventListener('click',()=>openProject(p,button));
  const category=document.createElement('span');category.className='project-category';category.textContent=p.category==='AI visuals'?'AI-ASSISTED VISUAL CONCEPT':p.category;
  const title=document.createElement('h3');title.textContent=p.title;
  const goal=document.createElement('p');goal.textContent=p.goal;
  article.append(button,category,title,goal);portfolio.append(article);
 }
 workStatus.textContent=filter==='Featured'?`6 selected projects · 34 videos in the full collection`:`${selected.length} ${selected.length===1?'video':'videos'} · ${filter==='All'?'The full collection':filter}`;
 filters.forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
}
function openProject(project,trigger){
 lastTrigger=trigger;
 document.querySelector('#video-category').textContent=project.category;
 document.querySelector('#video-title').textContent=project.title;
 document.querySelector('#video-goal').textContent=project.goal;
 document.querySelector('#video-description').textContent=project.description;
 document.querySelector('#video-role').textContent=project.role;
 videoError.hidden=true;
 player.poster=project.poster;player.src=project.video;
 player.setAttribute('aria-label',project.title);
 dialog.showModal();document.body.classList.add('no-scroll');
 player.play().catch(()=>{});
}
function closeProject(){dialog.close()}
dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.body.classList.remove('no-scroll');lastTrigger?.focus({preventScroll:true})});
document.querySelector('.close-dialog').addEventListener('click',closeProject);
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeProject()}});
player.addEventListener('error',()=>{if(player.getAttribute('src'))videoError.hidden=false});
document.querySelector('#similar-project').addEventListener('click',()=>{closeProject();document.querySelector('#contact').scrollIntoView({behavior:paused?'auto':'smooth'})});
filters.forEach(b=>b.addEventListener('click',()=>renderWork(b.dataset.filter)));
fetch('portfolio.json?v=4').then(r=>{if(!r.ok)throw Error('Portfolio unavailable');return r.json()}).then(data=>{projects=data;renderWork()}).catch(()=>{workStatus.textContent='The portfolio could not load. Refresh the page to try again.';const retry=document.createElement('button');retry.className='button outline';retry.textContent='Reload portfolio';retry.onclick=()=>location.reload();portfolio.append(retry)});

const demo=document.querySelector('.motion-demo');
const stages=[
 {overline:'THE FIRST FRAME',first:'STOP.',second:'FEEL SOMETHING.',small:'One strong idea. A reason to stay.',frame:'01 / ATTENTION',caption:'A clear opening gives the viewer a reason to keep watching.'},
 {overline:'THE STORY THAT FOLLOWS',first:'SHOW IT.',second:'MAKE IT CLEAR.',small:'Real detail. A message that makes sense.',frame:'02 / TRUST',caption:'Useful detail helps an audience understand the value behind the message.'},
 {overline:'THE FINAL FRAME',first:'INTEREST.',second:'WITH DIRECTION.',small:'One next step. Easy to understand.',frame:'03 / ACTION',caption:'A focused ending turns a passive view into an invitation to act.'}
];
function replay(){demo.classList.remove('replay');void demo.offsetWidth;demo.classList.add('replay')}
document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{
 const index=Number(button.dataset.stage),stage=stages[index];demo.dataset.scene=index;
 document.querySelector('#demo-overline').textContent=stage.overline;
 const title=document.querySelector('#demo-title');title.replaceChildren(document.createTextNode(stage.first),document.createElement('br'));const em=document.createElement('em');em.textContent=stage.second;title.append(em);
 document.querySelector('#demo-small').textContent=stage.small;document.querySelector('.demo-frame').textContent=stage.frame;document.querySelector('#demo-caption').textContent=stage.caption;
 document.querySelectorAll('[data-stage]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});replay();
}));
document.querySelector('#replay-demo').addEventListener('click',replay);
const motionToggle=document.querySelector('#motion-toggle');
function setMotion(value){paused=value;document.documentElement.classList.toggle('motion-paused',paused);motionToggle.textContent=paused?'Resume motion':'Pause motion';motionToggle.setAttribute('aria-pressed',String(paused))}
setMotion(paused);motionToggle.addEventListener('click',()=>setMotion(!paused));motionMedia.addEventListener('change',e=>setMotion(e.matches));
const progress=document.querySelector('.reading-progress');let scrollQueued=false;
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${max>0?window.scrollY/max:0})`;scrollQueued=false}
window.addEventListener('scroll',()=>{if(!scrollQueued&&!paused){scrollQueued=true;requestAnimationFrame(updateProgress)}},{passive:true});updateProgress();

// Reveal meaningful groups as they enter view; content remains visible without JS.
const revealTargets=document.querySelectorAll('.section-heading,.service-list article,.process-grid article,.about-copy,.contact-copy,#brief-form');
if(!motionMedia.matches){
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target)}}),{threshold:.12});
 revealTargets.forEach((element,index)=>{element.classList.add('scroll-reveal');element.style.setProperty('--reveal-delay',`${index%3*80}ms`);revealObserver.observe(element)});
}
// Cycle the story demonstration only while visible, leaving focused controls undisturbed.
let demoVisible=false,stageIndex=0;
const demoObserver=new IntersectionObserver(entries=>{demoVisible=entries[0].isIntersecting},{threshold:.35});demoObserver.observe(demo);
document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{stageIndex=Number(button.dataset.stage)}));
setInterval(()=>{if(demoVisible&&!paused&&!document.hidden&&!demo.matches(':hover')&&!document.querySelector('.approach-layout').contains(document.activeElement)){stageIndex=(stageIndex+1)%3;document.querySelector(`[data-stage="${stageIndex}"]`).click()}},5500);

// Duplicate only the visual track so the client cards loop without a jump.
const testimonialGroup=document.querySelector('.testimonial-group');
if(testimonialGroup){const copy=testimonialGroup.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('a').forEach(link=>link.setAttribute('tabindex','-1'));testimonialGroup.parentElement.append(copy);}
