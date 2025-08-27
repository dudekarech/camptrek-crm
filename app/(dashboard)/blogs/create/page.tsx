'use client'
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from "motion/react"
import { z } from 'zod'
import { 
  FileText, 
  User, 
  Image, 
  Type, 
  Plus,
  Trash2,
  Save,
  Eye
} from "lucide-react"

// Blog Schema
const blogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  author_name: z.string().min(1, { message: "Author name is required" }),
  author_email: z.string().email({ message: "Valid email is required" }),
  image: z.object({
    file: z.instanceof(File)
  }).optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  subheadings: z.array(z.object({
    title: z.string().min(1, { message: "Subheading title is required" }),
    content: z.string().min(1, { message: "Subheading content is required" })
  })).optional().default([])
})

type BlogSchema = z.infer<typeof blogSchema>

const CreatePage = () => {
  const methods = useForm<BlogSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      author_name: "",
      author_email: "",
      content: "",
      subheadings: []
    }
  })

  const { handleSubmit, register, watch, setValue, formState: { errors } } = methods
  const [isFocused, setIsFocused] = useState(false)
  const content = watch('content') || ""
  const subheadings = watch('subheadings') || []
  const image = watch('image')

  const addSubheading = () => {
    const newSubheading = { title: '', content: '' }
    setValue('subheadings', [...subheadings, newSubheading])
  }

  const removeSubheading = (index: number) => {
    const updatedSubheadings = subheadings.filter((_, i) => i !== index)
    setValue('subheadings', updatedSubheadings)
  }

  const updateSubheading = (index: number, field: 'title' | 'content', value: string) => {
    const updatedSubheadings = [...subheadings]
    updatedSubheadings[index] = { ...updatedSubheadings[index], [field]: value }
    setValue('subheadings', updatedSubheadings)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('image', { file })
    }
  }

  const removeImage = () => {
    setValue('image', undefined)
  }

  const onSubmit = async (data: BlogSchema) => {
    console.log('Blog data:', data)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
            <p className="text-lg text-gray-600">Share your stories and insights</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Information Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-600">Essential details about your blog post</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Blog Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    placeholder="Enter your blog title..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Slug</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('slug')}
                    placeholder="blog-post-url-slug"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm">{errors.slug.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Author Information Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Author Information</h2>
                  <p className="text-sm text-gray-600">Who wrote this blog post</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Author Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('author_name')}
                    placeholder="Enter author name..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  {errors.author_name && (
                    <p className="text-red-500 text-sm">{errors.author_name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Author Email</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('author_email')}
                    type="email"
                    placeholder="author@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  {errors.author_email && (
                    <p className="text-red-500 text-sm">{errors.author_email.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Blog Image Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Blog Image</h2>
                  <p className="text-sm text-gray-600">Add a featured image for your blog post</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="file"
                  id="blog-image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {!image ? (
                  <label
                    htmlFor="blog-image"
                    className="cursor-pointer block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload blog image</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP up to 5MB</p>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(image.file)}
                      alt="Blog preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-gray-500 mt-2">{image.file.name}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Blog Content Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Blog Content</h2>
                  <p className="text-sm text-gray-600">Write your blog content with optional subheadings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Main Content</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('content')}
                    placeholder="Write your main blog content here..."
                    rows={8}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                  )}
                </div>

                {/* Subheadings Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Subheadings & Sections</h4>
                    <button
                      type="button"
                      onClick={addSubheading}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  </div>

                  {subheadings.map((subheading, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Section {index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeSubheading(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Subheading title..."
                          value={subheading.title}
                          onChange={(e) => updateSubheading(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          placeholder="Subheading content..."
                          rows={3}
                          value={subheading.content}
                          onChange={(e) => updateSubheading(index, 'content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Submit Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Publish?</h3>
                  <p className="text-sm text-gray-600">Review your content and publish the blog post</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Publish Blog
                  </motion.button>
                </div>
              </div>
            </section>

          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default CreatePage
