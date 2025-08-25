'use client'
import { useStaffStore } from '@/store/StaffStore'
import React from 'react'

const Nametag = () => {
    const {email, name, role} = useStaffStore()
    return (
        <div className='flex flex-col my-4'>
            <p className='text-md capitalize'>Name: {name} </p>
            <p>Email: {email} </p>
            <p className='capitalize'>Role: {role.toLowerCase()}</p>
        </div>
    )
}

export default Nametag