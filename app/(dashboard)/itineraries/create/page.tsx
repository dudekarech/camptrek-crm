"use client";
import ImageUploader from "@/components/pages/itinerary/create/ImageUploader";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormInput from "@/components/pages/itinerary/create/CustomFormInput";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Plane,
} from "lucide-react";
import DaysInput from "@/components/pages/itinerary/create/DaysInput";
import CustomTextArea from "@/components/pages/itinerary/create/CustomTextArea";
import TagsInput from "@/components/pages/itinerary/create/TagsInput";
import AccomodationDropDown from "@/components/pages/itinerary/create/AccomodationDropDown";
import LocationDropDown from "@/components/pages/itinerary/create/LocationDropDown";
import { motion } from "motion/react";
import axios from "axios";
import CostExcludedInput from "@/components/pages/itinerary/create/CostExludedInput";
import CostIncludedInput from "@/components/pages/itinerary/create/CostIncludedInput";
import { itinerarySchema, TsItinerarySchema } from "@/store/ItineraryZodStore";

// Define the API response type for better type safety
interface ItineraryResponse {
  id: string;
  message: string;
  // Add other response properties as needed
}

const CreateItineraryPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleImageUpload = async (images: { file: File }[]) => {
    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", img.file);
    });

    const response = await axios.post(
      "http://localhost:8000/itineraries/upload-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.uploaded_files;
  };

  const createItinerary = async (data: TsItinerarySchema) => {
    // Upload main images
    const mainImageUrls = await handleImageUpload(data.images);
    
    // Process days and their images
    const processedDays = await Promise.all(
      data.days.map(async (day) => {
        let dayImageUrls: string[] = [];
        if (day.images && day.images.length > 0) {
          dayImageUrls = await handleImageUpload(day.images);
        }
        return {
          day: day.day_number,
          title: day.day_name,
          details: day.details,
          images: dayImageUrls,
        };
      })
    );
    
    const itineraryData = {
      title: data.title,
      duration: data.duration,
      overview: data.overview,
      images: mainImageUrls,
      days: processedDays,
      price: data.price,
      discount: data.discount,
      tags: data.tags.map((tag) => ({ name: tag.name })),
      arrival_city: data.arrivalCity,
      departure_city: data.departureCity,
      accommodation: data.accommodation,
      location: data.location,
      cost_inclusive:
        data.costIncluded?.map((item) => item.item).filter(Boolean) || [],
      cost_exclusive:
        data.costExcluded?.map((item) => item.item).filter(Boolean) || [],
    };
    
    const response = await axios.post<ItineraryResponse>(
      "http://localhost:8000/itineraries/create",
      itineraryData
    );
    
    if (response.status !== 201) {
      throw new Error("Failed to create itinerary.");
    }
    
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createItinerary,
    onSuccess: () => {
      // Invalidate and refetch itineraries list
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      // Redirect
      router.push("/itineraries");
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
  });

  const methods = useForm<TsItinerarySchema>({
    resolver: zodResolver(itinerarySchema) as any,
    // Add default values to ensure all required fields have initial values
    defaultValues: {
      title: "",
      duration: 0,
      overview: "",
      images: [],
      days: [{ day_number: 1, day_name: "", details: "", images: [] }],
      price: 0,
      tags: [{ name: "" }],
      arrivalCity: "",
      departureCity: "",
      accommodation: "Budget",
      location: "Kenya",
      discount: 0,
      costIncluded: [],
      costExcluded: [],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = methods;

  // Watch all form values to debug
  const watchedValues = watch();

  // Check if mutation is loading
  const isLoading = isPending;

  const onSubmit = (data: TsItinerarySchema) => {
    mutate(data); // This triggers useMutation
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Floating Back Button */}
      <button
        className="fixed top-10 left-60 z-20 flex items-center gap-2 bg-white shadow-lg hover:shadow-xl transition-all duration-200 p-3 rounded-full border border-gray-200 hover:border-gray-300"
        onClick={() => router.back()}
        disabled={isPending} // Disable when loading
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" /> Back
      </button>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Itinerary
            </h1>
            <p className="text-lg text-gray-600">
              Plan the perfect East African adventure
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Essential details about the trip
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <CustomFormInput
                  label="Trip Title"
                  register={register("title")}
                  error={errors.title}
                  placeholder="e.g., Amazing Kenya Safari Adventure"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomFormInput
                    label="Duration (Days)"
                    type="text"
                    register={register("duration")}
                    error={errors.duration}
                    placeholder="7"
                  />
                  <CustomFormInput
                    label="Arrival City"
                    register={register("arrivalCity")}
                    error={errors.arrivalCity}
                    placeholder="Nairobi"
                  />
                  <CustomFormInput
                    label="Departure City"
                    register={register("departureCity")}
                    error={errors.departureCity}
                    placeholder="Mombasa"
                  />
                  <CustomFormInput
                    label="Price (USD)"
                    type="text"
                    register={register("price")}
                    error={errors.price}
                    placeholder="2500"
                  />
                </div>

                <CustomFormInput
                  label="Discount % (Optional)"
                  type="text"
                  register={register("discount")}
                  error={errors.discount}
                  placeholder="e.g., 10% off"
                />

                <CustomTextArea
                  label="Trip Overview"
                  register={register("overview")}
                  error={errors.overview}
                  placeholder="Describe the highlights and unique experiences of this itinerary..."
                  rows={4}
                />
              </div>
            </section>

            {/* Image Section */}
            <ImageUploader />

            {/* Destination & Preferences Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Destination & Preferences
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose the destination and accommodation type
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationDropDown />
                <AccomodationDropDown />
              </div>
            </section>

            {/* Organization Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Organization & Planning
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add tags and plan the daily activities
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <TagsInput />
                <DaysInput />
              </div>
            </section>

            {/* Cost Information Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">$</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cost Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Specify what's included and excluded in the tour price
                  </p>
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to Create?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Review the information and create the itinerary
                  </p>
                  {/* Show validation and loading status */}
                  <p className="text-xs mt-1 text-gray-500">
                    Form Status:{" "}
                    {isPending
                      ? "⏳ Processing..."
                      : isValid
                      ? "✅ Ready to submit"
                      : "❌ Please fix errors above"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: isValid && !isPending ? 1.01 : 1 }}
                    whileTap={{ scale: isValid && !isPending ? 0.95 : 1 }}
                    type="submit"
                    disabled={!isValid || isPending}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                      isValid && !isPending
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    {isPending ? "Creating..." : "Create Itinerary"}
                  </motion.button>
                </div>
              </div>
            </section>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateItineraryPage;