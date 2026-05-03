import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import AuthButton from '../components/AuthButton';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 8) newErrors.password = 'Min. 8 characters required.';
    return newErrors;
  };

  // Save user to Firestore
  const saveUserToFirestore = async (user, firstName, lastName) => {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      role: 'Member',
      createdAt: new Date(),
    });
  };

  // Email/Password Sign Up
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setGlobalError('');
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(result.user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });
      await saveUserToFirestore(result.user, form.firstName, form.lastName);
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setGlobalError('This email is already registered. Please sign in.');
      } else {
        setGlobalError('Something went wrong. Please try again.');
      }
    }
    setLoading(false);
  };

  // Google Sign Up
  const handleGoogle = async () => {
    setLoading(true);
    setGlobalError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const nameParts = result.user.displayName?.split(' ') || ['', ''];
      await saveUserToFirestore(
        result.user,
        nameParts[0],
        nameParts[1] || ''
      );
      navigate('/dashboard');
    } catch (error) {
      setGlobalError('Google sign up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <Link to="/" className="auth-logo">
        <div className="auth-logo-icon">D</div>
        <span className="auth-logo-text">DevCollab</span>
      </Link>

      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Start collaborating in seconds</p>

      <div className="social-grid">
        <motion.button
          className="btn-social"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogle}
        >
          <FaGoogle size={14} color="#ea4335" /> Google
        </motion.button>
        <motion.button
          className="btn-social"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <FaGithub size={14} /> GitHub
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

      <div className="row g-2">
        <div className="col-6">
          <FormInput
            label="First Name"
            name="firstName"
            placeholder="Waqar"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
        </div>
        <div className="col-6">
          <FormInput
            label="Last Name"
            name="lastName"
            placeholder="Ilyas"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>
      </div>

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
        placeholder="Min. 8 characters"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div style={{ marginTop: '0.4rem' }}>
        <AuthButton loading={loading} onClick={handleSubmit}>
          Create Account
        </AuthButton>
      </div>

      <p className="auth-switch">
        Already have an account? <Link to="/signin">Sign in →</Link>
      </p>
    </AuthLayout>
  );
}