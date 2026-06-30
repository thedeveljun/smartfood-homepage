# 스마트푸드(주) 홈페이지 — 설정 및 배포 가이드

건설현장 전문 급식 홈페이지입니다. HTML/CSS/JavaScript + Firebase(Hosting / Firestore / Storage / Auth)로 구성했습니다.

## 1. 폴더 구조

```
hamba-site/
├─ firebase.json          # Firebase Hosting 설정
├─ firestore.rules        # Firestore 보안 규칙
├─ storage.rules          # Storage 보안 규칙
├─ .firebaserc            # 프로젝트 ID
└─ public/                # 실제 배포되는 웹사이트
   ├─ index.html          # 메인
   ├─ about.html          # 회사소개
   ├─ service.html        # 서비스 소개
   ├─ menu.html           # 오늘의 식단 (Firestore 연동)
   ├─ gallery.html        # 식사 사진 (Storage 연동)
   ├─ records.html        # 납품 실적
   ├─ contact.html        # 견적 문의 (Firestore 저장)
   ├─ location.html       # 오시는 길
   ├─ css/style.css       # 공통 스타일 (다크 럭셔리 테마)
   ├─ js/
   │  ├─ firebase-config.js  # ⚠️ Firebase 설정값 입력 필요
   │  └─ common.js           # 헤더·푸터·회사정보
   └─ admin/
      ├─ index.html       # 관리자 로그인
      └─ dashboard.html   # 관리자 대시보드 (식단/사진/공지/문의)
```

## 2. Firebase 프로젝트 준비

1. https://console.firebase.google.com 에서 프로젝트 생성
2. **빌드 > Authentication** → 시작하기 → 로그인 방법 **이메일/비밀번호** 사용 설정
   - 사용자 탭에서 관리자 계정 직접 추가 (예: admin@daesungfood.kr)
3. **빌드 > Firestore Database** → 데이터베이스 만들기
4. **빌드 > Storage** → 시작하기 (Blaze 요금제 필요할 수 있음)
5. **프로젝트 설정 > 일반 > 내 앱 > 웹 앱 추가** → `firebaseConfig` 값 복사

## 3. 설정값 입력

`public/js/firebase-config.js` 의 `firebaseConfig`를 콘솔에서 복사한 값으로 교체합니다.

`.firebaserc`의 `YOUR_PROJECT_ID`도 실제 프로젝트 ID로 교체합니다.

회사 정보(전화, 카톡 채널, 주소 등)는 `public/js/common.js` 상단 `SITE` 객체에서 수정합니다.

## 4. 배포

```bash
npm install -g firebase-tools     # 최초 1회
firebase login
cd hamba-site
firebase deploy
```

배포 후 `https://YOUR_PROJECT_ID.web.app` 로 접속됩니다.
보안 규칙도 함께 배포됩니다 (firestore.rules, storage.rules).

## 5. 데이터 구조 (Firestore)

- `menus` — { date, mealType, items[], createdAt }  ← 식단
- `notices` — { title, body, createdAt }            ← 공지사항
- `inquiries` — { name, phone, company, count, type, message, status, createdAt } ← 견적 문의

## 6. 관리자 사용법

`https://YOUR_PROJECT_ID.web.app/admin/` 접속 → 관리자 계정 로그인
→ 식단 등록 / 사진 업로드 / 공지 작성 / 문의 내역 확인

## 참고

- 이미지 placeholder, 실적 표, 후기 등은 샘플 데이터입니다. 실제 내용으로 교체하세요.
- 지도는 location.html의 iframe `src`를 실제 주소로 교체하세요.
- 카카오톡 상담 버튼은 카카오 채널 URL을 common.js의 `SITE.kakao`에 넣으면 동작합니다.
