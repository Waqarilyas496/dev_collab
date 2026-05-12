import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    desc: '',
    category: 'Web App',
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        title: form.title,
        desc: form.desc,
        category: form.category,
        ownerName: auth.currentUser?.displayName || 'Unknown',
        ownerUid: auth.currentUser?.uid,
        ownerEmail: auth.currentUser?.email,
        createdAt: new Date(),
        color: getRandomColor(),
      });
      setForm({ title: '', desc: '', category: 'Web App' });
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id, ownerUid) => {
    if (ownerUid !== auth.currentUser?.uid) {
      alert('You can only delete your own projects!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#a855f7', '#22c55e', '#eab308', '#ef4444', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const categories = ['Web App', 'Mobile App', 'API', 'Design', 'Other'];

  const getCategoryIcon = (category) => {
    if (category === 'Web App') return '🌐';
    if (category === 'Mobile App') return '📱';
    if (category === 'API') return '🔗';
    if (category === 'Design') return '🎨';
    return '📁';
  };

  return (
    <div className="page-wrapper">
      <Sidebar active="Projects" />

      <main className="page-main">

        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="page-title">Projects</div>
            <div className="page-subtitle">{projects.length} total projects</div>
          </div>
          <button
            className="btn-primary-custom"
            onClick={() => setShowModal(true)}
          >
            + New Project
          </button>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: '#475569',
            fontSize: '14px',
          }}>
            No projects yet — create your first one! 🚀
          </div>
        ) : (
          <div className="grid-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                className="page-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="card-top">
                  <div
                    className="card-icon"
                    style={{ background: p.color + '22', fontSize: '20px' }}
                  >
                    {getCategoryIcon(p.category)}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: p.color + '22',
                    color: p.color,
                    fontWeight: '500',
                  }}>
                    {p.category}
                  </span>
                </div>

                <div className="card-title">{p.title}</div>
                <div className="card-desc">
                  {p.desc || 'No description provided.'}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '1rem',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {p.ownerName?.[0] || 'U'}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#f1f5f9',
                      fontWeight: '500',
                    }}>
                      {p.ownerName}
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569' }}>
                      Project Owner
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
  navigate('/messages', { state: { userId: p.ownerUid, userName: p.ownerName, userEmail: p.ownerEmail } });
}}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    Contact
                  </button>

                  {p.ownerUid === auth.currentUser?.uid && (
                    <button
                      onClick={() => handleDelete(p.id, p.ownerUid)}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '8px',
                        color: '#f87171',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowModal(false)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '440px',
                background: '#0f1e36',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.2rem',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#f8fafc',
                  }}>
                    New Project
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    Share your project with the community
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  X
                </button>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#94a3b8',
                  marginBottom: '0.4rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Project"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#94a3b8',
                  marginBottom: '0.4rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  Description
                </label>
                <textarea
                  placeholder="What is this project about?"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#94a3b8',
                  marginBottom: '0.4rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#0f1e36',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c} style={{ background: '#0f1e36' }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#94a3b8',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={loading || !form.title.trim()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading || !form.title.trim() ? 0.75 : 1,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {loading ? 'Adding...' : 'Add Project'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}