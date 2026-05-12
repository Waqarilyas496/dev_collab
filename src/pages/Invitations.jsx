import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

export default function Invitations() {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'invites'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((inv) => inv.invitedUid === auth.currentUser?.uid);
      setInvites(data);
    });
    return () => unsub();
  }, []);

  const handleAccept = async (id) => {
    await updateDoc(doc(db, 'invites', id), { status: 'accepted' });
  };

  const handleDecline = async (id) => {
    await updateDoc(doc(db, 'invites', id), { status: 'declined' });
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date.toDate()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const pending = invites.filter((i) => i.status === 'pending');
  const others = invites.filter((i) => i.status !== 'pending');

  return (
    <div className="page-wrapper">
      <Sidebar active="Invitations" />

      <main className="page-main">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="page-title">Invitations</div>
            <div className="page-subtitle">
              {pending.length} pending invite{pending.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Pending Invites */}
        {pending.length === 0 && others.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#475569',
              fontSize: '14px',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
            No invitations yet
          </motion.div>
        ) : (
          <>
            {/* Pending */}
            {pending.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ marginBottom: '2rem' }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#475569',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  Pending — {pending.length}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pending.map((inv) => (
                    <div
                      key={inv.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: '14px',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                        }}>
                          📨
                        </div>
                        <div>
                          <div style={{
                            fontSize: '13.5px',
                            fontWeight: '500',
                            color: '#f1f5f9',
                            marginBottom: '3px',
                          }}>
                            {inv.invitedBy} invited you
                          </div>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            {timeAgo(inv.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleAccept(inv.id)}
                          style={{
                            padding: '7px 16px',
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
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(inv.id)}
                          style={{
                            padding: '7px 16px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '8px',
                            color: '#f87171',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Accepted / Declined */}
            {others.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#475569',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  Previous — {others.length}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {others.map((inv) => (
                    <div
                      key={inv.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px',
                        opacity: 0.7,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '20px' }}>
                          {inv.status === 'accepted' ? '✅' : '❌'}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#94a3b8',
                          }}>
                            Invite from {inv.invitedBy}
                          </div>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            {timeAgo(inv.createdAt)}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: inv.status === 'accepted'
                          ? 'rgba(34,197,94,0.15)'
                          : 'rgba(239,68,68,0.15)',
                        color: inv.status === 'accepted' ? '#22c55e' : '#f87171',
                        fontWeight: '500',
                      }}>
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}