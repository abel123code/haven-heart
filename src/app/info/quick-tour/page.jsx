"use client";

import { Video } from "lucide-react";

export default function TutorialPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-4">
          <Video className="text-blue-500 w-10 h-10" />
          Website Quick Tour
        </h1>
        <p className="text-gray-600 mt-2">
          Watch this short video to get a quick overview of all key features.
        </p>

        {/* Video Container */}
        <div className="mt-6 w-full">
          <video
            className="w-full rounded-lg shadow-lg"
            controls
          >
            <source src="/images/OnboardingVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
