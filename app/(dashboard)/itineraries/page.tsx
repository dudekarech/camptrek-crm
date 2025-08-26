"use client";
import ItineraryCard from "@/components/pages/itinerary/main/ItineraryCard";

import SkeletonCard from "@/components/pages/itinerary/main/SkeletonCard";
import { baseInstance } from "@/constants/api";
import { ItineraryProps } from "@/constants/propConstants";



import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React from "react";

const ItinerariesPage = () => {
  const router = useRouter();
  const fetchItineraries = async () => {
    const response = await baseInstance.get("/itineraries");
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["itineraries",],
    queryFn: fetchItineraries,
    staleTime: 1000 * 60 * 30, 
    gcTime: 1000 * 60 * 35,
  });

  const handleCreate = () => {
    router.push("/itineraries/create");
  };

  if (isLoading)
    return (
      <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-2xl font-bold">Itineraries</p>
          <p className="text-sm text-gray-500">Manage your itineraries</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Create
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data && data.itineraries.length > 0 ? (
          data.itineraries.map((itinerary: ItineraryProps) => (
            <ItineraryCard key={itinerary.id} {...itinerary} />
          ))
        ) : (
          <div>
            <p>No itineraries found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerariesPage;
