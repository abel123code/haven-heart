"use client";

import { useState } from "react";
import Image from "next/image";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@heroui/dropdown";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Clock, Users, CheckCircle, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { getSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'


export default function DetailedCourseCard({ 
  workshop 
}) {
  const {
    _id,
    title,
    organiser,
    website,
    shortDescription,
    fullDescription,
    price,
    image,
    sessions = [],
    duration,
    category
  } = workshop;

  // Track which session the user selected
  // We'll store just the session _id here. You could store entire object, if needed.
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const route = useRouter();

  // A helper function to get the session object by ID (if needed)
  const getSelectedSession = () => {
    return sessions.find((session) => session._id === selectedSessionId);
  };

  const handleSessionSelect = (key) => {
    setSelectedSessionId(key);
  };

  const handlePurchase = async () => {
    if (!selectedSessionId) {
      toast("Please select a session first.");
      return;
    }

    const session = await getSession();
    if (!session) {
      toast("You need to be logged in to register.");
      return;
    }

    const currentUserId = session.user.id;
    const selectedSession = getSelectedSession();

    // Check session availability
    const availability = selectedSession.capacity - (selectedSession.participants?.length || 0);
    if (availability <= 0) {
      toast("This session is fully booked.");
      return;
    }

    // Check if user has already registered
    const hasAlreadyPurchased = selectedSession.participants?.includes(currentUserId);
    if (hasAlreadyPurchased) {
      toast("You are already registered for this session.");
      return;
    }

    // **If the session is free, show confirmation popup**
    if (price === 0) {
      setShowConfirmModal(true);
      return;
    }

    // **Paid session - Proceed with Stripe payment**
    try {
      setIsLoading(true);
      const priceId = selectedSession?.priceId;
      const res = await fetch("/api/pay/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selectedSessionId, priceId }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        toast(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation for free session
  const confirmFreeRegistration = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/sessions/register-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          workshopId: _id, // <-- Make sure this matches your workshop ID variable
        }),
      });

      if (res.ok) {
        toast("You have successfully registered for this session!");
        route.push("/home/upcoming");
      } else {
        const data = await res.json();
        toast(`Error: ${data.error || "Could not register"}`);
      }
    } catch (err) {
      console.error("Free session registration error:", err);
      toast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto p-4">
        <Link href="/home">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-md mb-3"
          >
            <ArrowBigLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Courses</span>
          </Button>
        </Link>
        <Card className="p-6 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image Container */}
            <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-black">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <p className="text-white">No Image</p>
              )}
            </div>

            {/* Workshop Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{title}</h1>
                {website ? (
                  <Link href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {organiser}
                  </Link>
                ) : (
                  organiser
                )}
              </div>

              {/* Category Badges (if you have a comma-separated category list) */}
              {category && (
                <div className="flex gap-2">
                  {category.split(",").map((cat) => (
                    <Badge
                      key={cat.trim()}
                      variant="secondary"
                      className="bg-orange-100 hover:bg-orange-100 text-orange-800 border-none"
                    >
                      {cat.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Details</h2>
              {shortDescription && (
                <Badge variant="outline" className="mb-4">
                  {shortDescription}
                </Badge>
              )}

              <div className="text-sm space-y-3">
                <p>{fullDescription}</p>
                <p className="flex items-center gap-2"><Clock /> {duration}</p>

                {/* Sessions Dropdown (NextUI) */}
                <div className="mt-4">
                  <p className="font-semibold mb-2">Choose Your Session:</p>
                  {sessions.length > 0 ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="ghost" className="border border-gray-300">
                          {/* Show selected session or default text */}
                          {selectedSessionId
                            ? `Session: ${
                                new Date(getSelectedSession()?.date).toLocaleString("en-SG", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              }`
                            : "Select a Session"}
                        </Button>
                      </DropdownTrigger>

                      {/* The DropdownMenu calls handleSessionSelect when an item is clicked */}
                      <DropdownMenu
                        aria-label="Select session"
                        variant="flat"
                        onAction={handleSessionSelect}
                      >
                        {sessions.map((session) => {
                          // Format date
                          const dateObj = new Date(session.date);
                          const formattedDate = dateObj.toLocaleString("en-SG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          });

                          // Calculate availability
                          const availability = session.capacity - (session.participants?.length || 0);

                          return (
                            <DropdownItem key={session._id}>
                              <span className="font-medium">
                                {formattedDate} - {session.location}
                              </span>
                              {/* Availability and Capacity */}
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                {/* Capacity Icon and Text */}
                                <Users className="w-4 h-4 inline-block mr-1 text-gray-400" />
                                <span>{session.capacity} total</span>

                                {/* Divider */}
                                <span className="mx-2">|</span>

                                {/* Availability Icon and Text */}
                                <CheckCircle className="w-4 h-4 inline-block mr-1 text-green-500" />
                                <span>{availability} slots left</span>
                              </div>
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <p>No sessions available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase/Registration Button */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-semibold text-gray-700 ml-auto">
                {`SGD $${price}`}
              </span>
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white px-8 rounded-full"
                onClick={handlePurchase}
                disabled={isLoading}
              >
                {/* Show spinner if loading */}
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Processing..." : "Purchase"}
              </Button>
            </div>

            {/* Confirmation Modal for Free Sessions */}
            {showConfirmModal && (
              <Dialog
                title="Confirm Registration"
                onClose={() => setShowConfirmModal(false)}
              >
                <h1 className="text-xl font-semibold">Are you sure you want to register for this free session?</h1>
                <p className="">A confirmation email will be sent to you 3 days prior to confirm your attendence</p>
                <div className="flex justify-end mt-4">
                  <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={confirmFreeRegistration}>
                    Confirm
                  </Button>
                </div>
              </Dialog>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
