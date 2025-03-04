"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useState } from "react"; 
// Schema for a single session
const sessionSchema = z.object({
  // Optional _id for existing sessions
  _id: z.string().optional(),
  date: z
      .string()
      .nonempty("Session date/time is required")
      .transform((value) => {
        const dateObj = new Date(value);
        if (isNaN(dateObj.getTime())) {
          throw new Error("Invalid date/time");
        }
        return dateObj;
    }),
  location: z.string().nonempty("Session location is required"),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Capacity must be at least 1")
  ),
  priceId: z.string().optional(),
});
  

// Workshop schema
const workshopSchema = z.object({
  // Optional ID for the workshop
  _id: z.string().optional(),
  title: z.string().nonempty("Workshop title is required"),
  organiser: z.string().nonempty("Organiser is required"),
  shortDescription: z.string().nonempty("Short description is required"),
  fullDescription: z.string().nonempty("Full description is required"),
  image: z.string().nonempty("Image URL is required"),
  category: z.string().nonempty("Category is required"),
  website: z.string().url("Please enter a valid URL").optional(),
  sessions: z.array(sessionSchema).min(1, "At least one session is required"),
  duration: z
    .object({
      hours: z.string().nonempty("Hours required"),
      minutes: z.string().nonempty("Minutes required"),
    })
    .refine((data) => !(data.hours === "0" && data.minutes === "0"), {
      message: "Duration cannot be 0 minutes",
    }),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid monetary amount with up to 2 decimals")
    .transform((val) => parseFloat(val)),
});

// ──────────────────────────────────────────────
// Utility: Convert "2h 30m" -> { hours: "2", minutes: "30" }
// ──────────────────────────────────────────────
function parseDuration(durationStr) {
  if (!durationStr) return { hours: "0", minutes: "0" };
  // e.g. "2h 30m" -> ["2", "30"]
  const [hoursPart, minutesPart] = durationStr.split(" ");
  // hoursPart = "2h", minutesPart = "30m"
  const hours = hoursPart.replace("h", "");   // "2"
  const minutes = minutesPart.replace("m", ""); // "30"
  return { hours, minutes };
}

function toLocalDateTimeString(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    // Convert to local by subtracting the timezone offset,
    // then slice to "YYYY-MM-DDTHH:MM"
    const offset = d.getTimezoneOffset() * 60000;
    const localTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
    return localTime;
}
  

export default function EditWorkshopForm({ workshop, onUpdated }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  // 1) Pre-populate default values from the "workshop" prop
  const defaultValues = {
    _id: workshop._id, // keep track of workshop ID
    title: workshop.title || "",
    organiser: workshop.organiser || "",
    shortDescription: workshop.shortDescription || "",
    fullDescription: workshop.fullDescription || "",
    image: workshop.image || "",
    category: workshop.category || "",
    website: workshop.website || "",
    price: workshop.price?.toFixed(2) ?? "0.00", // Convert number to 2-decimal string
    duration: parseDuration(workshop.duration),  // Convert "2h 30m" -> { hours: "2", minutes: "30" }
    sessions: workshop.sessions?.map((s) => ({
      _id: s._id,
      date: toLocalDateTimeString(s.date),
      location: s.location,
      capacity: s.capacity?.toString() || "",
      priceId: s.priceId,
    })) || [
      {
        date: "",
        location: "",
        capacity: "",
        priceId: "",
      },
    ],
  };

  // 2) Setup React Hook Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workshopSchema),
    defaultValues,
  });

  // For dynamic sessions
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sessions",
  });

  // 3) Submit Handler (PUT to our edit endpoint)
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      //   console.log("✅ Edit Workshop Form submitted:");
      //   console.log("📌 Raw Form Data:", data);

      // Convert { hours, minutes } -> "Xh Ym"
      const formattedDuration = `${data.duration.hours}h ${data.duration.minutes}m`;
      const finalData = {
        ...data,
        duration: formattedDuration,
      };

      // If desired, remove session placeholders (like empty ones)
      // or keep them if you want to allow partial updates.

      //console.log("🚀 Final Formatted Data:", finalData);

      // 4) Make a PUT or PATCH request to /api/workshops/[id]
      // (example: /api/workshops/123)
      const res = await fetch(`/api/edit-workshop/${workshop._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) {
        throw new Error("Failed to update workshop");
      }

      const result = await res.json();
      console.log("Workshop updated:", result);

      // 5) Optionally redirect or call callback
      if (onUpdated) {
        onUpdated(result);
      } else {
        router.push("/admin/");
      }
    } catch (error) {
      console.error("Error updating workshop:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 max-w-2xl mx-auto bg-muted shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Workshop</h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-medium">
          Title:
        </label>
        <input
          id="title"
          placeholder="Enter workshop title..."
          {...register("title")}
          className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Organiser */}
      <div>
        <label htmlFor="organiser" className="block font-medium">
          Organiser:
        </label>
        <input
          id="organiser"
          placeholder="Enter organiser name..."
          {...register("organiser")}
          className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.organiser && (
          <p className="text-red-500 text-sm">{errors.organiser.message}</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="shortDescription" className="block font-medium">
          Short Description:
        </label>
        <textarea
          id="shortDescription"
          placeholder="Enter short description..."
          {...register("shortDescription")}
          className="textarea w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.shortDescription && (
          <p className="text-red-500 text-sm">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      {/* Full Description */}
      <div>
        <label htmlFor="fullDescription" className="block font-medium">
          Full Description:
        </label>
        <textarea
          id="fullDescription"
          placeholder="Enter full description..."
          {...register("fullDescription")}
          className="textarea w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.fullDescription && (
          <p className="text-red-500 text-sm">
            {errors.fullDescription.message}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block font-medium">
          Image URL:
        </label>
        <input
          id="image"
          placeholder="Enter image URL..."
          {...register("image")}
          className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
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

      {/* Duration: Hours & Minutes */}
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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
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
            <option value="0">0</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
        </div>
        {errors.duration?.message && (
          <p className="text-red-500 text-sm">{errors.duration.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block font-medium">
          Category:
        </label>
        <input
          id="category"
          placeholder="Enter category..."
          {...register("category")}
          className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Website (optional) */}
      <div>
        <label htmlFor="website" className="block font-medium">
          Website (optional):
        </label>
        <input
          id="website"
          placeholder="Enter website URL..."
          {...register("website")}
          className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.website && (
          <p className="text-red-500 text-sm">{errors.website.message}</p>
        )}
      </div>

      {/* Sessions Section */}
      <h3 className="text-xl font-semibold mt-8">Sessions</h3>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-md mb-4 space-y-3 relative bg-gray-100"
        >
          {/* Hidden field for session._id if it exists */}
          {field._id && (
            <input type="hidden" {...register(`sessions.${index}._id`)} />
          )}

          <div>
            <label className="block font-medium">
              Date/Time:
            </label>
            <input
              type="datetime-local"
              {...register(`sessions.${index}.date`)}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            {errors.sessions?.[index]?.date && (
              <p className="text-red-500">
                {errors.sessions[index].date.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`sessions.${index}.location`}
              className="block font-medium"
            >
              Location:
            </label>
            <input
              placeholder="Enter location..."
              id={`sessions.${index}.location`}
              type="text"
              {...register(`sessions.${index}.location`)}
              className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.sessions?.[index]?.location && (
              <p className="text-red-500 text-sm">
                {errors.sessions[index].location.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`sessions.${index}.capacity`}
              className="block font-medium"
            >
              Capacity:
            </label>
            <input
              id={`sessions.${index}.capacity`}
              type="number"
              placeholder="Enter capacity..."
              {...register(`sessions.${index}.capacity`)}
              className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.sessions?.[index]?.capacity && (
              <p className="text-red-500 text-sm">
                {errors.sessions[index].capacity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`sessions.${index}.priceId`}
              className="block font-medium"
            >
              Price ID:
            </label>
            <input
              id={`sessions.${index}.priceId`}
              type="text"
              placeholder="Enter price ID from Stripe...If workshop is free, leave blank"
              {...register(`sessions.${index}.priceId`)}
              className="input w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.sessions?.[index]?.priceId && (
              <p className="text-red-500 text-sm">
                {errors.sessions[index].priceId.message}
              </p>
            )}
          </div>

          {/* <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-0 right-2 text-red-600 hover:text-red-800"
          >
            Remove
          </button> */}
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({ date: "", location: "", capacity: "", priceId: "" })
        }
        className="bg-blue-500 text-white px-4 py-2 rounded w-full lg:w-auto"
      >
        Add Session
      </button>

      <div className="text-center">
        <button
          type="submit"
          className={`px-6 py-2 rounded mt-6 w-full lg:w-auto ${
            loading ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-green-500 hover:bg-green-600"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Workshop"}
        </button>
      </div>
    </form>
  );
}
