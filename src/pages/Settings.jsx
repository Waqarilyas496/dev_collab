import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    bio: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs = ['Profile', 'Account', 'Notifications', 'Team'];

  // Load user data from Firestore
  useEffect(() => {
    const loadUser = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          role: data.role || '',
          bio: data.bio || '',
        });
      }
    };
    loadUser();
  }, []);

  // Save profile to Firestore
  const saveProfile = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        bio: profile.bio,
      });
      await updateProfile(auth.currentUser, {
        displayName: `${profile.firstName} ${profile.lastName}`,
      });
      setMessage('Profile updated successfully! ✅');
    } catch (err) {
      setError('Failed to update profile. Try again.');
    }
    setLoading(false);
  };

  // Update password
  const handlePasswordUpdate = async () => {
    setMessage('');
    setError('');
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError('Please fill all password fields.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (passwords.newPass.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwords.current
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwords.newPass);
      setMessage('Password updated successfully! ✅');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setError('Current password is incorrect.');
    }
    setLoading(false);
  };

  const members = [
    { initials: 'WI', name: 'Waqar Ilyas', role: 'Lead Developer', color: '#3b82f6' },
    { initials: 'SA', name: 'Sara Ahmed', role: 'UI Designer', color: '#a855f7' },
    { initials: 'MK', name: 'M. Khan', role: 'Backend Dev', color: '#22c55e' },
    { initials: 'AR', name: 'Ali Raza', role: 'Frontend Dev', color: '#eab308' },
  ];

  return (
    <div className="page-wrapper">
      <Sidebar active="Settings" />

      <main className="page-main">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="page-title">Settings</div>
            <div className="page-subtitle">Manage your account</div>
          </div>
          {activeTab === 'Profile' && (
            <button
              className="btn-primary-custom"
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </motion.div>

        {/* Success / Error Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#22c55e',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '1rem',
            }}
          >
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Settings Layout */}
        <motion.div
          className="settings-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Settings Nav */}
          <div className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`settings-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setMessage('');
                  setError('');
                }}
              >
                {tab === 'Profile' && '👤 '}
                {tab === 'Account' && '🔒 '}
                {tab === 'Notifications' && '🔔 '}
                {tab === 'Team' && '👥 '}
                {tab}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="settings-section">

            {/* Profile Tab */}
            {activeTab === 'Profile' && (
              <>
                <div className="settings-title">Profile Information</div>

                {/* Avatar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#f1f5f9' }}>
                      {profile.firstName} {profile.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      {profile.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="settings-field">
                    <label className="settings-label">First Name</label>
                    <input
                      className="settings-input"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="settings-field">
                    <label className="settings-label">Last Name</label>
                    <input
                      className="settings-input"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="settings-field">
                  <label className="settings-label">Email Address</label>
                  <input
                    className="settings-input"
                    value={profile.email}
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>

                <div className="settings-field">
                  <label className="settings-label">Role</label>
                  <input
                    className="settings-input"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  />
                </div>

                <div className="settings-field">
                  <label className="settings-label">Bio</label>
                  <textarea
                    className="settings-input"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </div>
              </>
            )}

            {/* Account Tab */}
            {activeTab === 'Account' && (
              <>
                <div className="settings-title">Account & Security</div>
                <div className="settings-field">
                  <label className="settings-label">Current Password</label>
                  <input
                    className="settings-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label className="settings-label">New Password</label>
                  <input
                    className="settings-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Confirm Password</label>
                  <input
                    className="settings-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
                <button
                  className="btn-primary-custom"
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <>
                <div className="settings-title">Notification Preferences</div>
                {[
                  'Email notifications for new messages',
                  'Push notifications for task updates',
                  'Weekly project summary report',
                  'Team member activity alerts',
                  'Security and login alerts',
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{ fontSize: '13.5px', color: '#f1f5f9' }}>
                      {item}
                    </span>
                    <div style={{
                      width: '36px',
                      height: '20px',
                      background: i % 2 === 0
                        ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                        : 'rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      cursor: 'pointer',
                    }} />
                  </div>
                ))}
              </>
            )}

            {/* Team Tab */}
            {activeTab === 'Team' && (
              <>
                <div className="settings-title">Team Management</div>
                {members.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: m.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'white',
                    }}>
                      {m.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#f1f5f9' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        {m.role}
                      </div>
                    </div>
                    <button style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent',
                      color: '#94a3b8',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="btn-primary-custom"
                  style={{ marginTop: '1.5rem' }}
                >
                  + Invite Member
                </button>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}