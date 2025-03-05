"use client";

import { useState, useEffect } from "react";
import BasicCourseCard from "@/components/BasicCourseCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { Search, Filter, Sparkles } from "lucide-react"

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
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-red-300/70 to-transparent"></div>
          </div>

          <div className="relative flex flex-col items-center text-center">
              <div className="mb-2 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm uppercase tracking-wider text-stone-500 font-medium">Discover & Learn</span>
              <Sparkles className="h-5 w-5 text-red-500 ml-2" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-stone-800 mb-4">
                Upcoming Workshops
              </h1>

              <div className="relative mb-8 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl italic text-stone-600 px-8 py-4 relative">
                  <span className="absolute top-0 left-0 text-4xl text-red-400">"</span>
                  Passion blooms from participation
                  <span className="absolute bottom-0 right-0 text-4xl text-red-400">"</span>
              </p>
              </div>
          </div>
        </div>

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
