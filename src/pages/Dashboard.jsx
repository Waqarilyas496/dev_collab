import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import InviteModal from '../components/dashboard/InviteModal';
import '../styles/dashboard.css';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // Load real projects
  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc'),
      limit(4)
    );
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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

  // Load real tasks
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tasks'), (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Load recent activities
  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        type: 'project',
        ...d.data(),
      }));
      setActivities(data);
    });
    return () => unsub();
  }, []);

  // Real Stats
  const totalProjects = projects.length;
  const totalMembers = members.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  const getColor = (uid) => {
    const colors = ['#3b82f6', '#a855f7', '#22c55e', '#eab308', '#ef4444', '#06b6d4'];
    return colors[uid ? uid.charCodeAt(0) % colors.length : 0];
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBadgeClass = (index) => {
    const badges = ['active', 'review', 'planning'];
    return badges[index % badges.length];
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date.toDate()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar active="Dashboard" />

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        members={members}
      />

      <main className="dashboard-main">

        {/* Top Bar */}
        <motion.div
          className="topbar"
          {...fadeUp}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="topbar-title">
              Good morning, {auth.currentUser?.displayName?.split(' ')[0] || 'there'} 👋
            </div>
            <div className="topbar-subtitle">Here's what's happening today</div>
          </div>
          <div className="topbar-right">
            <button
              className="btn-new-project"
              onClick={() => navigate('/projects')}
            >
              + New Project
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {[
            {
              icon: '📁',
              value: totalProjects,
              label: 'Total Projects',
              change: 'All projects',
            },
            {
              icon: '👥',
              value: totalMembers,
              label: 'Team Members',
              change: 'Registered users',
            },
            {
              icon: '✅',
              value: completedTasks,
              label: 'Tasks Done',
              change: `${pendingTasks} pending`,
            },
            {
              icon: '🔥',
              value: pendingTasks,
              label: 'Active Tasks',
              change: 'In progress',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="content-grid">

          {/* Projects + Activity */}
          <motion.div
            className="section-card"
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Recent Projects */}
            <div className="section-header">
              <div className="section-title">Recent Projects</div>
              <span
                className="section-link"
                onClick={() => navigate('/projects')}
                style={{ cursor: 'pointer' }}
              >
                View all →
              </span>
            </div>

            {projects.length === 0 ? (
              <div style={{
                color: '#475569',
                fontSize: '13px',
                padding: '1rem 0',
              }}>
                No projects yet 🚀
              </div>
            ) : (
              projects.map((p, i) => (
                <div className="project-item" key={p.id}>
                  <div
                    className="project-dot"
                    style={{ background: p.color || getColor(p.ownerUid) }}
                  />
                  <div className="project-info">
                    <div className="project-name">{p.title}</div>
                    <div className="project-meta">
                      by {p.ownerName} · {timeAgo(p.createdAt)}
                    </div>
                  </div>
                  <span className={`project-badge badge-${getBadgeClass(i)}`}>
                    {p.category}
                  </span>
                </div>
              ))
            )}

            {/* Recent Activity */}
            <div className="section-header" style={{ marginTop: '1.5rem' }}>
              <div className="section-title">Recent Activity</div>
            </div>

            {activities.length === 0 ? (
              <div style={{
                color: '#475569',
                fontSize: '13px',
                padding: '1rem 0',
              }}>
                No activity yet
              </div>
            ) : (
              activities.map((a) => (
                <div className="activity-item" key={a.id}>
                  <div
                    className="activity-avatar"
                    style={{ background: getColor(a.ownerUid) }}
                  >
                    {getInitials(a.ownerName)}
                  </div>
                  <div>
                    <div className="activity-text">
                      <span>{a.ownerName}</span> added project "{a.title}"
                    </div>
                    <div className="activity-time">{timeAgo(a.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </motion.div>

          {/* Team Members */}
          <motion.div
            className="section-card"
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="section-header">
              <div className="section-title">Team Members</div>
              <span
                className="section-link"
                onClick={() => setInviteOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                Invite +
              </span>
            </div>

            {members.length === 0 ? (
              <div style={{
                color: '#475569',
                fontSize: '13px',
                padding: '1rem 0',
              }}>
                No members yet
              </div>
            ) : (
              members.map((m) => (
                <div className="member-item" key={m.uid}>
                  <div
                    className="member-avatar"
                    style={{ background: getColor(m.uid) }}
                  >
                    {getInitials(`${m.firstName} ${m.lastName}`)}
                  </div>
                  <div>
                    <div className="member-name">
                      {m.firstName} {m.lastName}
                    </div>
                    <div className="member-role">{m.role || 'Member'}</div>
                  </div>
                  <div className="member-status status-online" />
                </div>
              ))
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}