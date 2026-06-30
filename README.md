# 스마트푸드(주) 홈페이지

건설현장 식당 전문기업 **스마트푸드(주)** 의 공식 홈페이지입니다.
정적 웹(HTML/CSS/JavaScript) + **Firebase**(Hosting / Firestore / Storage / Auth)로 구성했으며,
신선한 화이트+그린 테마에 시원한 틸(teal) 포인트를 적용한 반응형 사이트입니다.

- **저장소**: https://github.com/thedeveljun/smartfood-homepage (Private)
- **기본 브랜치**: `main`

---

## 1. 빠르게 시작하기

### 1) 저장소 클론

```bash
git clone https://github.com/thedeveljun/smartfood-homepage.git
cd smartfood-homepage
```

### 2) 로컬 미리보기

이 사이트는 ES 모듈(`import`)을 사용하므로 **파일을 더블클릭(file://)하면 동작하지 않습니다.**
반드시 로컬 HTTP 서버로 띄워야 합니다. 아래 중 편한 방법을 사용하세요.

```bash
# 방법 A) Node가 있으면 (설치 불필요)
npx serve public
#  → http://localhost:3000

# 방법 B) Firebase CLI가 있으면
firebase serve --only hosting
#  → http://localhost:5000

# 방법 C) Python 3가 있으면
cd public && python -m http.server 8000
#  → http://localhost:8000
```

> Firebase 설정값(아래 3단계)을 넣기 전에는 식단·문의·관리자 등 데이터 연동 기능은
> "Firebase 설정 확인" 안내만 표시됩니다. 디자인·레이아웃 확인에는 문제 없습니다.

---

## 2. 폴더 구조

```
smartfood-homepage/
├─ firebase.json          # Firebase Hosting 설정
├─ firestore.rules        # Firestore 보안 규칙 (입력 검증 포함)
├─ storage.rules          # Storage 보안 규칙 (이미지·용량 제한)
├─ .firebaserc            # 프로젝트 ID
├─ .gitignore
├─ README.md
└─ public/                # 실제 배포되는 웹사이트
   ├─ index.html          # 메인 (오늘의 식단 / 서비스 / 운영절차 / 거래 건설사)
   ├─ about.html          # 회사소개 (개요·연혁·조직도·핵심가치)
   ├─ service.html        # 서비스 (사업분야·3대 서비스 정책·운영방안·위생관리)
   ├─ menu.html           # 오늘의 식단 (Firestore) + 계절별 주간 식단표
   ├─ records.html        # 운영 실적 + 현장식당 사진
   ├─ contact.html        # 견적 문의 (Firestore 저장)
   ├─ location.html       # 오시는 길
   ├─ css/style.css       # 공통 스타일 (프레시 그린 테마)
   ├─ img/sites/          # 현장식당 사진 · 계절별 메뉴표 이미지
   ├─ js/
   │  ├─ firebase-config.js  # ⚠️ Firebase 설정값 입력 필요
   │  └─ common.js           # 헤더·푸터·회사정보(SITE)
   └─ admin/
      ├─ index.html       # 관리자 로그인
      └─ dashboard.html   # 관리자 대시보드 (식단 / 공지 / 문의)
```

---

## 3. Firebase 프로젝트 준비

1. https://console.firebase.google.com 에서 프로젝트 생성
2. **빌드 > Authentication** → 시작하기 → 로그인 방법 **이메일/비밀번호** 사용 설정
   - 사용자 탭에서 관리자 계정 직접 추가 (예: `admin@smartfood.kr`)
3. **빌드 > Firestore Database** → 데이터베이스 만들기
4. **빌드 > Storage** → 시작하기
5. **프로젝트 설정 > 일반 > 내 앱 > 웹 앱 추가** → `firebaseConfig` 값 복사

### 설정값 입력

- `public/js/firebase-config.js` 의 `firebaseConfig`를 콘솔에서 복사한 값으로 교체
- `.firebaserc` 의 `YOUR_PROJECT_ID`를 실제 프로젝트 ID로 교체
- 회사 정보(전화·주소·카톡 채널 등)는 `public/js/common.js` 상단 **`SITE`** 객체에서 수정

---

## 4. 배포 (Firebase Hosting)

```bash
npm install -g firebase-tools     # 최초 1회
firebase login                    # 최초 1회
firebase deploy                   # 호스팅 + 보안 규칙 함께 배포
```

부분 배포가 필요하면:

```bash
firebase deploy --only hosting                       # 사이트만
firebase deploy --only firestore:rules,storage       # 보안 규칙만
```

배포 후 `https://<프로젝트ID>.web.app` 로 접속됩니다.

---

## 5. 데이터 구조 (Firestore)

| 컬렉션 | 필드 | 용도 |
|--------|------|------|
| `menus` | `date`, `mealType`, `items[]`, `createdAt` | 오늘의 식단 |
| `notices` | `title`, `body`, `createdAt` | 공지사항 |
| `inquiries` | `name`, `phone`, `company`, `count`, `type`, `message`, `status`, `createdAt` | 견적 문의 |

> 보안 규칙: 읽기는 공개, 쓰기는 로그인 관리자만. `inquiries` 생성은 누구나 가능하되
> 필드·길이 검증으로 스팸을 차단합니다. Storage 업로드는 이미지·10MB 이하만 허용합니다.

---

## 6. 관리자 사용법

`https://<프로젝트ID>.web.app/admin/` 접속 → 관리자 계정 로그인
→ **식단 등록 / 공지 작성 / 견적 문의 내역 확인**

---

## 7. 변경사항 올리기 (Git)

```bash
git add -A
git commit -m "변경 내용 요약"
git push
```

---

## 참고

- `public/img/sites/` 의 현장식당 사진·계절별 메뉴표는 회사 지명원에서 가져온 실제 자료입니다.
- 지도는 `location.html` 의 iframe `src` 주소로 위치를 조정합니다.
- 카카오톡 상담 버튼은 `common.js` 의 `SITE.kakao` 에 카카오 채널 URL을 넣으면 동작합니다.
- 회사 이메일 등 일부 항목은 추후 확정 시 `common.js` 에서 보강하세요.
