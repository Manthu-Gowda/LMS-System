import React from 'react'
import { Spin } from 'antd'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'large', tip = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen"
    >
      <Spin size={size} tip={tip} />
    </motion.div>
  )
}

export default LoadingSpinner