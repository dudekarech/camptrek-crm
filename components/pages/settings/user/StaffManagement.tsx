'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'
import { Users, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'

interface Manager {
  id: number
  name: string
}

interface StaffMember {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
  updated_at: string
  manager: Manager
}

interface StaffResponse {
  staff_count: number
  staff: StaffMember[]
}

const StaffManagement = () => {
  const { data: staffData, isLoading, error, refetch } = useQuery<StaffResponse>({
    queryKey: ['staff'],
    queryFn: async () => {
      console.log('Fetching staff from /staff/all endpoint')
      const response = await baseInstance.get('/staff/all')
      console.log('Staff response:', response.data)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Extract staff array and count from response
  const staff = staffData?.staff || []
  const staffCount = staffData?.staff_count || 0
  
  // Debug logging
  console.log('Staff data received:', staffData)
  console.log('Staff array:', staff)
  console.log('Staff count:', staffCount)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Staff</h3>
        <p className="text-gray-600">Unable to load staff members. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600">View and manage your team members</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Staff List'}
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-100">
           <h3 className="text-lg font-semibold text-gray-900">
             Team Members ({staffCount})
           </h3>
         </div>

        {staff && staff.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {staff.map((member: StaffMember) => (
              <div key={member.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {member.first_name} {member.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                                             <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                         <span className="capitalize">{member.role}</span>
                         <span>•</span>
                         <span className="text-blue-600">
                           Manager: {member.manager?.name || 'None'}
                         </span>
                         <span>•</span>
                         <span className="text-gray-500">
                           {new Date(member.created_at).toLocaleDateString()}
                         </span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Staff Members Yet</h3>
            <p className="text-gray-600">Start building your team by creating the first staff member.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-800 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Export Staff List
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Send Welcome Emails
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Bulk Status Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffManagement

