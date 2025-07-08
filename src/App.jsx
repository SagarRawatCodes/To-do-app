/*import { useState, useEffect } from "react";
import "./App.css";

function App() {
  
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []; 
    const savedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []; 
    setTasks(savedTasks);
    setCompletedTasks(savedCompletedTasks);
  }, []);

  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks)); 
  }, [tasks, completedTasks]);


 
  const addTask = () => {
    if (task.trim() !== "") { 
      setTasks([...tasks, { text: task, category, dueDate }]); 
      setTask("");
      setDueDate("");
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const undoTask = (index) => {
    const taskToUndo = completedTasks[index];
    setTasks([...tasks, taskToUndo]);
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
  };

  const startEditing = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editIndex].text = editText;
    setTasks(updatedTasks);
    setEditIndex(null);
  };

  return (
    <div className="container">
      <h1>To-Do-List App</h1>

      
     <p className="field-label">Enter Task!</p>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task here"
      />

     
      <p className="field-label">Category</p>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="Shopping">Shopping</option>
      </select>

     
      <p className="field-label">Due Date</p>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>

      <h2 className="active-tasks-title">Active Tasks</h2>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={saveEdit}>💾 Save</button>
              </>
            ) : (
              <>
                {t.text} ({t.category}) {t.dueDate && `- Due: ${t.dueDate}`}
                <button onClick={() => completeTask(index)}>✅</button>
                <button onClick={() => deleteTask(index)}>❌</button>
                <button onClick={() => startEditing(index, t.text)}>
                  ✏️ Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      

      {/* Task DropDowns
      <button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? "Hide Completed tasks ⬆" : "Show Completed Tasks ⬇"}
      </button>

      {showCompleted && (
        <div className="completed-section">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((t,index) => (
              <li key={index} className="completed-task">
                {t.text} ({t.category}) {t.dueDate && `- Due: ${t.dueDate}`}
                <button onClick={() => undoTask(index)}>↩ Undo</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

*/

import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => {
        const active = res.data.filter(t => !t.completed);
        const done = res.data.filter(t => t.completed);
        setTasks(active);
        setCompletedTasks(done);
      })
      .catch(console.error);
  }, []);

  const addTask = () => {
    if (task.trim()) {
      axios.post('http://localhost:5000/api/tasks', {
        text: task, category, dueDate, completed: false
      })
      .then(res => setTasks(prev => [...prev, res.data]))
      .catch(console.error);
      setTask('');
      setDueDate('');
    }
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(prev => prev.filter(t => t._id !== id)))
      .catch(console.error);
  };

  const completeTask = (id) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: true })
      .then(res => {
        setTasks(prev => prev.filter(t => t._id !== id));
        setCompletedTasks(prev => [...prev, res.data]);
      })
      .catch(console.error);
  };

  const undoTask = (id) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: false })
      .then(res => {
        setCompletedTasks(prev => prev.filter(t => t._id !== id));
        setTasks(prev => [...prev, res.data]);
      })
      .catch(console.error);
  };

  const startEditing = (id, text) => {
    setEditIndex(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { text: editText })
      .then(res => {
        setTasks(prev => prev.map(t => t._id === id ? res.data : t));
        setEditIndex(null);
      })
      .catch(console.error);
  };

  return (
    <div className="container">
      <h1>To‑Do‑List App</h1>

      <p className="field-label">Enter Task!</p>
      <input value={task} onChange={e => setTask(e.target.value)} placeholder="Enter your task" />
      
      <p className="field-label">Category</p>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>Personal</option>
        <option>Work</option>
        <option>Shopping</option>
      </select>

      <p className="field-label">Due Date</p>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />

      <button onClick={addTask}>Add Task</button>

      <h2 className="active-tasks-title">Active Tasks</h2>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            {editIndex === t._id ? (
              <>
                <input value={editText} onChange={e => setEditText(e.target.value)} />
                <button onClick={() => saveEdit(t._id)}>💾 Save</button>
              </>
            ) : (
              <>
                {t.text} ({t.category}) {t.dueDate && `– Due: ${t.dueDate}`}
                <button onClick={() => completeTask(t._id)}>✅</button>
                <button onClick={() => deleteTask(t._id)}>❌</button>
                <button onClick={() => startEditing(t._id, t.text)}>✏️ Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? 'Hide Completed ⬆' : 'Show Completed ⬇'}
      </button>

      {showCompleted && (
        <div className="completed-section">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map(t => (
              <li key={t._id} className="completed-task">
                {t.text} ({t.category}) {t.dueDate && `– Due: ${t.dueDate}`}
                <button onClick={() => undoTask(t._id)}>↩ Undo</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
