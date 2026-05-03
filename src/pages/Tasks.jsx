import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  // Load tasks from Firestore in realtime
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(data);
    });
    return () => unsubscribe();
  }, []);

  // Add new task to Firestore
  const addTask = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask,
        completed: false,
        priority: 'medium',
        meta: `Added by ${auth.currentUser?.displayName || 'You'} · Just now`,
        createdAt: new Date(),
        uid: auth.currentUser?.uid,
      });
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  // Toggle task complete/incomplete
  const toggleTask = async (id, current) => {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !current,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="page-wrapper">
      <Sidebar active="Tasks" />

      <main className="page-main">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="page-title">Tasks</div>
            <div className="page-subtitle">
              {pending.length} pending · {completed.length} completed
            </div>
          </div>
        </motion.div>

        {/* Add Task */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}
        >
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="chat-input"
            style={{ flex: 1 }}
          />
          <button
            className="btn-primary-custom"
            onClick={addTask}
            disabled={loading}
          >
            {loading ? '...' : '+ Add'}
          </button>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#475569',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Pending — {pending.length}
          </div>

          <div className="task-list">
            {pending.length === 0 && (
              <div style={{ color: '#475569', fontSize: '13px', padding: '1rem' }}>
                No pending tasks 🎉
              </div>
            )}
            {pending.map((task) => (
              <div
                key={task.id}
                className="task-item"
                onClick={() => toggleTask(task.id, task.completed)}
              >
                <div className="task-checkbox" />
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">{task.meta}</div>
                </div>
                <span className={`task-priority priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ marginTop: '2rem' }}
        >
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#475569',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Completed — {completed.length}
          </div>

          <div className="task-list">
            {completed.length === 0 && (
              <div style={{ color: '#475569', fontSize: '13px', padding: '1rem' }}>
                No completed tasks yet
              </div>
            )}
            {completed.map((task) => (
              <div
                key={task.id}
                className="task-item completed"
                onClick={() => toggleTask(task.id, task.completed)}
              >
                <div className="task-checkbox checked">✓</div>
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">{task.meta}</div>
                </div>
                <span className={`task-priority priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}