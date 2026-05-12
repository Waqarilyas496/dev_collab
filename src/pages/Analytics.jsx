import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

export default function Analytics() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Load real projects
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Load real tasks
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tasks'), (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Load real members
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Real Stats
  const totalProjects = projects.length;
  const totalMembers = members.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  // Project categories count
  const categories = ['Web App', 'Mobile App', 'API', 'Design', 'Other'];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: projects.filter((p) => p.category === cat).length,
    color: cat === 'Web App' ? '#3b82f6' :
           cat === 'Mobile App' ? '#a855f7' :
           cat === 'API' ? '#22c55e' :
           cat === 'Design' ? '#eab308' : '#06b6d4',
  }));

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  // Task completion rate
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // Top project owners
  const ownerMap = {};
  projects.forEach((p) => {
    if (p.ownerName) {
      ownerMap[p.ownerName] = (ownerMap[p.ownerName] || 0) + 1;
    }
  });
  const topOwners = Object.entries(ownerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const maxOwnerCount = Math.max(...topOwners.map((o) => o.count), 1);

  const getColor = (index) => {
    const colors = ['#3b82f6', '#a855f7', '#22c55e', '#eab308', '#ef4444'];
    return colors[index % colors.length];
  };

  return (
    <div className="page-wrapper">
      <Sidebar active="Analytics" />

      <main className="page-main">

        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="page-title">Analytics</div>
            <div className="page-subtitle">Real-time project performance</div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {[
            { icon: '📁', label: 'Total Projects', value: totalProjects, color: '#3b82f6' },
            { icon: '👥', label: 'Total Members', value: totalMembers, color: '#a855f7' },
            { icon: '✅', label: 'Tasks Completed', value: completedTasks, color: '#22c55e' },
            { icon: '⏳', label: 'Tasks Pending', value: pendingTasks, color: '#eab308' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="page-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div style={{ fontSize: '22px', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '28px',
                fontWeight: '700',
                color: s.color,
                marginBottom: '4px',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid-2">

          {/* Task Completion Rate */}
          <motion.div
            className="page-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '15px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1.5rem',
            }}>
              Task Completion Rate
            </div>

            {/* Circle Progress */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 50 * (1 - completionRate / 100)
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#f8fafc',
                  }}>
                    {completionRate}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>
                  {completedTasks}
                </div>
                <div style={{ fontSize: '11px', color: '#475569' }}>Done</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#eab308' }}>
                  {pendingTasks}
                </div>
                <div style={{ fontSize: '11px', color: '#475569' }}>Pending</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  {totalTasks}
                </div>
                <div style={{ fontSize: '11px', color: '#475569' }}>Total</div>
              </div>
            </div>
          </motion.div>

          {/* Projects by Category */}
          <motion.div
            className="page-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '15px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1.5rem',
            }}>
              Projects by Category
            </div>

            {categoryCounts.every((c) => c.count === 0) ? (
              <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
                No projects yet 🚀
              </div>
            ) : (
              categoryCounts.map((cat, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}>
                    <span style={{ fontSize: '13px', color: '#f1f5f9' }}>{cat.name}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{cat.count}</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{
                        height: '100%',
                        borderRadius: '20px',
                        background: cat.color,
                        minWidth: cat.count > 0 ? '4px' : '0px',
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </motion.div>

          {/* Top Contributors */}
          <motion.div
            className="page-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '15px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1.5rem',
            }}>
              Top Contributors
            </div>

            {topOwners.length === 0 ? (
              <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
                No contributors yet
              </div>
            ) : (
              topOwners.map((owner, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px',
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: getColor(i),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'white',
                    }}>
                      {owner.name[0]}
                    </div>
                    <span style={{ fontSize: '13px', color: '#f1f5f9', flex: 1 }}>
                      {owner.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {owner.count} project{owner.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(owner.count / maxOwnerCount) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{
                        height: '100%',
                        borderRadius: '20px',
                        background: getColor(i),
                        minWidth: '4px',
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </motion.div>

          {/* Members Overview */}
          <motion.div
            className="page-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '15px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1.5rem',
            }}>
              Members Overview
            </div>

            {members.length === 0 ? (
              <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
                No members yet
              </div>
            ) : (
              members.slice(0, 5).map((m, i) => (
                <div key={m.uid} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 0',
                  borderBottom: i < members.length - 1
                    ? '1px solid rgba(255,255,255,0.05)'
                    : 'none',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: getColor(i),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {m.firstName?.[0]}{m.lastName?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#f1f5f9' }}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569' }}>
                      {m.role || 'Member'}
                    </div>
                  </div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                  }} />
                </div>
              ))
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}