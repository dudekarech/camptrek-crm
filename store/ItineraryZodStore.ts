import { z } from "zod"; 

const imageSchema = z.object({
    file: z.instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {message: "Only JPEG, PNG, and WebP files are allowed"})
})

const daysSchema = z.object({
    day_number: z.coerce.number().int().positive({ message: "Day number must be a positive integer" }),
    day_name: z.string().min(1, { message: "Day name is required" }),
    details: z.string().min(1, { message: "Day details are required" }),
    images: z.array(imageSchema).optional().default([]) // Add day images
})

const costIncludedSchema = z.object({
    item: z.string().min(1, { message: "Item cannot be empty" })
})

const costExcludedSchema = z.object({
    item: z.string().min(1, { message: "Item cannot be empty" })
})

const tagsSchema = z.object({
    name : z.string().min(1, { message: "Tag cannot be empty" })
})

const accommodationSchema = z.enum(["Budget", "Mid", "Luxury"])

const locationSchema = z.enum(["Kenya", "Tanzania", "Kenya & Tanzania", "Uganda"])

export const itinerarySchema = z.object({
    title: z.string().min(1, { message: "There should be at least 1 character in the title" }),
    duration: z.coerce.number().int().positive({ message: "Duration must be a positive number" }),
    overview: z.string().min(1, { message: "Overview is required" }),
    images: z.array(imageSchema).min(1, { message: "At least one image is required" }),
    days: z.array(daysSchema).min(1, { message: "There should be at least one day added" }),
    price: z.coerce.number().positive({ message: "Price must be a positive number" }),
    tags: z.array(tagsSchema).min(1, { message: "At least one tag is required" }),
    arrivalCity: z.string().min(1, { message: "Arrival city is required" }),
    departureCity: z.string().min(1, { message: "Departure city is required" }),
    accommodation: accommodationSchema,
    location: locationSchema,
    discount: z.coerce.number().int().nonnegative().optional(),
    costIncluded: z.array(costIncludedSchema).optional().default([]),
    costExcluded: z.array(costExcludedSchema).optional().default([]),
})

export type TsItinerarySchema = z.infer<typeof itinerarySchema>