import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function InviteModal({ isOpen, onClose, members = [] }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async () => {
    if (!selectedUser) {
      setError('Please select a member to invite.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'invites'), {
        invitedUid: selectedUser.uid,
        invitedName: `${selectedUser.firstName} ${selectedUser.lastName}`,
        invitedEmail: selectedUser.email,
        invitedBy: auth.currentUser?.displayName || 'Unknown',
        invitedByUid: auth.currentUser?.uid,
        status: 'pending',
        createdAt: new Date(),
      });
      setSuccess(true);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to send invite. Please try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setSelectedUser(null);
    onClose();
  };

  const getColor = (uid) => {
    const colors = ['#3b82f6', '#a855f7', '#22c55e', '#eab308', '#ef4444', '#06b6d4'];
    return colors[uid ? uid.charCodeAt(0) % colors.length : 0];
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  };

  // Filter out current user
  const otherMembers = members.filter(
    (m) => m.uid !== auth.currentUser?.uid
  );

  return (
    <AnimatePresence>
      {isOpen && (
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: '#0f1e36',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.2rem',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#f8fafc',
                }}>
                  Invite Member
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  Select a registered user to invite
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                X
              </button>
            </div>

            {/* Success */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '1rem 0' }}
              >
                <div style={{ fontSize: '40px', marginBottom: '0.8rem' }}>🎉</div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '6px',
                }}>
                  Invite Sent!
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '1.2rem',
                }}>
                  Member has been invited successfully.
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '9px 24px',
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
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                  }}>
                    {error}
                  </div>
                )}

                {/* Members List */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#94a3b8',
                    marginBottom: '0.6rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Select Member
                  </label>

                  {otherMembers.length === 0 ? (
                    <div style={{
                      color: '#475569',
                      fontSize: '13px',
                      textAlign: 'center',
                      padding: '1.5rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                    }}>
                      No other members found
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}>
                      {otherMembers.map((m) => (
                        <div
                          key={m.uid}
                          onClick={() => setSelectedUser(m)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            border: selectedUser?.uid === m.uid
                              ? '1px solid rgba(59,130,246,0.5)'
                              : '1px solid rgba(255,255,255,0.06)',
                            background: selectedUser?.uid === m.uid
                              ? 'rgba(59,130,246,0.1)'
                              : 'rgba(255,255,255,0.03)',
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: getColor(m.uid),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'white',
                            flexShrink: 0,
                          }}>
                            {getInitials(`${m.firstName} ${m.lastName}`)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#f1f5f9',
                            }}>
                              {m.firstName} {m.lastName}
                            </div>
                            <div style={{ fontSize: '11px', color: '#475569' }}>
                              {m.email}
                            </div>
                          </div>
                          {selectedUser?.uid === m.uid && (
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#3b82f6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              color: 'white',
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleClose}
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
                    onClick={handleInvite}
                    disabled={loading || !selectedUser}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: loading || !selectedUser ? 'not-allowed' : 'pointer',
                      opacity: loading || !selectedUser ? 0.65 : 1,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Invite'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}