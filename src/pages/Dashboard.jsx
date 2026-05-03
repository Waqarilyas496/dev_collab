import { useState } from 'react';
import { auth } from '../firebase';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import InviteModal from '../components/dashboard/InviteModal';
import '../styles/dashboard.css';

const stats = [
  { icon: '📁', value: '12', label: 'Total Projects', change: '+2 this week' },
  { icon: '👥', value: '8', label: 'Team Members', change: '+1 this month' },
  { icon: '✅', value: '48', label: 'Tasks Done', change: '+12 this week' },
  { icon: '🔥', value: '5', label: 'Active Sprints', change: '2 ending soon' },
];

const projects = [
  { name: 'DevCollab Web App', meta: '8 members · Updated 2h ago', color: '#3b82f6', badge: 'active' },
  { name: 'Mobile Dashboard', meta: '4 members · Updated 1d ago', color: '#a855f7', badge: 'review' },
  { name: 'API Integration', meta: '3 members · Updated 3d ago', color: '#22c55e', badge: 'active' },
  { name: 'Design System', meta: '2 members · Updated 5d ago', color: '#eab308', badge: 'planning' },
];

const activities = [
  { initials: 'WI', color: '#3b82f6', text: <><span>Waqar Ilyas</span> pushed 3 commits to main branch</>, time: '2 min ago' },
  { initials: 'SA', color: '#a855f7', text: <><span>Sara Ahmed</span> commented on Issue #42</>, time: '15 min ago' },
  { initials: 'MK', color: '#22c55e', text: <><span>M. Khan</span> merged Pull Request #18</>, time: '1 hour ago' },
  { initials: 'AR', color: '#eab308', text: <><span>Ali Raza</span> created new branch feature/auth</>, time: '3 hours ago' },
  { initials: 'FN', color: '#ef4444', text: <><span>Fatima N.</span> closed Issue #39</>, time: '5 hours ago' },
];

const members = [
  { initials: 'WI', name: 'Waqar Ilyas', role: 'Lead Developer', color: '#3b82f6', status: 'online' },
  { initials: 'SA', name: 'Sara Ahmed', role: 'UI Designer', color: '#a855f7', status: 'online' },
  { initials: 'MK', name: 'M. Khan', role: 'Backend Dev', color: '#22c55e', status: 'away' },
  { initials: 'AR', name: 'Ali Raza', role: 'Frontend Dev', color: '#eab308', status: 'offline' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <Sidebar active="Dashboard" />

      {/* Invite Modal */}
      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
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
            <button className="btn-new-project">
              + New Project
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
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
            <div className="section-header">
              <div className="section-title">Recent Projects</div>
              <span className="section-link">View all →</span>
            </div>

            {projects.map((p, i) => (
              <div className="project-item" key={i}>
                <div className="project-dot" style={{ background: p.color }} />
                <div className="project-info">
                  <div className="project-name">{p.name}</div>
                  <div className="project-meta">{p.meta}</div>
                </div>
                <span className={`project-badge badge-${p.badge}`}>
                  {p.badge}
                </span>
              </div>
            ))}

            {/* Activity Feed */}
            <div className="section-header" style={{ marginTop: '1.5rem' }}>
              <div className="section-title">Recent Activity</div>
            </div>
            {activities.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-avatar" style={{ background: a.color }}>
                  {a.initials}
                </div>
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Team Members */}
          <motion.div
            className="section-card"
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="section-header">
              <div className="section-title">Team Members</div>
              {/* Invite Button */}
              <span
                className="section-link"
                onClick={() => setInviteOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                Invite +
              </span>
            </div>

            {members.map((m, i) => (
              <div className="member-item" key={i}>
                <div className="member-avatar" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div>
                  <div className="member-name">{m.name}</div>
                  <div className="member-role">{m.role}</div>
                </div>
                <div className={`member-status status-${m.status}`} />
              </div>
            ))}
          </motion.div>

        </div>
      </main>
    </div>
  );
}