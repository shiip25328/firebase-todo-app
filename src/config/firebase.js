// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // 認証を使う場合はコメント解除
// import { getStorage } from "firebase/storage"; // Storageを使う場合はコメント解除

// .envファイルから設定情報を読み込む
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firestoreのインスタンスを取得してエクスポート
export const db = getFirestore(app);

// 他のサービスも必要ならエクスポート
// export const auth = getAuth(app);
// export const storage = getStorage(app);

console.log("Firebase Initialized with Project ID:", firebaseConfig.projectId); // 初期化確認用ログ