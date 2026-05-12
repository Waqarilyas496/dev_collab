import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(null);

  const location = useLocation();

  const bottomRef = useRef(null);

  // Auto select user from navigation state
  useEffect(() => {
    if (location.state?.userId) {
      setActiveUser({
        uid: location.state.userId,
        firstName: location.state.userName?.split(' ')[0] || '',
        lastName: location.state.userName?.split(' ')[1] || '',
      });
    }
  }, [location.state]);

  // Load all registered users
  useEffect(() => {
    const loadUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));

      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.uid !== auth.currentUser?.uid);

      setUsers(data);
    };

    loadUsers();
  }, []);

  // Unique room ID for two users
  const getRoomId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
  };

  // Load messages when active user changes
  useEffect(() => {
    if (!activeUser) return;

    const roomId = getRoomId(
      auth.currentUser?.uid,
      activeUser.uid
    );

    const q = query(
      collection(db, 'messages', roomId, 'chats'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMessages(data);
    });

    return () => unsubscribe();
  }, [activeUser]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !activeUser) return;

    const roomId = getRoomId(
      auth.currentUser?.uid,
      activeUser.uid
    );

    try {
      await addDoc(
        collection(db, 'messages', roomId, 'chats'),
        {
          text: input,
          sent: true,
          senderUid: auth.currentUser?.uid,
          senderName:
            auth.currentUser?.displayName || 'You',
          createdAt: new Date(),
        }
      );

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';

    const parts = name.split(' ');

    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Random avatar color
  const getColor = (uid) => {
    const colors = [
      '#3b82f6',
      '#a855f7',
      '#22c55e',
      '#eab308',
      '#ef4444',
      '#06b6d4',
    ];

    const index = uid
      ? uid.charCodeAt(0) % colors.length
      : 0;

    return colors[index];
  };

  return (
    <div className="page-wrapper">
      <Sidebar active="Messages" />

      <main className="page-main">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="page-title">
              Messages
            </div>

            <div className="page-subtitle">
              {users.length} team members available
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <motion.div
          className="messages-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
          }}
        >
          {/* Users List */}
          <div className="messages-list">
            {users.length === 0 ? (
              <div
                style={{
                  color: '#475569',
                  fontSize: '13px',
                  textAlign: 'center',
                  padding: '2rem 1rem',
                }}
              >
                No other users yet 👥
              </div>
            ) : (
              users.map((u) => (
                <div
                  key={u.uid}
                  className={`message-contact ${
                    activeUser?.uid === u.uid
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => setActiveUser(u)}
                >
                  <div
                    className="contact-avatar"
                    style={{
                      background: getColor(u.uid),
                    }}
                  >
                    {getInitials(
                      `${u.firstName} ${u.lastName}`
                    )}
                  </div>

                  <div>
                    <div className="contact-name">
                      {u.firstName} {u.lastName}
                    </div>

                    <div className="contact-preview">
                      {u.role || 'Member'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {!activeUser ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '1rem',
                  color: '#475569',
                }}
              >
                <div style={{ fontSize: '48px' }}>
                  💬
                </div>

                <div style={{ fontSize: '14px' }}>
                  Select a user to start chatting
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom:
                      '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="contact-avatar"
                    style={{
                      background: getColor(
                        activeUser.uid
                      ),
                    }}
                  >
                    {getInitials(
                      `${activeUser.firstName} ${activeUser.lastName}`
                    )}
                  </div>

                  <div>
                    <div className="contact-name">
                      {activeUser.firstName}{' '}
                      {activeUser.lastName}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: '#22c55e',
                      }}
                    >
                      Online
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {messages.length === 0 && (
                    <div
                      style={{
                        color: '#475569',
                        fontSize: '13px',
                        textAlign: 'center',
                        marginTop: '2rem',
                      }}
                    >
                      No messages yet — say hello!
                      👋
                    </div>
                  )}

                  {messages.map((m) => {
                    const isSent =
                      m.senderUid ===
                      auth.currentUser?.uid;

                    return (
                      <div key={m.id}>
                        {!isSent && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#475569',
                              marginBottom: '4px',
                            }}
                          >
                            {m.senderName}
                          </div>
                        )}

                        <div
                          className={`chat-bubble ${
                            isSent
                              ? 'sent'
                              : 'received'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="chat-input-row">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder={`Message ${activeUser.firstName}...`}
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      sendMessage()
                    }
                  />

                  <button
                    className="btn-primary-custom"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}