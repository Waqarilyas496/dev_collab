import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

const projects = [
  {
    icon: '🌐',
    color: '#3b82f6',
    title: 'DevCollab Web App',
    desc: 'Main SaaS platform for developer collaboration and project management.',
    progress: 75,
    members: 8,
    tasks: 24,
    status: 'active',
  },
  {
    icon: '📱',
    color: '#a855f7',
    title: 'Mobile Dashboard',
    desc: 'React Native mobile app for on-the-go project tracking.',
    progress: 45,
    members: 4,
    tasks: 18,
    status: 'review',
  },
  {
    icon: '🔗',
    color: '#22c55e',
    title: 'API Integration',
    desc: 'REST API integration layer connecting all third-party services.',
    progress: 60,
    members: 3,
    tasks: 12,
    status: 'active',
  },
  {
    icon: '🎨',
    color: '#eab308',
    title: 'Design System',
    desc: 'Reusable component library and design tokens for all products.',
    progress: 30,
    members: 2,
    tasks: 9,
    status: 'planning',
  },
  {
    icon: '🔒',
    color: '#ef4444',
    title: 'Auth Service',
    desc: 'Centralized authentication and authorization microservice.',
    progress: 90,
    members: 3,
    tasks: 6,
    status: 'review',
  },
  {
    icon: '📊',
    color: '#06b6d4',
    title: 'Analytics Dashboard',
    desc: 'Real-time analytics and reporting dashboard for all projects.',
    progress: 20,
    members: 2,
    tasks: 15,
    status: 'planning',
  },
];

const badgeClass = {
  active: 'badge-active',
  review: 'badge-review',
  planning: 'badge-planning',
};

export default function Projects() {
  const navigate = useNavigate();

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
          <button className="btn-primary-custom">+ New Project</button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid-3">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              className="page-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="card-top">
                <div
                  className="card-icon"
                  style={{ background: p.color + '22' }}
                >
                  {p.icon}
                </div>
                <span className={`project-badge ${badgeClass[p.status]}`}>
                  {p.status}
                </span>
              </div>

              <div className="card-title">{p.title}</div>
              <div className="card-desc">{p.desc}</div>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${p.progress}%` }}
                />
              </div>

              <div className="card-footer">
                <span>👥 {p.members} members</span>
                <span>✅ {p.tasks} tasks</span>
                <span>{p.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}