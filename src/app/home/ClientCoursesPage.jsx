"use client";

import { useState, useEffect } from "react";
import BasicCourseCard from "@/components/BasicCourseCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { useRouter } from "next/router";
import { Search, Filter, Sparkles } from "lucide-react"

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
            {/* <h1 className="text-3xl font-semibold text-red-500 mb-6 flex justify-center pb-2 border-b-2">
            Passion blooms from participation.
            </h1> */}
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
                    Our Workshops
                    </h1>

                    <div className="relative mb-8 max-w-2xl mx-auto">
                    <p className="text-xl md:text-2xl italic text-stone-600 px-8 py-4 relative">
                        <span className="absolute top-0 left-0 text-4xl text-red-400">"</span>
                        Passion blooms from participation
                        <span className="absolute bottom-0 right-0 text-4xl text-red-400">"</span>
                    </p>
                    </div>

                    <div className="w-24 h-[2px] bg-gradient-to-r from-red-300 to-red-500 mb-8"></div>

                    <p className="max-w-2xl text-stone-600 mb-8">
                        Explore our diverse range of hands-on workshops designed to inspire creativity, foster skill development,
                        and build community through collaborative learning.
                    </p>
                </div>
            </div>

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
