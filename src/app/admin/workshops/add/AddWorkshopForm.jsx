'use client'

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

// ──────────────────────────────────────────────
// Zod Schemas
// ──────────────────────────────────────────────

// Schema for a single session
const sessionSchema = z.object({
  // HTML date input returns a string. You may convert it later.
  date: z
    .string()
    .nonempty("Session date/time is required")
    .transform((val) => {
      const dateObj = new Date(val);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date/time");
      }
      return dateObj; // Return a real Date
    }),
  location: z.string().nonempty("Session location is required"),
  // Preprocess capacity as a number
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Capacity must be at least 1")
  ),
  priceId: z.string().nonempty("Price ID is required"),
});

// Schema for a workshop
const workshopSchema = z.object({
  title: z.string().nonempty("Workshop title is required"),
  organiser: z.string().nonempty("Organiser is required"),
  shortDescription: z.string().nonempty("Short description is required"),
  fullDescription: z.string().nonempty("Full description is required"),
  image: z.string().nonempty("Image URL is required"),
  category: z.string().nonempty("Category is required"),
  // Optional website field
  website: z.string().url("Please enter a valid URL").optional(),
  // At least one session is required
  sessions: z.array(sessionSchema).min(1, "At least one session is required"),
  duration: z.object({
    hours: z.string().nonempty("Hours required"),
    minutes: z.string().nonempty("Minutes required"),
  }).refine(
    (data) => !(data.hours === "0" && data.minutes === "0"),
    { message: "Duration cannot be 0 minutes" }
  ),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid monetary amount with up to 2 decimals")
    .transform((val) => parseFloat(val)),
});

// Default form values
const defaultValues = {
  title: "",
  organiser: "",
  shortDescription: "",
  fullDescription: "",
  image: "",
  price: "",
  duration: { hours: "0", minutes: "0" },
  category: "",
  website: "",
  sessions: [
    {
      date: "",
      location: "",
      capacity: "",
      priceId: "",
    },
  ],
};

function AddWorkshopForm() {
    const router = useRouter();
  // Initialize form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workshopSchema),
    defaultValues,
  });

  //console.log("Form Errors:::", errors);


  // For dynamic session fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sessions",
  });

  // On form submission, send data to our API
  const onSubmit = async (data) => {
    // console.log("✅ Form submitted!");
    // console.log("📌 Raw Form Data:::", data);

    // Format duration properly before sending
    const formattedDuration =
      `${data.duration.hours}h ${data.duration.minutes}m`;

    const finalData = {
      ...data,
      duration: formattedDuration, // ✅ Store duration as "1h 30m"
    };

    // console.log("🚀 Final Formatted Data:", finalData);
    try {
        const res = await fetch("/api/workshops", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
        });

        if (!res.ok) {
            throw new Error("Failed to create workshop");
        }

        const result = await res.json();
        router.push("/admin");
        // console.log("Created Workshop & Sessions:", result);
        // You may add success notification or redirect here
    } catch (error) {
        console.error("Error:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Workshop</h2>

        {/* Workshop Details */}
        <div>
            <label htmlFor="title" className="block font-medium">Title:</label>
            <input 
            id="title" 
            placeholder="Enter workshop title..."
            {...register("title")} 
            className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
            <label htmlFor="organiser" className="block font-medium">Organiser:</label>
            <input 
            id="organiser" 
            placeholder="Enter organiser name..."
            {...register("organiser")} 
            className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.organiser && <p className="text-red-500 text-sm">{errors.organiser.message}</p>}
        </div>

        <div>
            <label htmlFor="shortDescription" className="block font-medium">Short Description:</label>
            <textarea 
            id="shortDescription" 
            placeholder="Enter short description..."
            {...register("shortDescription")} 
            className="textarea w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.shortDescription && <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>}
        </div>

        <div>
            <label htmlFor="fullDescription" className="block font-medium">Full Description:</label>
            <textarea 
            id="fullDescription" 
            placeholder="Enter full description..."
            {...register("fullDescription")} 
            className="textarea w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.fullDescription && <p className="text-red-500 text-sm">{errors.fullDescription.message}</p>}
        </div>

        <div>
            <label htmlFor="image" className="block font-medium">Image URL:</label>
            <input 
            id="image" 
            placeholder="Enter image URL..."
            {...register("image")} 
            className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {/* Price (2 decimals) */}
        <div>
            <label htmlFor="price" className="block font-medium">
            Price (SGD):
            </label>
            <input
            id="price"
            placeholder="e.g. 10, 10.5, 10.00, 99.99"
            {...register("price")}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
        </div>

        <div className="flex gap-2">
            <div>
                <label htmlFor="hours" className="block font-medium">
                Hours
                </label>
                <select 
                id="hours" 
                {...register("duration.hours")}
                className="input border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                </select>
            </div>

            <div>
                <label htmlFor="minutes" className="block font-medium">
                Minutes
                </label>
                <select 
                id="minutes" 
                {...register("duration.minutes")}
                className="input border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                </select>
            </div>
            {errors.duration?.message && (
                <p className="text-red-500 text-sm">{errors.duration.message}</p>
            )}
        </div>


        <div>
            <label htmlFor="category" className="block font-medium">Category:</label>
            <input 
            id="category" 
            placeholder="Enter category..."
            {...register("category")} 
            className="input w-full lg:w-3/4 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
            <label htmlFor="website" className="block font-medium">Website (optional):</label>
            <input 
            id="website" 
            placeholder="Enter website URL..."
            {...register("website")} 
            className="input w-full lg:w-3/4 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
        </div>

        {/* Sessions Section */}
        <h3 className="text-xl font-semibold mt-8">Sessions</h3>
        {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-md mb-4 space-y-3 relative bg-gray-100">
            <div>
                <label htmlFor={`sessions.${index}.date`} className="block font-medium">Date:</label>
                <input 
                id={`sessions.${index}.date`} 
                type="datetime-local" 
                placeholder="Select date..."
                {...register(`sessions.${index}.date`)} 
                className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.sessions?.[index]?.date && <p className="text-red-500 text-sm">{errors.sessions[index].date.message}</p>}
            </div>

            <div>
                <label htmlFor={`sessions.${index}.location`} className="block font-medium">Location:</label>
                <input 
                placeholder="Enter location..."
                id={`sessions.${index}.location`} 
                type="text" 
                {...register(`sessions.${index}.location`)} 
                className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.sessions?.[index]?.location && <p className="text-red-500 text-sm">{errors.sessions[index].location.message}</p>}
            </div>

            <div>
                <label htmlFor={`sessions.${index}.capacity`} className="block font-medium">Capacity:</label>
                <input 
                id={`sessions.${index}.capacity`} 
                type="number" 
                placeholder="Enter capacity..."
                {...register(`sessions.${index}.capacity`)} 
                className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.sessions?.[index]?.capacity && <p className="text-red-500 text-sm">{errors.sessions[index].capacity.message}</p>}
            </div>

            <div>
                <label htmlFor={`sessions.${index}.priceId`} className="block font-medium">Price ID:</label>
                <input 
                id={`sessions.${index}.priceId`} 
                type="text" 
                placeholder="Enter price ID from Stripe..."
                {...register(`sessions.${index}.priceId`)} 
                className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.sessions?.[index]?.priceId && <p className="text-red-500 text-sm">{errors.sessions[index].priceId.message}</p>}
            </div>

            <button 
                type="button" 
                onClick={() => remove(index)} 
                className="absolute top-0 right-2 text-red-600 hover:text-red-800"
            >
                Remove
            </button>
            </div>
        ))}

        <button 
            type="button" 
            onClick={() => append({ date: "", location: "", capacity: "", priceId: "" })} 
            className="bg-blue-500 text-white px-4 py-2 rounded w-full lg:w-auto"
        >
            Add Session
        </button>

        <div className="text-center">
            <button 
            type="submit" 
            className="bg-green-500 text-white px-6 py-2 rounded mt-6 w-full lg:w-auto hover:cursor-pointer hover:bg-green-600"
            >
            Submit Workshop
            </button>
        </div>
    </form>

  );
}

export default AddWorkshopForm;
