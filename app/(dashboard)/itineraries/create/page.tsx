'use client'
import AccommodationDropDown from '@/components/pages/itinerary/create/AccomodationDropDown'
import CostExcludedInput from '@/components/pages/itinerary/create/CostExludedInput'
import CostIncludedInput from '@/components/pages/itinerary/create/CostIncludedInput'
import CustomFormInput from '@/components/pages/itinerary/create/CustomFormInput'
import ItineraryDaysInput from '@/components/pages/itinerary/create/ItineraryDaysInput'
import ItineraryImageUploader from '@/components/pages/itinerary/create/ItineraryImageUploader'
import ItineraryTextArea from '@/components/pages/itinerary/create/ItineraryTextArea'
import LocationDropDown from '@/components/pages/itinerary/create/LocationDropDown'
import TagsInput from '@/components/pages/itinerary/create/TagsInput'
import { itinerarySchema, TsItinerarySchema } from '@/store/ItineraryZodStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { motion } from "motion/react"
import { MapPin, Calendar, Plane, CheckCircle, AlertCircle, Save } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { baseInstance } from '@/constants/api'
import { useEffect, useState } from 'react'

type imageProp = {
  image_url: string
  image_public_id: string
}

type dayImageProp = {
  day: number
  title: string
  details: string
  images: imageProp[]
}

const CreatePage = () => {
  const [isFormValid, setIsFormValid] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const methods = useForm<TsItinerarySchema>({
    resolver: zodResolver(itinerarySchema) as any,
    defaultValues: {
      title: "",
      overview: "",
      tags: [{ name: "" }],
      arrivalCity: "",
      departureCity: "",
      accommodation: "Budget",
      location: "Kenya",
      costIncluded: [],
      costExcluded: [],
      discount: 0
    },
    mode: 'onChange' // Enable real-time validation
  })

  const { handleSubmit, watch, formState: { errors, isValid } } = methods
  const router = useRouter();
  const queryClient = useQueryClient();

  // Watch all form fields for changes
  const watchedValues = watch()

  // Validate form completion
  useEffect(() => {
    const validateForm = () => {
      const errors: string[] = []
      
      // Basic required fields
      if (!watchedValues.title?.trim()) {
        errors.push('Trip title is required')
      }
      
      if (!watchedValues.overview?.trim()) {
        errors.push('Trip overview is required')
      }
      
      if (!watchedValues.duration || watchedValues.duration < 1) {
        errors.push('Duration must be at least 1 day')
      }
      
      if (!watchedValues.price || watchedValues.price < 1) {
        errors.push('Price must be greater than 0')
      }
      
      if (!watchedValues.arrivalCity?.trim()) {
        errors.push('Arrival city is required')
      }
      
      if (!watchedValues.departureCity?.trim()) {
        errors.push('Departure city is required')
      }
      
      // Tags validation
      if (!watchedValues.tags || watchedValues.tags.length === 0 || 
          watchedValues.tags.every(tag => !tag.name?.trim())) {
        errors.push('At least one tag is required')
      }
      
      // Images validation
      if (!watchedValues.images || watchedValues.images.length === 0) {
        errors.push('At least one image is required')
      }
      
      // Days validation
      if (!watchedValues.days || watchedValues.days.length === 0) {
        errors.push('At least one day is required')
      } else {
        // Validate each day
        watchedValues.days.forEach((day, index) => {
          if (!day.title?.trim()) {
            errors.push(`Day ${index + 1} title is required`)
          }
          if (!day.details?.trim()) {
            errors.push(`Day ${index + 1} details are required`)
          }
        })
      }
      
      // Cost arrays validation (optional but if provided, must have content)
      if (watchedValues.costIncluded && watchedValues.costIncluded.length > 0) {
        const hasValidCostIncluded = watchedValues.costIncluded.some(item => item.item?.trim())
        if (!hasValidCostIncluded) {
          errors.push('Cost included items must have valid content')
        }
      }
      
      if (watchedValues.costExcluded && watchedValues.costExcluded.length > 0) {
        const hasValidCostExcluded = watchedValues.costExcluded.some(item => item.item?.trim())
        if (!hasValidCostExcluded) {
          errors.push('Cost excluded items must have valid content')
        }
      }

      setValidationErrors(errors)
      
      if (errors.length === 0) {
        setIsFormValid(true)
        setValidationMessage('Form is ready to submit!')
      } else {
        setIsFormValid(false)
        setValidationMessage(`Please fix ${errors.length} issue(s)`)
      }
    }

    validateForm()
  }, [watchedValues])

  const handleImagesUpload = async (images: { file: File }[]) => {
    const formData = new FormData()
    
    images.forEach((image) => {
      formData.append("files", image.file) // must match the backend param name
    })

    const response = await baseInstance.post("/itineraries/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  }

  const createItinerary = async (data: TsItinerarySchema) => {
    const itineraryImages = await handleImagesUpload(data.images)
    const processedDays = await Promise.all(
      data.days.map(async (day) => {
        let dayImageUrls: imageProp[] = []
        if (day.images && day.images.length > 0) {
          dayImageUrls = await handleImagesUpload(day.images)
        }
        return {
          day: day.day,
          title: day.title,
          details: day.details,
          images: dayImageUrls
        }
      })
    )
    const payload = {
      title: data.title,
      duration: data.duration,
      overview: data.overview,
      images: itineraryImages,
      days: processedDays,
      price: data.price,
      tags: data.tags.map((tag) => ({ name: tag.name })),
      arrival_city: data.arrivalCity,
      departure_city: data.departureCity,
      accommodation: data.accommodation,
      location: data.location,
      discount: data.discount,
      cost_inclusive: data.costIncluded?.map((item) => item.item).filter(Boolean) || [],
      cost_exclusive: data.costExcluded?.map((item) => item.item).filter(Boolean) || []
    }

    const response = await baseInstance.post("/itineraries/create", payload)
    if (response.status !== 201) throw new Error("Failed to create itinerary.")
    
    return response.data
  }

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: createItinerary,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] })
      router.push('/itineraries')
    },
    onError: (error: any) => {
      console.error("Create Error:", error.response?.data || error.message)
      alert(error.response?.data?.message || "Failed to create itinerary. Please try again.")
    },
  })

  const onSubmit = async (data: TsItinerarySchema) => {
    if (!isFormValid) {
      alert('Please fix all validation errors before submitting')
      return
    }
    createMutation(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Itinerary</h1>
            <p className="text-lg text-gray-600">Plan the perfect adventure</p>
            
            {/* Form Validation Status */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {isFormValid ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">{validationMessage}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-600">{validationMessage}</span>
                </>
              )}
            </div>
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
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-600">Essential details about the trip</p>
                </div>
              </div>

              <div className="space-y-6">
                <CustomFormInput title='Trip Title' name='title' placeholder='e.g., Amazing Safari' />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomFormInput title='Duration (days)' name='duration' placeholder='7' type='number' />
                  <CustomFormInput title='Arrival City' name='arrivalCity' placeholder='Nairobi' />
                  <CustomFormInput title='Departure City' name='departureCity' placeholder='Mombasa' />
                  <CustomFormInput title='Price (USD)' name='price' placeholder='2500' type='number' />
                </div>

                <CustomFormInput title='Discount % (Optional)' name='discount' placeholder='e.g., 10' type='number'/>
                <ItineraryTextArea name='overview' title='Trip Overview' />
              </div>
            </section>

            {/* Images */}
            <ItineraryImageUploader />

            {/* Destination & Preferences Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Destination & Preferences</h2>
                  <p className="text-sm text-gray-600">Choose the destination and accommodation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationDropDown />
                <AccommodationDropDown />
              </div>
            </section>

            {/* Tags & Days Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Organization & Planning</h2>
                  <p className="text-sm text-gray-600">Add tags and daily activities</p>
                </div>
              </div>

              <div className="space-y-8">
                <TagsInput />
                <ItineraryDaysInput />
              </div>
            </section>

            {/* Cost Information Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">$</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cost Information</h2>
                  <p className="text-sm text-gray-600">Specify what's included and excluded</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CostIncludedInput />
                <CostExcludedInput />
              </div>
            </section>

            {/* Submit Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Create?</h3>
                  <p className="text-sm text-gray-600">
                    {isFormValid 
                      ? "All required fields are complete - you can now create the itinerary"
                      : "Please complete all required fields to enable submission"
                    }
                  </p>
                  
                  {/* Validation Errors Display */}
                  {validationErrors.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-red-600">Issues to fix:</p>
                      <ul className="text-sm text-red-500 space-y-1">
                        {validationErrors.slice(0, 3).map((error, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            {error}
                          </li>
                        ))}
                        {validationErrors.length > 3 && (
                          <li className="text-xs text-red-400">
                            ...and {validationErrors.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={isFormValid ? { scale: 1.01 } : {}}
                  whileTap={isFormValid ? { scale: 0.95 } : {}}
                  type="submit"
                  disabled={!isFormValid || isPending}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                    isFormValid && !isPending
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isFormValid ? 'Create Itinerary' : 'Complete Required Fields'}
                    </>
                  )}
                </motion.button>
              </div>
            </section>

          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default CreatePage
