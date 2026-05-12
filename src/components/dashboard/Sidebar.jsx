import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import '../../styles/dashboard.css';

const navItems = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '📁', label: 'Projects', path: '/projects' },
  { icon: '✅', label: 'Tasks', path: '/tasks' },
  { icon: '💬', label: 'Messages', path: '/messages' },
  { icon: '📊', label: 'Analytics', path: '/analytics' },
  { icon: '📨', label: 'Invitations', path: '/invitations' },
];

const bottomItems = [
  { icon: '👥', label: 'Team', path: '/settings' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Real Firebase Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        className="sidebar-logo"
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer' }}
      >
        <div className="sidebar-logo-icon">D</div>
        <span className="sidebar-logo-text">DevCollab</span>
      </div>

      {/* Main Nav */}
      <div className="sidebar-section-label">Main Menu</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="sidebar-section-label">Settings</div>
      <nav className="sidebar-nav">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Card + Logout */}
      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">
            {auth.currentUser?.displayName?.[0] || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">
              {auth.currentUser?.displayName || 'User'}
            </div>
            <div className="user-role">{auth.currentUser?.email}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '9px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#f87171',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.15)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.08)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.25)';
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}