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
import { MapPin, Calendar, Plane } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { baseInstance } from '@/constants/api'

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
    }
  })
  const { handleSubmit } = methods
  const router = useRouter();
  const queryClient = useQueryClient();

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
    if (response.status !== 201) throw new Error("Failed to create itinerary.");
    console.log(response.data)
  }

  const mutate = useMutation({
    mutationFn: createItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] })
      router.replace("/itineraries")
    },
    onError: (error: any) => {
      console.error("❌ API Error:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        alert("Failed to create itinerary. Please check all required fields.");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    },
  })

  const onSubmit = async (data: TsItinerarySchema) => {
    mutate.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Itinerary</h1>
            <p className="text-lg text-gray-600">Plan the perfect adventure</p>
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Create?</h3>
                  <p className="text-sm text-gray-600">Review the information and create the itinerary</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={mutate.isPending}
                  className="px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Create Itinerary
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
