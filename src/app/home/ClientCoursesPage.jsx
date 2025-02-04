"use client";

import { useState, useEffect } from "react";
import BasicCourseCard from "@/components/BasicCourseCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { useRouter } from "next/router";

export default function ClientCoursesPage({ courses }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredCourses, setFilteredCourses] = useState(courses);
   

    // Filter logic:
    // Whenever searchTerm or selectedCategory changes,
    // apply filtering on the original list (courses).
    useEffect(() => {
        let updatedList = courses;

        // Filter by search term
        if (searchTerm.trim() !== "") {
        updatedList = updatedList.filter((course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        // Filter by selected category
        if (selectedCategory) {
        updatedList = updatedList.filter(
            (course) => course.category === selectedCategory
        );
        }

        setFilteredCourses(updatedList);
    }, [searchTerm, selectedCategory, courses]);

    return (
        <div className="min-h-screen bg-stone-100">
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-red-500 mb-6 flex justify-center pb-2 border-b-2">
            Passion blooms from participation, not hesitation.
            </h1>

            {/* Pass down props to manage filters */}
            <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCourses.map((course) => (
                <BasicCourseCard
                    key={course._id}
                    _id={course._id}
                    image={course.image}
                    title={course.title}
                    organiser={course.organiser}
                    category={course.category}
                    duration={course.duration}
                    sessions={course.sessions}
                />
            ))}
            </div>
        </div>
        </div>
    );
}
