'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Search, 
  Mail, 
  Send, 
  FileText, 
  Archive, 
  Star,
  Reply,
  Forward,
  UserPlus,
  MessageSquare,
  Plus,
  Settings,
  RefreshCw,
  Download,
  Paperclip,
  X,
  MoreVertical
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'

const InboxPage = () => {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Shared Inbox</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected to Gmail</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsComposing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Compose
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Folders */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {[
                { id: 'inbox', name: 'Inbox', icon: <Mail className="w-4 h-4" />, count: 12 },
                { id: 'sent', name: 'Sent', icon: <Send className="w-4 h-4" />, count: 8 },
                { id: 'drafts', name: 'Drafts', icon: <FileText className="w-4 h-4" />, count: 3 },
                { id: 'archived', name: 'Archived', icon: <Archive className="w-4 h-4" />, count: 45 },
                { id: 'starred', name: 'Starred', icon: <Star className="w-4 h-4" />, count: 5 }
              ].map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedFolder === folder.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {folder.icon}
                    <span className="font-medium">{folder.name}</span>
                  </div>
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                </button>
              ))}
            </nav>

            {/* Team Members */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Team Members</h3>
              <div className="space-y-2">
                {[
                  { id: '1', name: 'Alice Johnson', email: 'alice@camptrek.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', isOnline: true },
                  { id: '2', name: 'Bob Smith', email: 'bob@camptrek.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', isOnline: true },
                  { id: '3', name: 'Carol Davis', email: 'carol@camptrek.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', isOnline: false }
                ].map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Email List */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {selectedFolder}
                </h2>
                <span className="text-sm text-gray-600">3 emails</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {[
                {
                  id: '1',
                  from: 'john.doe@example.com',
                  subject: 'Safari Booking Inquiry',
                  snippet: 'Hi, I\'m interested in booking a 7-day safari for my family...',
                  timestamp: '10:30 AM',
                  isRead: false,
                  isStarred: true,
                  status: 'open'
                },
                {
                  id: '2',
                  from: 'sarah.wilson@travelagency.com',
                  subject: 'Corporate Group Booking Request',
                  snippet: 'We have a corporate group of 15 people looking to book...',
                  timestamp: '9:15 AM',
                  isRead: true,
                  isStarred: false,
                  status: 'pending'
                },
                {
                  id: '3',
                  from: 'mike.chen@adventure.com',
                  subject: 'Photography Safari Special Requirements',
                  snippet: 'I\'m a professional wildlife photographer and need...',
                  timestamp: '8:45 AM',
                  isRead: true,
                  isStarred: false,
                  status: 'open'
                }
              ].map((email) => (
                <motion.div
                  key={email.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id 
                      ? 'bg-blue-50 border-r-2 border-blue-600' 
                      : 'hover:bg-gray-50'
                  } ${!email.isRead ? 'bg-blue-50/50' : ''}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {email.from.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium truncate ${!email.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {email.from}
                          </p>
                          {!email.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          {email.isStarred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{email.timestamp}</span>
                        </div>
                      </div>
                      
                      <p className={`font-medium mb-1 truncate ${!email.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {email.subject}
                      </p>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {email.snippet}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          email.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          email.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {email.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Email Thread */}
        {selectedEmail && (
          <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEmail.subject}</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedEmail.from.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedEmail.from}</p>
                    <p className="text-sm text-gray-600">{selectedEmail.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowReplyBox(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Forward className="w-4 h-4" />
                  Forward
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Assign
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Add Note
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="prose max-w-none">
                <p>This is the email content. In a real implementation, this would contain the actual email body with HTML formatting.</p>
                <p>The email would include all the details about the safari booking inquiry, including specific requirements, dates, and any attachments.</p>
              </div>
            </div>

            {showReplyBox && (
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Reply</h4>
                    <button 
                      onClick={() => setShowReplyBox(false)}
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    placeholder="Type your reply..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setShowReplyBox(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compose Modal */}
        <AnimatePresence>
          {isComposing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Compose Email</h3>
                  <button
                    onClick={() => setIsComposing(false)}
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="recipient@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Type your message..."
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-6">
                  <button
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Send Email
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default InboxPage


