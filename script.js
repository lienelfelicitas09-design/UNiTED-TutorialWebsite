
"use strict";
const pages=[...document.querySelectorAll(".lesson-content")];

const nav=[...document.querySelectorAll(".lesson")];

const names=pages.map((p)=>p.querySelector("h1").textContent);

const progressKey="unitedTutorialCompleted_v3";
let current=0, completed=new Set();
try{completed=new Set(JSON.parse(localStorage.getItem(progressKey)||"[]").map(Number));}catch(e){completed=new Set();}

function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify([...completed]));}catch(e){}}

function refreshProgress(){
 const count=completed.size, pct=pages.length?count/pages.length*100:0;
 
 document.getElementById("bar").style.width=pct+"%";
 
 document.getElementById("topProgressText").textContent=`${count} of ${pages.length} completed`;
 
 document.getElementById("sideProgressText").textContent=`${count} of ${pages.length} lessons completed`;
 
 document.getElementById("sideProgressBar").style.width=pct+"%";
 
 nav.forEach((b,i)=>{b.textContent=(completed.has(i)?"✓ ":"")+(i+1)+". "+names[i];});
 
 document.querySelectorAll(".mark-complete").forEach(b=>{
  const n=Number(b.dataset.complete), done=completed.has(n);
  
  b.classList.toggle("completed",done);b.textContent=done?"✓ Lesson completed":"✓ Mark lesson complete";
  
  const note=document.getElementById("done-note-"+n);
  
  if(note)note.textContent=done?"Saved on this device. Tap again to mark incomplete.":"Complete this lesson when you are ready.";
 });
}

function show(n){
 current=Math.max(0,Math.min(pages.length-1,n));
 pages.forEach((p,i)=>p.hidden=i!==current);
 nav.forEach((b,i)=>b.classList.toggle("active",i===current));
 
 document.getElementById("crumb").textContent=names[current];
 
 document.getElementById("prev").disabled=current===0;
 
 document.getElementById("next").textContent=current===pages.length-1?"Back to first lesson ↺":"Next lesson →";
 
 document.getElementById("sidebar").classList.remove("asideopen");
 
 document.getElementById("menu").setAttribute("aria-expanded","false");
 
 refreshProgress();window.scrollTo({top:0,behavior:"smooth"});
}
nav.forEach(b=>b.addEventListener("click",()=>show(Number(b.dataset.n))));

document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>show(Number(b.dataset.goto))));

document.getElementById("prev").addEventListener("click",()=>show(current-1));

document.getElementById("next").addEventListener("click",()=>show(current===pages.length-1?0:current+1));

document.getElementById("start").addEventListener("click",()=>show(0));

document.getElementById("home").addEventListener("click",e=>{e.preventDefault();show(0);});

document.getElementById("tutorialLink").addEventListener("click",e=>{e.preventDefault();show(0);});

document.getElementById("menu").addEventListener("click",()=>{
 const side=document.getElementById("sidebar");side.classList.toggle("asideopen");
 
 document.getElementById("menu").setAttribute("aria-expanded",String(side.classList.contains("asideopen")));
});
document.getElementById("clearProgress").addEventListener("click",()=>{
 if(confirm("Reset all saved lesson progress on this device?")){completed.clear();saveProgress();refreshProgress();}
});
document.querySelectorAll(".mark-complete").forEach(b=>b.addEventListener("click",()=>{
 const n=Number(b.dataset.complete);completed.has(n)?completed.delete(n):completed.add(n);saveProgress();refreshProgress();
}));
document.querySelectorAll(".lesson-content").forEach(article=>{
 const editor=article.querySelector(".lesson-code"), frame=article.querySelector(".lesson-preview");
 
 const run=article.querySelector(".run-lesson"), reset=article.querySelector(".reset-lesson"), status=article.querySelector(".run-status");
 
 const original=editor.value;
 
 function runExample(){frame.srcdoc=editor.value;status.textContent="Preview updated — your code is running.";}
 
 run.addEventListener("click",runExample);
 reset.addEventListener("click",()=>{editor.value=original;runExample();status.textContent="Original example restored.";});
 runExample();
});
const codeEditor=document.getElementById("code"),preview=document.getElementById("preview"),status=document.getElementById("status");

const starterCode=codeEditor.value;

function runFull(){preview.srcdoc=codeEditor.value;status.textContent="Preview updated — your code is running.";}

document.getElementById("run").addEventListener("click",runFull);

document.getElementById("reset").addEventListener("click",()=>{codeEditor.value=starterCode;runFull();status.textContent="Starter code restored.";});

document.querySelectorAll(".lesson-quiz").forEach(quiz=>{
 
 const opts=[...quiz.querySelectorAll(".option")],feedback=quiz.querySelector(".feedback");
 
 opts.forEach(opt=>opt.addEventListener("click",()=>{
  
  opts.forEach(x=>{x.disabled=true;x.classList.remove("good","bad");});
  
  const answer=opts.find(x=>x.dataset.correct==="true");answer.classList.add("good");
  
  if(opt.dataset.correct==="true"){feedback.textContent="Correct! Great work.";feedback.style.color="#087f5b";}
  else{opt.classList.add("bad");feedback.textContent="Not quite. The green option is correct. Review the example and try again.";feedback.style.color="#b5473d";}
  
  const retry=document.createElement("button");retry.className="btn secondary";retry.textContent="Try again";retry.style.marginLeft="10px";
  retry.addEventListener("click",()=>{opts.forEach(x=>{x.disabled=false;x.classList.remove("good","bad");});feedback.textContent="";retry.remove();});
  feedback.appendChild(retry);
 }));
});
refreshProgress();show(0);
