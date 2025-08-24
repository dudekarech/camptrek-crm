'use client'
import LogoutButton from '@/components/global/Logout/LogoutButton'
import { useStaffStore } from '@/store/StaffStore'
import React from 'react'

const HomePage = () => {
  const staff = useStaffStore()
  return (
    <div>
      <p>id: {staff.id}</p>
      <p className='capitalize'>Welcome {staff.name} Role: {staff.role}</p>
      <LogoutButton />
    </div>
  )
}

export default HomePage