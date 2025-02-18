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

        {/* Video Section */}
        <div className="mb-4">
          <video
            className="w-full h-auto object-contain"
            src="/images/OnboardingVideo.mp4" 
            // Place the file in your "public/videos" folder 
            // or use a URL from a CDN (e.g. S3, Azure, etc.)
            controls
            playsInline  // Especially helpful on iOS so it doesn't open fullscreen
            // optional:
            // muted
            // autoPlay
            // loop
          />
        </div>

        {/* Finish Button */}
        <div className="text-center">
          <Button onClick={onFinish}>Finish</Button>
        </div>
      </div>
    </div>
  );
}
