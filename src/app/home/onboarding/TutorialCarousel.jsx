"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TutorialCarousel({ onFinish }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="relative bg-white p-4 rounded-md shadow w-full max-w-4xl mx-4">
        {/* Close Button (top-right) */}
        <button
          onClick={onFinish}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-center">Quick Video Tour</h2>

        {/* Responsive Video Wrapper */}
        <div className="mb-4">
          <div className="aspect-w-16 aspect-h-9">
            <video
              src="/images/OnboardingVideo.mp4" 
              // or wherever your video is hosted
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          </div>
        </div>

        {/* Finish Button */}
        <div className="text-center">
          <Button onClick={onFinish}>Finish</Button>
        </div>
      </div>
    </div>
  );
}
