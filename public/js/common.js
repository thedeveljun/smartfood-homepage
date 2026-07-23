// ===== 공통 스크립트 =====
// 회사 정보 (기본값 — 관리자 대시보드 [회사 정보]에서 저장하면 site/info 값으로 덮어써짐)
const SITE = {
  name: "스마트푸드(주)",
  ceo: "이선유",
  tel: "010-3982-4923",
  telRaw: "01039824923",
  mobile: "010-2360-9015",
  mobileRaw: "01023609015",
  kakao: "https://pf.kakao.com/_yourchannel",   // 카카오톡 채널 URL로 교체
  address: "경기도 안양시 동안구 시민대로 230 B동 609호",
  addressNote: "지하철 4호선 평촌역 인근 (관양동)",
  hours: "평일 09:00 ~ 18:00 (상담 가능)",
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
      <span>전국 건설현장 식당 운영 · <a href="admin/" style="opacity:.65"><i class="ti ti-settings" style="font-size:12px"></i> 관리자</a></span>
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

// ===== 자동 식단 생성 (계절 인식) =====
// 날짜를 시드로 매일 다른 식단을 자동 구성한다 (같은 날짜엔 항상 같은 식단).
// 계절별 주간 식단표(img/sites/menu_*.jpg)의 실제 메뉴를 바탕으로
// 봄(3~5월)·여름(6~8월)·가을(9~11월)·겨울(12~2월) 메뉴가 자동으로 바뀐다.
// 관리자가 해당 날짜 식단을 직접 등록하면 그 식단이 우선 표시된다.
const MENU_COMMON = {
  rice:    ['현미밥','잡곡밥','흑미밥','백미밥','보리밥','기장밥','수수밥'],
  kimchi:  ['포기김치','깍두기','열무김치','총각김치','백김치'],
  dessert: ['제철 과일','식혜','요구르트','수정과','미니약과','바나나','귤']
};
const MENU_SEASON = {
  spring: {  // 봄 (3~5월)
    soup:  ['청국장찌개','닭개장','근대된장국','부대찌개','소고기무국','홍합국','참치김치찌개','콩나물김치국','순두부찌개','선지해장국'],
    main:  ['제육볶음','돈육갈비찜','수제탕수육','닭강정','생선가스','소불고기','오징어볶음','코다리조림','갈치구이','오삼불고기','돈육강정','마파두부'],
    side:  ['가지튀김','메추리알조림','야채튀김','고구마튀김','계란장조림','동그랑땡','두부구이','두부조림','어묵볶음','호박볶음'],
    namul: ['미나리무생채','봄동된장무침','달래도토리묵무침','쑥갓나물','부추생채','오이달래무침','청경채나물','얼갈이나물','해파리냉채','돈나물초장']
  },
  summer: {  // 여름 (6~8월)
    soup:  ['오이미역냉국','가지냉국','열무된장국','감자고추장찌개','사골우거지국','황태국','들깨미역국','오징어무국','건새우아욱국','버섯부대찌개'],
    main:  ['삼계탕','LA갈비찜','돼지갈비찜','탕수육','꽁치소금구이','자반고등어','쭈꾸미볶음','돈육김치볶음','아구미더덕찜','고등어김치조림','제육볶음','바지락살부침개'],
    side:  ['감자전','김치전','해물파전','호박전','야채튀김','고구마튀김','꽈리고추멸치볶음','해물완자전','삶은두부','모듬야채튀김'],
    namul: ['노각생채','상추겉절이','오이부추무침','부추겉절이','천사채샐러드','숙주미나리무침','참나물생채','치커리생채','고추잎나물','머위대무침']
  },
  fall: {    // 가을 (9~11월)
    soup:  ['올갱이된장국','토란탕','갈비탕','대구지리','콩나물해장국','동태찌개','열무두부된장국','바지락미역국','짬뽕국','오징어호박찌개'],
    main:  ['양념조기찜','사태떡찜','편육','가자미카레튀김','복어양념구이','갈치양념조림','이면수구이','병어조림','낙지볶음','코다리무조림','돈육김치볶음','홍어회무침'],
    side:  ['고구마튀김','감자볶음','부추해물전','김치전','명엽채볶음','꽈리감자조림','어묵꽈리고추조림','오징어김치전','베이컨달걀찜','계란장조림'],
    namul: ['깻순나물무침','취나물들깨가루무침','도라지생채','시금치무침','비름나물된장무침','양배추겨자무침','무말랭이무침','해초무침','고추장더덕무침','열무겉절이']
  },
  winter: {  // 겨울 (12~2월)
    soup:  ['동태찌개','등뼈우거지탕','시래기된장국','김치콩나물국','북어국','콩나물된장국','소고기미역국','유부된장국','닭계장','김치돈찌개'],
    main:  ['돈불고기','생선가스','탕수육','고등어조림','소고기볶음','닭볶음탕','조기구이','미트볼피망볶음','돈가스','고등어무우조림'],
    side:  ['잡채','계란찜','두부조림','감자채볶음','멸치꽈리볶음','알송이조림','콩조림','두부튀김','느타리버섯볶음','애호박새우볶음'],
    namul: ['시금치나물','청포묵무침','도토리묵무침','무나물','고사리나물','미역줄기볶음','배추겉절이','무생채','숙주나물','치커리무침']
  }
};
function seasonOf(month){
  if(month>=3 && month<=5)  return 'spring';
  if(month>=6 && month<=8)  return 'summer';
  if(month>=9 && month<=11) return 'fall';
  return 'winter';
}
function autoMenu(dateStr){
  // 'YYYY-MM-DD' → 일 단위 시드 (풀 길이가 서로 달라 조합이 오래 반복되지 않음)
  const d = new Date(dateStr + 'T00:00:00');
  const seed = Math.floor(d.getTime() / 86400000);
  const s = MENU_SEASON[seasonOf(d.getMonth() + 1)];
  const pick = (arr, off) => arr[(seed + off) % arr.length];
  return [
    pick(MENU_COMMON.rice, 0),   pick(s.soup, 3),  pick(s.main, 5),
    pick(s.side, 2),             pick(s.namul, 4), pick(MENU_COMMON.kimchi, 1),
    pick(MENU_COMMON.dessert, 6)
  ];
}
