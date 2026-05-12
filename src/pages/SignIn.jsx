import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import AuthButton from '../components/AuthButton';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email.';
    if (!form.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setGlobalError('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      setGlobalError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setGlobalError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      setGlobalError('Google sign in failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <Link to="/" className="auth-logo">
        <div className="auth-logo-icon">D</div>
        <span className="auth-logo-text">DevCollab</span>
      </Link>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your workspace</p>

      <div className="social-grid">
        <motion.button
          className="btn-social"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogle}
        >
          <FaGoogle size={14} color="#ea4335" /> Continue with Google
        </motion.button>
      </div>

      <div className="auth-divider"><span>OR</span></div>

      {globalError && (
        <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {globalError}
        </motion.div>
      )}

      <FormInput
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="forgot-link">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>

      <AuthButton loading={loading} onClick={handleSubmit}>
        Sign In
      </AuthButton>

      <p className="auth-switch">
        No account? <Link to="/signup">Create one free →</Link>
      </p>
    </AuthLayout>
  );
}