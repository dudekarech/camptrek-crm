'use client'
import React from 'react'
import { motion } from "motion/react"
import { useQuery } from "@tanstack/react-query"
import { baseInstance } from "@/constants/api"
import { useToast } from '@/components/ui/ToastContainer'
import { 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Edit, 
  Trash2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Link from 'next/link'

// Blog interface based on the API response
interface Blog {
  id: string
  title: string
  content: string
  image_url: string
  author_name: string
  author_email: string
  created_at: string
}

// Loading skeleton component
const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
)

const BlogsPage = () => {
  const { showToast } = useToast()

  const handleFetch = async () => {
    try {
      const response = await baseInstance.get("/blogs/")
      return response.data
    } catch (error: any) {
      console.error("Error fetching blogs:", error)
      throw new Error(error.response?.data?.message || "Failed to fetch blogs")
    }
  }

  const { data: blogs, isLoading, error, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: handleFetch,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
    retry: 2,
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Failed to Load Blogs',
        message: error.message || 'An error occurred while fetching blogs',
        duration: 7000
      })
    }
  })

  // Handle retry
  const handleRetry = () => {
    refetch()
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Blogs</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'We encountered an error while trying to load the blogs. Please try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="mt-2 text-gray-600">Manage your blog posts and content</p>
            </div>
            <Link href="/blogs/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create New Blog
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : blogs?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : blogs?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : 
                    blogs?.filter(blog => {
                      const blogDate = new Date(blog.created_at)
                      const now = new Date()
                      return blogDate.getMonth() === now.getMonth() && 
                             blogDate.getFullYear() === now.getFullYear()
                    }).length || 0
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">All Blog Posts</h2>
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            // Loading skeletons
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
            </div>
          ) : blogs && blogs.length > 0 ? (
            // Actual blog data
            <div className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={blog.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400'}
                        alt={blog.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate mb-2">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{blog.author_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Blog"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Blog"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first blog post</p>
              <Link href="/blogs/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Blog
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogsPage