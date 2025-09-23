import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, #1e3a8a, #000000)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
