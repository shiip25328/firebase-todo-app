// src/api/firebase/firestore.js
import { db } from '../../config/firebase'; // 初期化されたdbインスタンスをインポート
import {
  collection, // コレクション参照用
  getDocs,    // ドキュメント複数取得
  addDoc,     // ドキュメント新規追加
  doc,        // 特定ドキュメント参照用
  updateDoc,  // ドキュメント更新
  deleteDoc,  // ドキュメント削除
  serverTimestamp, // サーバー側のタイムスタンプ
  query,       // クエリ用
  orderBy     // 並び替え用
} from "firebase/firestore";

// Firestoreの 'todos' コレクションへの参照
const todosCollectionRef = collection(db, "todos");

// 全てのTODOを取得する関数 (作成日時順に並び替え)
export const getTodos = async () => {
  try {
    // 作成日時(createdAt)で降順(desc)に並び替えるクエリ
    const q = query(todosCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    // ドキュメントのデータを配列に整形して返す
    return querySnapshot.docs.map((doc) => ({
      id: doc.id, // ドキュメントIDも取得
      ...doc.data(), // ドキュメントのデータ (...はスプレッド構文)
    }));
  } catch (error) {
    console.error("Error getting todos: ", error);
    throw error; // エラーを呼び出し元に伝える
  }
};

// 新しいTODOを追加する関数
export const addTodo = async (text, priority = 3) => {// priorityのデフォルト値を3に設定
  try {
    // 追加するデータ
    const newTodo = {
      text: text,          // TODOの内容
      completed: false,    // 初期状態は未完了
      priority: Number(priority), // 数値として保存
      createdAt: serverTimestamp(), // 作成日時 (サーバー側で設定)
    };
    const docRef = await addDoc(todosCollectionRef, newTodo);
    console.log("Todo added with ID: ", docRef.id);
    return docRef.id; // 追加されたドキュメントのIDを返す (必要なら)
  } catch (error) {
    console.error("Error adding todo: ", error);
    throw error;
  }
};

// TODOの完了状態を切り替える関数
export const toggleTodoComplete = async (id, currentStatus) => {
  try {
    const todoDocRef = doc(db, "todos", id); // 更新するドキュメントへの参照
    await updateDoc(todoDocRef, {
      completed: !currentStatus, // 現在の状態を反転させる
    });
    console.log("Todo toggled: ", id);
  } catch (error) {
    console.error("Error toggling todo: ", error);
    throw error;
  }
};

// 新規追加: 重要度を更新する関数
export const updateTodoPriority = async (id, newPriority) => {
    try {
      const todoDocRef = doc(db, "todos", id);
      await updateDoc(todoDocRef, {
        priority: Number(newPriority), // 数値として保存
      });
      console.log("Todo priority updated: ", id, "to", newPriority);
    } catch (error) {
      console.error("Error updating todo priority: ", error);
      throw error;
    }
  };

// TODOを削除する関数
export const deleteTodo = async (id) => {
  try {
    const todoDocRef = doc(db, "todos", id); // 削除するドキュメントへの参照
    await deleteDoc(todoDocRef);
    console.log("Todo deleted: ", id);
  } catch (error) {
    console.error("Error deleting todo: ", error);
    throw error;
  }
};