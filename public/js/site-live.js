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
    ['name','ceo','tel','mobile','kakao','address','addressNote','hours','bizno','corpno','footerDesc']
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
    document.querySelectorAll('[data-site-address]').forEach(el=>el.textContent=SITE.address);
    document.querySelectorAll('[data-site-address-note]').forEach(el=>el.textContent=SITE.addressNote);
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
