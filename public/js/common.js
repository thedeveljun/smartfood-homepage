// ===== 공통 스크립트 =====
// 회사 정보 (기본값 — 관리자 대시보드 [회사 정보]에서 저장하면 site/info 값으로 덮어써짐)
const SITE = {
  name: "스마트푸드(주)",
  ceo: "이선유",
  tel: "031-421-8332",
  telRaw: "0314218332",
  mobile: "010-2360-9015",
  mobileRaw: "01023609015",
  kakao: "https://pf.kakao.com/_yourchannel",   // 카카오톡 채널 URL로 교체
  address: "경기도 안양시 동안구 시민대로 230 B동 609호",
  addressNote: "지하철 4호선 평촌역 인근 (관양동)",
  hours: "평일 08:00 ~ 18:00 (상담 가능)",
  bizno: "430-86-00146",
  corpno: "134111-0398409",
  footerDesc: "건설현장 식당 전문기업\n신선하고 알찬 식단으로\n건강한 현장을 책임집니다."
};

// 헤더 렌더
function renderHeader(active){
  const menu = [
    ["index.html","메인","home"],
    ["about.html","회사소개","about"],
    ["service.html","서비스","service"],
    ["menu.html","오늘의 식단","menu"],
    ["records.html","운영 실적","records"],
    ["contact.html","견적 문의","contact"],
    ["location.html","오시는 길","location"],
  ];
  const links = menu.map(([href,label,key])=>
    `<a href="${href}" class="${active===key?'active':''}">${label}</a>`).join("");
  return `
  <header class="header"><div class="container nav">
    <a href="index.html" class="logo">
      <img src="img/logo.jpg" class="logo-img" alt="${SITE.name}">
    </a>
    <button class="nav-toggle" onclick="document.getElementById('navMenu').classList.toggle('open')"><i class="ti ti-menu-2"></i></button>
    <nav class="nav-menu" id="navMenu">
      ${links}
    </nav>
  </div></header>`;
}

// 푸터 렌더
function renderFooter(){
  return `
  <footer class="footer"><div class="container">
    <div class="footer-grid">
      <div>
        <div class="logo" style="margin-bottom:14px"><img src="img/logo.jpg" class="logo-img logo-img--footer" alt="${SITE.name}"></div>
        <p>${(SITE.footerDesc||'').split('\n').join('<br>')}</p>
      </div>
      <div>
        <h4>바로가기</h4>
        <p><a href="about.html">회사소개</a><br><a href="menu.html">오늘의 식단</a><br>
        <a href="records.html">운영 실적</a><br><a href="contact.html">견적 문의</a></p>
      </div>
      <div>
        <h4>연락처</h4>
        <p><i class="ti ti-phone"></i> ${SITE.tel}<br>
        <i class="ti ti-device-mobile"></i> ${SITE.mobile}<br>
        <i class="ti ti-map-pin"></i> ${SITE.address}</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 ${SITE.name}. 대표이사 ${SITE.ceo} · 사업자등록번호 ${SITE.bizno}</span>
      <span>전국 건설현장 식당 운영</span>
    </div>
  </div></footer>
  <div class="floating">
    <a href="tel:${SITE.telRaw}" class="float-tel" aria-label="전화"><i class="ti ti-phone"></i></a>
    <a href="${SITE.kakao}" class="float-kakao" target="_blank" aria-label="카카오톡 상담"><i class="ti ti-message-circle"></i></a>
  </div>`;
}

// 파비콘(브라우저 탭 심볼) 일괄 적용
function setFavicon(){
  let link = document.querySelector("link[rel~='icon']");
  if(!link){ link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.type = 'image/jpeg';
  link.href = 'img/symbol.jpg';
}

function mountLayout(active){
  window.__navActive = active;           // site-live.js가 회사정보 반영 후 재렌더할 때 사용
  setFavicon();
  const h=document.getElementById('header-slot'); if(h) h.innerHTML=renderHeader(active);
  const f=document.getElementById('footer-slot'); if(f) f.innerHTML=renderFooter();
}
