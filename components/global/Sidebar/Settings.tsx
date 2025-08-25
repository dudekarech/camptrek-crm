import React from 'react'
import SidebarButton from './SidebarButton'

const Settings = () => {
  return (
    <section className='mt-8'>
      <hr className='m-2 border-gray-500' />
      <ul className='flex flex-col gap-2'>
        <SidebarButton url='/settings'>Settings</SidebarButton>
      </ul>
    </section>
  )
}

export default Settings