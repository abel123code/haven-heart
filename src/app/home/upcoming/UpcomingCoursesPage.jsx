"use client";

import { useState, useEffect } from "react";
import BasicCourseCard from "@/components/BasicCourseCard";
import SearchAndFilter from "@/components/SearchAndFilter";

export default function ClientUpcomingCoursesPage({ courses }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    // Filter out past sessions, then apply search and category
    let upcomingList = courses.filter((item) => {
      const sessionDate = new Date(item.session.date);
      return sessionDate > new Date(); // Keep only future sessions
    });

    // Search by workshopTitle
    if (searchTerm.trim() !== "") {
      upcomingList = upcomingList.filter((item) =>
        item.workshopTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      upcomingList = upcomingList.filter(
        (item) => item.workshopCategory === selectedCategory
      );
    }

    setFilteredCourses(upcomingList);
  }, [searchTerm, selectedCategory, courses]);

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-red-500 mb-6 flex justify-center pb-2 border-b-2">
          Upcoming Workshops
        </h1>

        {/* Search & Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Grid of upcoming sessions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredCourses.map((course, index) => (
            <BasicCourseCard
              key={index}
              _id={course.workshopId}        // If you want to navigate to /home/workshopId
              isUpcoming={true}
              image={course.workshopImage}
              title={course.workshopTitle}
              organiser={course.workshopOrganiser}
              category={course.workshopCategory}
              duration={course.workshopDuration}
              sessionDate={course.session.date}
              sessionLocation={course.session.location}
              course={course}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
