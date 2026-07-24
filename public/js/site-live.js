// ===== 관리자 저장값(회사 정보) 실시간 반영 =====
// Firestore site/info 문서를 읽어 SITE 기본값을 덮어쓰고
// 헤더·푸터를 다시 렌더링합니다. (미설정/실패 시 기본값 유지)
import { db } from './firebase-config.js';

function digits(s){ return String(s||'').replace(/\D/g,''); }

async function applySiteInfo(){
  if(!db) return;
  try{
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap = await getDoc(doc(db,'site','info'));
    if(!snap.exists()) return;
    const v = snap.data();
    // 값이 입력된 필드만 덮어쓰기
    ['name','ceo','tel','mobile','inquiryTel','kakao','address','hours','bizno','corpno','footerDesc']
      .forEach(k=>{ if(v[k]) SITE[k]=v[k]; });
    SITE.telRaw = digits(SITE.tel);
    SITE.mobileRaw = digits(SITE.mobile);

    // 헤더·푸터 재렌더
    if(typeof mountLayout==='function') mountLayout(window.__navActive);

    // 페이지 내 연락처·주소 요소 반영 (data-site-* 속성)
    document.querySelectorAll('[data-site-tel]').forEach(el=>{
      if(el.tagName==='A') el.href='tel:'+SITE.telRaw;
      const t=el.querySelector('[data-site-text]'); (t||el).textContent=SITE.tel;
    });
    document.querySelectorAll('[data-site-tel-btn]').forEach(el=>{
      el.href='tel:'+SITE.telRaw;
      const t=el.querySelector('span'); if(t) t.textContent=SITE.tel;
    });
    document.querySelectorAll('[data-site-mobile]').forEach(el=>{
      if(el.tagName==='A') el.href='tel:'+SITE.mobileRaw;
      const t=el.querySelector('[data-site-text]'); (t||el).textContent=SITE.mobile;
    });
    // 견적문의 전화 — 별도 번호가 있으면 그 번호, 없으면 대표 전화
    const iqTel = SITE.inquiryTel || SITE.tel;
    const iqRaw = digits(iqTel);
    document.querySelectorAll('[data-site-inquiry-tel]').forEach(el=>{
      if(el.tagName==='A') el.href='tel:'+iqRaw;
      el.textContent=iqTel;
    });
    document.querySelectorAll('[data-site-inquiry-tel-btn]').forEach(el=>{
      el.href='tel:'+iqRaw;
      const t=el.querySelector('span'); if(t) t.textContent=iqTel;
    });
    document.querySelectorAll('[data-site-address]').forEach(el=>el.textContent=SITE.address);
    document.querySelectorAll('[data-site-hours]').forEach(el=>el.textContent=SITE.hours);
    document.querySelectorAll('[data-site-maplink]').forEach(el=>{
      el.href='https://map.kakao.com/link/search/'+encodeURIComponent(SITE.address);
    });
    // 지도 좌표(lat/lng)가 저장돼 있으면 지도 이동 (location.html의 Leaflet 지도)
    if(v.lat && v.lng && typeof window.__moveMap==='function'){
      const lat=parseFloat(v.lat), lng=parseFloat(v.lng);
      if(!isNaN(lat) && !isNaN(lng)) window.__moveMap(lat,lng);
    }
    document.dispatchEvent(new CustomEvent('siteinfo',{detail:SITE}));
  }catch(e){ /* 실패 시 기본값 유지 */ }
}
applySiteInfo();

// ===== 테마(사이트 색상) 적용 =====
// 관리자 [디자인] 탭에서 저장한 색상(site/theme)을 CSS 변수로 반영.
// localStorage 캐시로 재방문 시 깜빡임을 최소화한다.
function hexToRgb(hex){
  const m=/^#?([0-9a-f]{6})$/i.exec(hex||''); if(!m) return null;
  const n=parseInt(m[1],16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}
function darken(hex,f){
  const c=hexToRgb(hex); if(!c) return hex;
  const h=v=>Math.round(v*f).toString(16).padStart(2,'0');
  return '#'+h(c.r)+h(c.g)+h(c.b);
}
function applyTheme(t){
  const r=document.documentElement.style;
  const VARS=['--green','--gold','--green-hover','--gold-dim','--gold-line','--bg','--bg-soft','--bg-soft2','--green-deep',
              '--partner-bg','--partner-line','--partner-text','--partner-text-hover','--partner-line-hover','--bg-tint','--page-head-bg'];
  if(!t){ VARS.forEach(k=>r.removeProperty(k)); return; }
  if(t.point && hexToRgb(t.point)){
    const c=hexToRgb(t.point);
    r.setProperty('--green',t.point); r.setProperty('--gold',t.point);
    r.setProperty('--green-hover',darken(t.point,.82));
    r.setProperty('--gold-dim',`rgba(${c.r},${c.g},${c.b},.30)`);
    r.setProperty('--gold-line',`rgba(${c.r},${c.g},${c.b},.16)`);
  }
  if(t.bg) r.setProperty('--bg',t.bg);
  if(t.card) r.setProperty('--bg-soft',t.card);
  if(t.chip) r.setProperty('--bg-soft2',t.chip);
  if(t.footer) r.setProperty('--green-deep',t.footer);
  // 부분 색상: 건설사 칩 배경·글자, 섹션 배경, 페이지 상단 배경
  if(t.partnerBg && hexToRgb(t.partnerBg)){
    r.setProperty('--partner-bg',t.partnerBg);
    r.setProperty('--partner-line',darken(t.partnerBg,.9));
  }
  if(t.partnerText && hexToRgb(t.partnerText)){
    const c=hexToRgb(t.partnerText);
    r.setProperty('--partner-text',t.partnerText);
    r.setProperty('--partner-text-hover',darken(t.partnerText,.72));
    r.setProperty('--partner-line-hover',`rgba(${c.r},${c.g},${c.b},.45)`);
  }
  if(t.tint) r.setProperty('--bg-tint',t.tint);
  if(t.pageHead) r.setProperty('--page-head-bg',t.pageHead);
}
try{ const c=localStorage.getItem('sf-theme'); if(c) applyTheme(JSON.parse(c)); }catch(e){}
(async function loadTheme(){
  if(!db) return;
  try{
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap = await getDoc(doc(db,'site','theme'));
    if(snap.exists()){
      const t=snap.data(); applyTheme(t);
      try{ localStorage.setItem('sf-theme',JSON.stringify(t)); }catch(e){}
    }else{
      try{ localStorage.removeItem('sf-theme'); }catch(e){}
      applyTheme(null);
    }
  }catch(e){ /* 실패 시 기본/캐시 색상 유지 */ }
})();
