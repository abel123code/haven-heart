"use client";

import { useEffect, useState } from "react";

export default function ClientCountdownButton({ sessionDate, course }) {
  const [timeRemaining, setTimeRemaining] = useState("");
  // Countdown Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sessionTime = new Date(sessionDate);
      const difference = sessionTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeRemaining("Session started");
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval
  }, [sessionDate]);

  // Format date to Google Calendar format (YYYYMMDDTHHMMSSZ)
  const formatDateForCalendar = (date) => {
    const formattedDate = new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    return formattedDate;
  };

  // Handle Add to Calendar
  const handleAddToCalendar = (e) => {
    e.stopPropagation(); 
    const startDate = formatDateForCalendar(sessionDate); // Start date in correct format
    const endDate = formatDateForCalendar(new Date(new Date(sessionDate).getTime() + 2 * 60 * 60 * 1000)); // Assume 2-hour duration for the workshop

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      course.workshopTitle
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      course.workshopShortDescription
    )}&location=${encodeURIComponent(course.session.location)}`;

    // Open Google Calendar event creation page
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="flex justify-between items-center border-t-2 pt-2">
      {/* Countdown Timer */}
      <p className="text-sm text-stone-500 font-semibold">{timeRemaining}</p>

      {/* Add to Calendar Button */}
      <button
        onClick={handleAddToCalendar}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold"
      >
        Add to Calendar
      </button>
    </div>
  );
}
