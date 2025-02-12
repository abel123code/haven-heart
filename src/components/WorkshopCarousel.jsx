"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

function WorkshopCard({ workshop }) {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image Container */}
          <div className="relative h-[300px]">
            <Image
              src={workshop.image || "images/placeholder.webp"}
              alt={workshop.title}
              fill
              className="object-cover rounded-t-lg"
            />
            {/* Ranking Badge */}
            <div className="absolute top-2 left-2 bg-blue-600 rounded-full px-6 py-4 text-white text-xl font-bold shadow">
              #{workshop.id}
            </div>
          </div>
          {/* Workshop Details */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
            <p className="text-gray-600 mb-1 text-sm">
              {workshop.date} &bull; {workshop.time}
            </p>
            <p className="text-gray-600 mb-1 text-sm">{workshop.venue}</p>
            <p className="text-gray-600 mb-2 text-sm">{workshop.price}</p>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">{workshop.organizer}</span>
              {workshop.followers && (
                <span className="text-gray-500 ml-2 text-sm">
                  &bull; {workshop.followers} followers
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function WorkshopCarousel() {
  const workshops = [
    {
      id: 1,
      title: "French Tech connect - Kickoff Edition 2025",
      image:
        "/images/empowering-workshop.avif",
      date: "Tuesday",
      time: "7:00 PM",
      venue: "Lion Brewery Co",
      price: "Free",
      organizer: "La French Tech Singapore",
      followers: 775,
    },
    {
      id: 2,
      title: "GGD CNY Lou Hei 2025",
      image:
        "/images/empowering-workshop.avif",
      date: "Thursday",
      time: "6:00 PM",
      venue: "The Alps Residences",
      price: "Free",
      organizer: "GGD Singapore",
    },
    {
      id: 3,
      title: "Tech Meetup 2025",
      image: "/images/empowering-workshop.avif",
      date: "Friday",
      time: "8:00 PM",
      venue: "The Gateway",
      price: "Free",
      organizer: "Tech Community SG",
    },
    {
      id: 4,
      title: "Design Workshop",
      image: "/images/empowering-workshop.avif",
      date: "Saturday",
      time: "2:00 PM",
      venue: "Design Studio",
      price: "Free",
      organizer: "Design Singapore",
    },
    {
      id: 5,
      title: "Startup Networking Night",
      image: "/images/empowering-workshop.avif",
      date: "Sunday",
      time: "7:00 PM",
      venue: "The Working Capitol",
      price: "Free",
      organizer: "Startup SG",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 2 >= workshops.length ? 0 : prevIndex + 2
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 2 < 0 ? workshops.length - (workshops.length % 2 || 2) : prevIndex - 2
    );
  };

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Top trending in Singapore</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex flex-no-wrap transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 50}%)` }}
            >
              {workshops.map((workshop) => (
                <div key={workshop.id} className="w-full md:w-1/2 flex-shrink-0 px-2">
                  <WorkshopCard workshop={workshop} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
              aria-label="Previous workshops"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
              aria-label="Next workshops"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}