// ===== Firebase 초기화 (안전 모드) =====
// ⚠️ 아래 firebaseConfig는 Firebase 콘솔 > 프로젝트 설정 > 웹앱 등록에서 발급받은 값으로 교체하세요.
// 설정값이 채워지기 전(또는 네트워크 문제)이라도 페이지가 통째로 멈추지 않도록,
// 초기화 실패를 흡수하고 db/auth/storage 를 null 로 내보냅니다.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// placeholder(YOUR_...) 값이 하나라도 남아 있으면 "미설정"으로 간주
export const isConfigured = !Object.values(firebaseConfig)
  .some(v => !v || String(v).includes("YOUR_"));

let db = null;
let storage = null;
let auth = null;

if (isConfigured) {
  try {
    const [{ initializeApp }, { getFirestore }, { getStorage }, { getAuth }] =
      await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"),
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js"),
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
      ]);
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  } catch (e) {
    console.warn("[Firebase] 초기화에 실패했습니다. 데이터 연동 기능이 비활성화됩니다.", e);
  }
} else {
  console.info("[Firebase] 설정값 미입력 상태입니다. (public/js/firebase-config.js) — 데이터 연동 기능은 비활성화되고 예시 콘텐츠가 표시됩니다.");
}

export { db, storage, auth };
