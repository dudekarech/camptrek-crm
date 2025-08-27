'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin, 
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react'

// Types for the API response
interface Booking {
  id: string
  full_name: string
  email: string
  phone_number: string
  start_date: string
  number_of_rooms: number
  number_of_adults: number
  number_of_children: number
  country: string
  dietary_needs: string
  dietary_info?: string
  special_requests?: string
  occasion_info?: string
  order_tracking_id: string
  currency: string
  total_amount: number
  payment_method: string
  confirmation_code?: string
  payment_message?: string
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  itinerary_id: string
  itinerary: {
    id: string
    title: string
    duration: number
    price: number
    location: string
    arrival_city: string
    departure_city: string
  }
  created_at: string
  updated_at: string
}

interface BookingsResponse {
  bookings: Booking[]
  total: number
  pages: number
  current_page: number
  page_size: number
}

const HomePage = () => {
  const handleFetch = async () => {
    const response = await baseInstance.get<BookingsResponse>("/bookings/");
    return response.data;
  };

  const { data: bookingsData, isLoading, error } = useQuery<BookingsResponse>({
    queryKey: ['bookings'],
    queryFn: handleFetch,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
  })

  // Calculate business metrics
  const calculateMetrics = () => {
    if (!bookingsData?.bookings) return null

    const bookings = bookingsData.bookings
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_amount, 0)
    const completedPayments = bookings.filter(b => b.payment_status === 'COMPLETED')
    const pendingPayments = bookings.filter(b => b.payment_status === 'PENDING')
    const failedPayments = bookings.filter(b => b.payment_status === 'FAILED')
    
    const totalGuests = bookings.reduce((sum, booking) => 
      sum + booking.number_of_adults + booking.number_of_children, 0
    )

    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
    const completionRate = totalBookings > 0 ? (completedPayments.length / totalBookings) * 100 : 0

    return {
      totalBookings,
      totalRevenue,
      totalGuests,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      failedPayments: failedPayments.length,
      averageBookingValue,
      completionRate
    }
  }

  const metrics = calculateMetrics()

  // Get recent bookings
  const recentBookings = bookingsData?.bookings?.slice(0, 5) || []

  // Get payment status counts
  const getPaymentStatusCounts = () => {
    if (!bookingsData?.bookings) return {}
    
    return bookingsData.bookings.reduce((acc, booking) => {
      acc[booking.payment_status] = (acc[booking.payment_status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const paymentStatusCounts = getPaymentStatusCounts()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'FAILED': return 'text-red-600 bg-red-100'
      case 'CANCELLED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'FAILED': return <AlertCircle className="w-4 h-4" />
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business overview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading business data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Overview</h1>
              <p className="mt-2 text-gray-600">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{metrics?.totalBookings || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${metrics?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-3xl font-bold text-gray-900">{metrics?.totalGuests || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Booking Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${metrics?.averageBookingValue?.toFixed(0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Status Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
              <div className="space-y-4">
                {Object.entries(paymentStatusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{status.toLowerCase()}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-green-600">
                    {metrics?.completionRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <span className="text-sm text-gray-500">
                  Showing {recentBookings.length} of {bookingsData?.total || 0}
                </span>
              </div>
              
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{booking.full_name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.itinerary?.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{booking.number_of_adults + booking.number_of_children} guests</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${booking.total_amount}</p>
                        <p className="text-sm text-gray-500">{booking.currency}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Payments</span>
                <span className="font-medium text-green-600">{metrics?.completedPayments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <span className="font-medium text-yellow-600">{metrics?.pendingPayments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed Payments</span>
                <span className="font-medium text-red-600">{metrics?.failedPayments || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">View Detailed Reports</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Export Booking Data</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage