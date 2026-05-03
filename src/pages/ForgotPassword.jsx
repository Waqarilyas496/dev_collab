import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import AuthLayout from '../components/AuthLayout';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email.'); return; }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <Link to="/signin" className="auth-logo">
        <div className="auth-logo-icon">D</div>
        <span className="auth-logo-text">DevCollab</span>
      </Link>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '1rem 0' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📧</div>
          <h2 className="auth-title">Check your email!</h2>
          <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
            We sent a password reset link to <strong style={{ color: '#60a5fa' }}>{email}</strong>
          </p>
          <Link to="/signin" className="btn-auth-submit">
            Back to Sign In →
          </Link>
        </motion.div>
      ) : (
        <>
          <h1 className="auth-title">Forgot password?</h1>
          <p className="auth-subtitle">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="mb-3">
            <label className="form-label-custom">Email Address</label>
            <input
              type="email"
              className="form-control-custom"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            />
          </div>

          <motion.button
            className="btn-auth-submit"
            onClick={handleReset}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{ marginBottom: '1rem' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm"
                  style={{ width: '14px', height: '14px', borderWidth: '2px' }}
                />
                Sending...
              </>
            ) : (
              '📨 Send Reset Link'
            )}
          </motion.button>

          <p className="auth-switch">
            Remember password? <Link to="/signin">Sign in →</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}