import Sidebar from '@/components/global/Sidebar/Sidebar'
import React from 'react'

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex'>
      {/* Sidebar */}
      <div className='flex-shrink-0 h-screen overflow-hidden'>
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className='flex-grow overflow-y-auto p-6'>
        <div className='max-w-7xl mx-auto'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout