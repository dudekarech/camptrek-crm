'use client'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React from 'react'

type SidebarButtonProp = {
    children: React.ReactNode
    url?: string
}

const SidebarButton = ({children, url} : SidebarButtonProp) => {
    const router = useRouter()
    const handleClick = () => {
        if(url){
            router.push(url)
        } else {
            router.push('/')
        }
    }

    return (
        <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className='text-left text-md cursor-pointer hover:bg-cyan-600 p-2 ml-2 rounded-lg'
        onClick={handleClick}
        >
            {children}
        </motion.button>
    )
    }

export default SidebarButton