import React from 'react'
import SidebarButton from './SidebarButton'

const Menu = () => {
  return (
    <section>
      <h2 className='px-2'>Main Menu</h2>
      <hr className='m-2 border-gray-500' />
      <ul className='flex flex-col gap-2'>
        <SidebarButton>Business Overview</SidebarButton>
        <SidebarButton url='/inbox'>Inbox</SidebarButton>
        <SidebarButton url='/itineraries'>Itineraries</SidebarButton>
        <SidebarButton url='/blogs'>Blogs</SidebarButton>
      </ul>
    </section>
  )
}

export default Menu