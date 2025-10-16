
const $=(id)=>document.getElementById(id);
const LS={b:'v2hot_b', s:'v2hot_s'};

const i18n={
  ar:{tabDashboard:"الرئيسية",tabAdd:"أضف فرع",tabBranches:"تعديل الفروع",tabFiles:"ملفات",tabSettings:"الإعدادات",tabPublic:"عرض عام",
      heroTitle:"لوحة V2 (Hotfix)",heroSubtitle:"اضغط «تجهيز بيانات» لعرض أرقام فورية.",
      lblFrom:"من",lblTo:"إلى",btnWeek:"أسبوع",btnMonth:"شهر",btnApply:"تطبيق",lblTarget:"هدف التقييم",btnRecalculate:"إعادة حساب",
      tblTitle:"جدول الفروع",thName:"اسم الفرع",thRating:"التقييم",thReviews:"التعليقات",thBefore:"قبل",thAfter:"بعد",thChange:"التغير",thToTarget:"للهدف",
      ch1Title:"متوسط التقييم",ch2Title:"عدد التعليقات",publicTitle:"عرض عام",publicNote:"هذه الصفحة للعرض فقط.",settingsTitle:"الإعدادات",settingsTips:"نسخة مبسطة لعرض المحتوى مباشرة.",
      filesTitle:"ملفات",addTitle:"إضافة فرع",branchesTitle:"تعديل الفروع",exportNote:"",footerText:"V2 · صنع بحب 💙",langToggle:"EN",themeToggleDark:"نهار",themeToggleLight:"ليل",
      rkBestTitle:"أعلى تقييم",rkMostTitle:"أعلى تعليقات",rkWorstTitle:"أقل تقييم",rkPointsTitle:"نقاط"},
  en:{tabDashboard:"Dashboard",tabAdd:"Add Branch",tabBranches:"Edit Branches",tabFiles:"Files",tabSettings:"Settings",tabPublic:"Public View",
      heroTitle:"V2 Board (Hotfix)",heroSubtitle:"Press “Seed Data” to show demo numbers instantly.",
      lblFrom:"From",lblTo:"To",btnWeek:"Week",btnMonth:"Month",btnApply:"Apply",lblTarget:"Target",btnRecalculate:"Recalculate",
      tblTitle:"Branches Table",thName:"Branch",thRating:"Rating",thReviews:"Reviews",thBefore:"Before",thAfter:"After",thChange:"Change",thToTarget:"To Target",
      ch1Title:"Avg Ratings",ch2Title:"Reviews",publicTitle:"Public View",publicNote:"Read-only page.",settingsTitle:"Settings",settingsTips:"Simplified to show content immediately.",
      filesTitle:"Files",addTitle:"Add Branch",branchesTitle:"Edit Branches",exportNote:"",footerText:"V2 · made with 💙",langToggle:"عربي",themeToggleDark:"Light",themeToggleLight:"Dark",
      rkBestTitle:"Top Rating",rkMostTitle:"Most Reviews",rkWorstTitle:"Lowest Rating",rkPointsTitle:"Points"}
};
const state={lang:localStorage.getItem('v2hot_lang')||'ar',theme:localStorage.getItem('v2hot_theme')||'dark',branches:[],snaps:{},charts:{}};

document.addEventListener('DOMContentLoaded',()=>{
  applyTheme(state.theme); setLang(state.lang);
  bindUI();
  state.branches = load(LS.b, []);
  state.snaps = load(LS.s, {});
  renderAll();
});

function bindUI(){
  document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  $('btnWeek').onclick=()=>preset(7); $('btnMonth').onclick=()=>preset(30);
  $('btnApply').onclick=renderAll; $('btnRecalculate').onclick=renderAll;
  $('seedDemo').onclick=()=>{ seed(); renderAll(); banner('✅ تم تجهيز البيانات'); };
  $('langToggle').onclick=()=>{ setLang(state.lang==='ar'?'en':'ar'); renderAll(); };
  $('themeToggle').onclick=()=>{ state.theme=(state.theme==='light')?'dark':'light'; applyTheme(state.theme); };
}

function t(k){ return i18n[state.lang][k] || k; }
function setLang(l){
  state.lang=(l==='en')?'en':'ar'; localStorage.setItem('v2hot_lang',state.lang);
  const ids=["tabDashboard","tabAdd","tabBranches","tabFiles","tabSettings","tabPublic","heroTitle","heroSubtitle","lblFrom","lblTo","btnWeek","btnMonth","btnApply","lblTarget","btnRecalculate","tblTitle","thName","thRating","thReviews","thBefore","thAfter","thChange","thToTarget","ch1Title","ch2Title","publicTitle","publicNote","settingsTitle","settingsTips","filesTitle","addTitle","branchesTitle","exportNote","footerText","rkBestTitle","rkMostTitle","rkWorstTitle","rkPointsTitle"];
  ids.forEach(id=>{ const el=$(id); if(el) el.textContent=t(id); });
  $('langToggle').textContent=t('langToggle');
  document.documentElement.lang=state.lang; document.documentElement.dir=(state.lang==='ar')?'rtl':'ltr';
}

function applyTheme(th){ document.documentElement.setAttribute('data-theme', th==='light'?'light':'dark'); $('themeToggle').textContent = th==='light'?t('themeToggleLight'):t('themeToggleDark'); localStorage.setItem('v2hot_theme', th); }
function switchTab(tab){ document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab)); document.querySelectorAll('main .tab').forEach(s=>s.classList.toggle('active', s.id===tab)); }
function load(k,f){ try{ return JSON.parse(localStorage.getItem(k)) ?? f; }catch{ return f; } }
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function preset(d){ const to=new Date(), from=new Date(); from.setDate(to.getDate()-d); $('dateFrom').value=to.toISOString().slice(0,10); $('dateTo').value=to.toISOString().slice(0,10); }
function banner(m){ const bar=$('alertBar'); bar.textContent=m; bar.style.display='block'; setTimeout(()=>bar.style.display='none',2000); }

function seed(){
  state.branches=[{id:crypto.randomUUID(),name:"ميدنايت – حي الريان"},{id:crypto.randomUUID(),name:"ميدنايت – حي المنار"},{id:crypto.randomUUID(),name:"ساف – حي القناة"},{id:crypto.randomUUID(),name:"مستر بروس – حي النهضة"}];
  state.snaps={};
  state.branches.forEach(b=>{
    let r=+(3.8+Math.random()*1).toFixed(2), v=40+Math.floor(Math.random()*160);
    for(let i=5;i>=0;i--){ const ts=Date.now()-i*24*3600*1000; r=+(r+(-0.05+Math.random()*0.1)).toFixed(2); if(r>5) r=5; if(r<2.8) r=2.8; v+=Math.floor(Math.random()*5); if(!state.snaps[b.id]) state.snaps[b.id]=[]; state.snaps[b.id].push({ts,rating:r,reviews:v}); }
  });
  save(LS.b,state.branches); save(LS.s,state.snaps);
}

function latest(id){ const a=state.snaps[id]||[]; return a[a.length-1]||null; }
function closest(id,t,mode){ const a=state.snaps[id]||[]; if(!a.length||!t) return null; if(mode==='before'){ for(let i=a.length-1;i>=0;i--){ if(a[i].ts<=t) return a[i]; } } if(mode==='after'){ for(let i=0;i<a.length;i++){ if(a[i].ts>=t) return a[i]; } } return null; }

function renderAll(){ renderRank(); renderCharts(); renderGridTable(); renderPublic(); }
function renderRank(){
  const list=state.branches.map(b=>({b,s:latest(b.id)})).filter(x=>x.s);
  if(!list.length) return;
  const best=list.reduce((a,c)=>c.s.rating>(a?.s.rating??-1)?c:a,null);
  const worst=list.reduce((a,c)=>c.s.rating<(a?.s.rating??99)?c:a,null);
  const most=list.reduce((a,c)=>c.s.reviews>(a?.s.reviews??-1)?c:a,null);
  $('rkBestTitle').textContent=t('rkBestTitle'); $('rkMostTitle').textContent=t('rkMostTitle'); $('rkWorstTitle').textContent=t('rkWorstTitle'); $('rkPointsTitle').textContent=t('rkPointsTitle');
  $('rkBestValue').textContent=best.b.name; $('rkBestSub').textContent='⭐ '+best.s.rating;
  $('rkWorstValue').textContent=worst.b.name; $('rkWorstSub').textContent='⭐ '+worst.s.rating;
  $('rkMostValue').textContent=most.b.name; $('rkMostSub').textContent='💬 '+most.s.reviews;
}

function renderCharts(){
  const labels=state.branches.map(b=>b.name);
  const ratings=state.branches.map(b=>latest(b.id)?.rating??null);
  const reviews=state.branches.map(b=>latest(b.id)?.reviews??null);
  if(state.charts.r) state.charts.r.destroy(); if(state.charts.v) state.charts.v.destroy();
  state.charts.r=new Chart(document.getElementById('chartRatings'),{type:'bar',data:{labels,datasets:[{label:t('thRating'),data:ratings}]},options:{responsive:true,scales:{y:{beginAtZero:true,max:5}}}});
  state.charts.v=new Chart(document.getElementById('chartReviews'),{type:'line',data:{labels,datasets:[{label:t('thReviews'),data:reviews}]},options:{responsive:true,scales:{y:{beginAtZero:true}}}});
}

function renderGridTable(){
  const grid=$('branchesGrid'), tbody=$('branchesTbody'); grid.innerHTML=''; tbody.innerHTML='';
  const from=$('dateFrom').value?new Date($('dateFrom').value):null; const to=$('dateTo').value?new Date($('dateTo').value):null;
  const target=parseFloat($('targetRating').value||'4.2');
  state.branches.forEach(b=>{
    const s=latest(b.id); const before=closest(b.id,from?from.getTime():null,'before'); const after=closest(b.id,to?to.getTime():null,'after');
    const card=document.createElement('div'); card.className='card'; card.innerHTML=`<h4>${b.name}</h4><p>${t('thRating')}: <b>${fmt(s?.rating)}</b> — ${t('thReviews')}: <b>${fmt(s?.reviews)}</b></p>`; grid.appendChild(card);
    const need=(s&&s.reviews!=null)?Math.max(0,Math.ceil(((target*s.reviews)-(s.rating*s.reviews))/(5-target))):null;
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${b.name}</td><td>${fmt(s?.rating)}</td><td>${fmt(s?.reviews)}</td>
      <td>${before?`${before.rating} / ${before.reviews}`:'—'}</td><td>${after?`${after.rating} / ${after.reviews}`:'—'}</td>
      <td>${diff(before,after)}</td><td>${need!=null?`تحتاج <b>${need}</b> تعليق 5⭐`:'—'}</td>`; tbody.appendChild(tr);
  });
}
function diff(b,a){ if(!b||!a) return '—'; const dr=(a.rating-b.rating).toFixed(2); const dv=a.reviews-b.reviews; const s=x=>x>0?'+':(x<0?'':''); return `${s(dr)}${dr} / ${s(dv)}${dv}`; }
function fmt(v){ return (v==null)?'—':v; }

function renderPublic(){ const g=$('publicGrid'); g.innerHTML=''; state.branches.forEach(b=>{ const s=latest(b.id); const c=document.createElement('div'); c.className='card'; c.innerHTML=`<h4>${b.name}</h4><p>${t('thRating')}: <b>${fmt(s?.rating)}</b> — ${t('thReviews')}: <b>${fmt(s?.reviews)}</b></p>`; g.appendChild(c); }); }
