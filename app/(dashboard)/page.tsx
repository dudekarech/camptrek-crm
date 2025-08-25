'use client'

import { useStaffStore } from '@/store/StaffStore'
import React from 'react'

const HomePage = () => {
  const staff = useStaffStore()
  return (
    <div>
      <p>id: {staff.id}</p>
      <p className='capitalize'>Welcome {staff.name} Role: {staff.role}</p>
      
    </div>
  )
}

export default HomePage