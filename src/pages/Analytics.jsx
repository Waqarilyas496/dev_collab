import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

const stats = [
  { icon: '👁️', label: 'Total Visits', value: '24,521', change: '+12% this week' },
  { icon: '👥', label: 'Active Users', value: '1,340', change: '+8% this week' },
  { icon: '✅', label: 'Tasks Completed', value: '348', change: '+22% this month' },
  { icon: '💬', label: 'Messages Sent', value: '5,210', change: '+5% this week' },
];

const activities = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 65 },
  { day: 'Sat', value: 30 },
  { day: 'Sun', value: 50 },
];

const topProjects = [
  { name: 'DevCollab Web App', percent: 75, color: '#3b82f6' },
  { name: 'Mobile Dashboard', percent: 45, color: '#a855f7' },
  { name: 'API Integration', percent: 60, color: '#22c55e' },
  { name: 'Design System', percent: 30, color: '#eab308' },
];

export default function Analytics() {
  const maxValue = Math.max(...activities.map((a) => a.value));

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
            <div className="page-subtitle">Your project performance overview</div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {stats.map((s, i) => (
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
                fontSize: '26px',
                fontWeight: '700',
                color: '#f8fafc',
                marginBottom: '4px',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '4px' }}>
                {s.change}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid-2">
          {/* Bar Chart */}
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
              Weekly Activity
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
              height: '150px',
            }}>
              {activities.map((a, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(a.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      borderRadius: '6px 6px 0 0',
                      minHeight: '4px',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#475569' }}>{a.day}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Projects */}
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
              Project Progress
            </div>

            {topProjects.map((p, i) => (
              <div key={i} style={{ marginBottom: '1.2rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '13px', color: '#f1f5f9' }}>{p.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{p.percent}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{
                      height: '100%',
                      borderRadius: '20px',
                      background: p.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}