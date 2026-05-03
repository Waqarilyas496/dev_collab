import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <>
      <div className="auth-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="auth-wrapper">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}