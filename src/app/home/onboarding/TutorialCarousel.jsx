"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Example tutorial slide images
const tutorialSlides = [
  "/images/f1.jpg",
  "/images/f2.jpg",
  "/images/f3.jpg",
];

export default function TutorialCarousel({ onFinish }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) =>
      Math.min(prev + 1, tutorialSlides.length - 1)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-white p-4 rounded-md shadow relative w-96 max-w-full">
        {/* Close Button (top-right) */}
        <button
          onClick={onFinish}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* Carousel Title */}
        <h2 className="text-xl font-bold mb-4 text-center">Quick Tour</h2>

        {/* Display Current Slide */}
        <div className="mb-4 flex justify-center">
            <Image
                src={tutorialSlides[currentSlideIndex]}
                alt={`Tutorial step ${currentSlideIndex + 1}`}
                width={600}
                height={400}
                className="object-contain"
                // or "object-cover", etc.
            />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === tutorialSlides.length - 1}
          >
            Next
          </Button>
        </div>

        {/* Finish Button for last slide */}
        {currentSlideIndex === tutorialSlides.length - 1 && (
          <div className="mt-4 text-center">
            <Button onClick={onFinish}>Finish</Button>
          </div>
        )}
      </div>
    </div>
  );
}
