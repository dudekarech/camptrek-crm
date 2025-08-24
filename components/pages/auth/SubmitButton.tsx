'use client'
import React from 'react'
import { motion } from 'motion/react'

type SubmitButtonProp = {
    text: string
    disabled?: boolean
}

const SubmitButton = ({ text, disabled }: SubmitButtonProp) => {
  return (
    <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className='border bg-blue-500 py-2 px-4 rounded-md cursor-pointer'
    type='submit'
    disabled={disabled}
    >
        {text}
    </motion.button>
  )
}

export default SubmitButton