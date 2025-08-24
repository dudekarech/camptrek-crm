'use client'
import { baseInstance } from '@/constants/api'
import { useStaffStore } from '@/store/StaffStore'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const LogoutButton = () => {
    const setNull = useStaffStore(state => state.setNull)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await baseInstance.post("/staff/auth/logout")
            console.log('✅ Logout successful')
        } catch (error) {
            console.error('⚠️ Logout API call failed:', error)
        } finally {
            setNull()
            router.replace("/sign-in")
            setIsLoading(false)
        }
    }
  return (
    <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className='text-white px-4 py-2 rounded-md m-2 cursor-pointer bg-gradient-to-r from-black via-blue-800 to-blue-400'
    onClick={handleLogout}
    >
        {isLoading ? 'Logging Out...' : 'Log Out'}
    </motion.button>
  )
}

export default LogoutButton