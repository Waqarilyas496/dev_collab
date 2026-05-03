import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/pages.css';

const contacts = [
  { initials: 'SA', name: 'Sara Ahmed', preview: 'Can you review the PR?', color: '#a855f7' },
  { initials: 'MK', name: 'M. Khan', preview: 'Backend is ready to test', color: '#22c55e' },
  { initials: 'AR', name: 'Ali Raza', preview: 'Pushed the new feature', color: '#eab308' },
  { initials: 'FN', name: 'Fatima N.', preview: 'Design files updated', color: '#ef4444' },
];

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeContact, setActiveContact] = useState(0);
  const bottomRef = useRef(null);

  // Load messages from Firestore in realtime
  useEffect(() => {
    const roomId = `room_${activeContact}`;
    const q = query(
      collection(db, 'messages', roomId, 'chats'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });
    return () => unsubscribe();
  }, [activeContact]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to Firestore
  const sendMessage = async () => {
    if (!input.trim()) return;
    const roomId = `room_${activeContact}`;
    try {
      await addDoc(collection(db, 'messages', roomId, 'chats'), {
        text: input,
        sent: true,
        senderName: auth.currentUser?.displayName || 'You',
        uid: auth.currentUser?.uid,
        createdAt: new Date(),
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
            <div className="page-title">Messages</div>
            <div className="page-subtitle">Team conversations</div>
          </div>
        </motion.div>

        {/* Messages Layout */}
        <motion.div
          className="messages-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Contacts List */}
          <div className="messages-list">
            {contacts.map((c, i) => (
              <div
                key={i}
                className={`message-contact ${activeContact === i ? 'active' : ''}`}
                onClick={() => setActiveContact(i)}
              >
                <div
                  className="contact-avatar"
                  style={{ background: c.color }}
                >
                  {c.initials}
                </div>
                <div>
                  <div className="contact-name">{c.name}</div>
                  <div className="contact-preview">{c.preview}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {/* Chat Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div
                className="contact-avatar"
                style={{ background: contacts[activeContact].color }}
              >
                {contacts[activeContact].initials}
              </div>
              <div>
                <div className="contact-name">
                  {contacts[activeContact].name}
                </div>
                <div className="contact-preview" style={{ color: '#22c55e' }}>
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div style={{
                  color: '#475569',
                  fontSize: '13px',
                  textAlign: 'center',
                  marginTop: '2rem',
                }}>
                  No messages yet — say hello! 👋
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id}>
                  {!m.sent && (
                    <div style={{
                      fontSize: '11px',
                      color: '#475569',
                      marginBottom: '4px',
                    }}>
                      {m.senderName}
                    </div>
                  )}
                  <div className={`chat-bubble ${m.sent ? 'sent' : 'received'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Row */}
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="btn-primary-custom"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}