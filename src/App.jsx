// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getTodos, addTodo, toggleTodoComplete, deleteTodo } from './api/firebase/firestore'; // 作成したAPI関数をインポート

function App() {
  const [todos, setTodos] = useState([]); // TODOリストの状態
  const [newTodoText, setNewTodoText] = useState(''); // 新規TODO入力テキストの状態
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラー状態

  // --- データ取得関数 ---
  const fetchTodos = useCallback(async () => {
    setIsLoading(true); // ローディング開始
    setError(null); // エラーをリセット
    try {
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError("TODOリストの読み込みに失敗しました。");
    } finally {
      setIsLoading(false); // ローディング終了
    }
  }, []); // useCallbackで関数をメモ化

  // --- 初期表示時にTODOリストを取得 ---
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // fetchTodosが変更されたとき（初回のみ）実行

  // --- 新規TODO追加処理 ---
  const handleAddTodo = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    if (!newTodoText.trim()) return; // 空文字の場合は追加しない

    try {
      await addTodo(newTodoText);
      setNewTodoText(''); // 入力欄をクリア
      fetchTodos(); // リストを再取得して更新
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("TODOの追加に失敗しました。");
    }
  };

  // --- TODO完了状態切り替え処理 ---
  const handleToggleComplete = async (id, completed) => {
    try {
      await toggleTodoComplete(id, completed);
      // 状態を即時反映させる（より良いUXのため）
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
      // 必要なら再取得 fetchTodos();
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      setError("TODOの更新に失敗しました。");
    }
  };

  // --- TODO削除処理 ---
  const handleDeleteTodo = async (id) => {
    // 確認ダイアログ（任意）
    // if (!window.confirm("本当に削除しますか？")) return;
    try {
      await deleteTodo(id);
      // 状態を即時反映させる
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      // 必要なら再取得 fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("TODOの削除に失敗しました。");
    }
  };

  // --- レンダリング ---
  return (
    <div className="App">
      <h1>React Firebase TODO App</h1>

      {/* 新規TODO追加フォーム */}
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="新しいTODOを入力"
          disabled={isLoading} // ローディング中は無効化
        />
        <button type="submit" disabled={isLoading || !newTodoText.trim()}>
          {isLoading ? '追加中...' : '追加'}
        </button>
      </form>

      {/* エラーメッセージ表示 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ローディング表示 */}
      {isLoading && <p>読み込み中...</p>}

      {/* TODOリスト表示 */}
      {!isLoading && !error && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
              <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
       {!isLoading && !error && todos.length === 0 && (
          <p>TODOはありません。</p>
       )}
    </div>
  );
}

export default App;