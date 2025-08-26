'use client'
import AutomationPage from '@/components/pages/settings/automation/AutomationPage'
import UserPage from '@/components/pages/settings/user/UserPage'
import React, { useState } from 'react'

type ActiveProp = {
  tab: "user" | "automation"
}

const SettingsPage = () => {
  const [active, setActive] = useState<ActiveProp>({ tab: "user" })

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setActive({ tab: "user" })}>User</button>
        <button onClick={() => setActive({ tab: "automation" })}>Automation</button>
      </div>

      {active.tab === "user" && <UserPage />}
      {active.tab === "automation" && <AutomationPage />}
    </div>
  )
}

export default SettingsPage
