import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function InviteModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleInvite = async () => {
    setError('');
    if (!email) { setError('Please enter an email address.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email.'); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, 'invites'), {
        email: email,
        role: role,
        invitedBy: auth.currentUser?.displayName || 'Unknown',
        invitedByUid: auth.currentUser?.uid,
        status: 'pending',
        createdAt: new Date(),
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to send invite. Please try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setEmail('');
    setRole('Member');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: '100%',
              maxWidth: '420px',
              background: '#0f1e36',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#f8fafc',
                }}>
                  Invite Team Member
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  Send an invite to join DevCollab
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Success State */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '1rem 0' }}
              >
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎉</div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '8px',
                }}>
                  Invite Sent!
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '1.5rem' }}>
                  Invite has been saved successfully.
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                {/* Error */}
                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#f87171',
                    fontSize: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                  }}>
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#94a3b8',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="teammate@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Role Select */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#94a3b8',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Member" style={{ background: '#0f1e36' }}>Member</option>
                    <option value="Developer" style={{ background: '#0f1e36' }}>Developer</option>
                    <option value="Designer" style={{ background: '#0f1e36' }}>Designer</option>
                    <option value="Admin" style={{ background: '#0f1e36' }}>Admin</option>
                  </select>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      padding: '11px',
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
                    onClick={handleInvite}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.75 : 1,
                      fontFamily: 'DM Sans, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.7s linear infinite',
                        }} />
                        Sending...
                      </>
                    ) : (
                      '📨 Send Invite'
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}