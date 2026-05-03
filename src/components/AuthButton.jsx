import { motion } from 'framer-motion';

export default function AuthButton({ children, loading, onClick }) {
  return (
    <motion.button
      type="button"
      className="btn-auth-submit"
      disabled={loading}
      onClick={onClick}
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            style={{ width: '14px', height: '14px', borderWidth: '2px' }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}