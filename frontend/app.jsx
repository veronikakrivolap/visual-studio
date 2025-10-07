import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const API = 'http://localhost:3001/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addTask = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const task = await res.json();
    setTasks([...tasks, task]);
    setText('');
  };

  const toggleTask = async id => {
    const task = tasks.find(t => t.id === id);
    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    const updated = await res.json();
    setTasks(tasks.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async id => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>To Do</h1>
      <form onSubmit={addTask} style={{ display: 'flex', gap: 8 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New task..." style={{ flex: 1 }} />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flex: 1 }}>{task.text}</span>
            <button onClick={() => deleteTask(task.id)} style={{ color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
