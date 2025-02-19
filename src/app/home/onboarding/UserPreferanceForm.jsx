"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { updatePreferencesAction } from "@/app/actions/authActions";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Brain, UserPlus, Heart, Cog } from "lucide-react";
import { preferencesSchema } from "@/lib/schemas/preferancesSchema";
import TutorialCarousel from "./TutorialCarousel";

export default function UserPreferenceForm({ userEmail }) {
  const router = useRouter();
  const { data: session, update } = useSession(); // Use useSession hook

  const [showTutorial, setShowTutorial] = useState(false);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      focusAreas: [],
      challenges: [],
      otherChallenge: "",
      supportPreference: "",
      eventInterests: [],
    },
  });

  // Watch all form fields (optional, can be used for debugging)
  const watchFields = watch();

  // Handle form submission
  const onSubmit = async (data) => {
    if (data.otherChallenge && data.otherChallenge.trim().length > 0) {
      data.challenges.push(data.otherChallenge.trim());
      // Optionally, remove the otherChallenge field after merging.
      delete data.otherChallenge;
    }
    // console.log("onSubmit is triggered");
    // console.log("data:::::", data);
    try {
      await updatePreferencesAction(data, userEmail);
      await update(); 

      
      setShowTutorial(true);
            
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  // // Optional: Log watched fields for debugging
  // useEffect(() => {
  //   console.log("Current form values:", watchFields);
  // }, [watchFields]);

  const handleFinishTutorial = () => {
    // Only now do we redirect
    setShowTutorial(false);
    router.push("/home");
  };

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Mental Health Support Form</CardTitle>
          <CardDescription>
            Please fill out this form to help us understand your needs better. [Est 1 min]
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* FOCUS AREAS */}
            <div className="space-y-4">
              <Label>What would you like to focus on today?</Label>
              {errors.focusAreas && (
                <p className="text-red-500 text-sm">{errors.focusAreas.message}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mental Health */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mental-health"
                    {...register("focusAreas")}
                    value="Mental Health"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <Label htmlFor="mental-health" className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Mental Health</span>
                  </Label>
                </div>

                {/* Personal Growth */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="personal-growth"
                    {...register("focusAreas")}
                    value="Personal Growth"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <Label htmlFor="personal-growth" className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Personal Growth</span>
                  </Label>
                </div>

                {/* Community Engagement */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="community-engagement"
                    {...register("focusAreas")}
                    value="Community Engagement"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <Label
                    htmlFor="community-engagement"
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Community Engagement</span>
                  </Label>
                </div>

                {/* Emotional Support */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emotional-support"
                    {...register("focusAreas")}
                    value="Emotional Support"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <Label
                    htmlFor="emotional-support"
                    className="flex items-center space-x-2"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Emotional Support</span>
                  </Label>
                </div>

                {/* Coping Mechanisms */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="coping-mechanisms"
                    {...register("focusAreas")}
                    value="Coping Mechanisms"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <Label
                    htmlFor="coping-mechanisms"
                    className="flex items-center space-x-2"
                  >
                    <Cog className="h-5 w-5" />
                    <span>Coping Mechanisms</span>
                  </Label>
                </div>
              </div>
            </div>

            {/* CHALLENGES */}
            <div className="space-y-4">
              <Label>
                What specific mental health topics are you interested in exploring? (Select all that apply)
              </Label>
              {errors.challenges && (
                <p className="text-red-500 text-sm">{errors.challenges.message}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Anxiety", "Depression", "Stress", "Burnout", "Grief", "Loneliness"].map(
                  (challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={challenge.toLowerCase()}
                        {...register("challenges")}
                        value={challenge}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <Label htmlFor={challenge.toLowerCase()}>{challenge}</Label>
                    </div>
                  )
                )}
                {/* Additional "Other" field */}
                <div className="mt-2">
                  <Label htmlFor="otherChallenge">
                    Other (please specify)
                  </Label>
                  <input
                    type="text"
                    id="otherChallenge"
                    placeholder="Enter your challenge"
                    {...register("otherChallenge")}
                    className="mt-1 block w-full rounded-md border-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 sm:text-sm"
                  />
                  {errors.otherChallenge && (
                    <p className="text-red-500 text-sm">
                      {errors.otherChallenge.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SUPPORT PREFERENCE */}
            <div className="space-y-4">
              <Label>How would you prefer to receive support?</Label>
              {errors.supportPreference && (
                <p className="text-red-500 text-sm">{errors.supportPreference.message}</p>
              )}
              <div className="flex flex-col space-y-2">
                {[
                  "Workshops",
                  "Community Events",
                  "Online Resources",
                ].map((preference) => (
                  <div key={preference} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={preference.toLowerCase().replace(/\s+/g, "-")}
                      {...register("supportPreference")}
                      value={preference}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <Label
                      htmlFor={preference.toLowerCase().replace(/\s+/g, "-")}
                      className="flex items-center space-x-2"
                    >
                      {preference}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* EVENT INTERESTS */}
            <div className="space-y-4">
              <Label>
                What type of events are you interested in attending? (Select all that apply)
              </Label>
              {errors.eventInterests && (
                <p className="text-red-500 text-sm">{errors.eventInterests.message}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Educational Workshops",
                  "Entertainment or Recreational Events",
                  "Social Connection Meetups",
                  "Inspirational Talks",
                  "Creative Therapy (e.g., art, music)",
                ].map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={event.toLowerCase().replace(/\s+/g, "-")}
                      {...register("eventInterests")}
                      value={event}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <Label htmlFor={event.toLowerCase().replace(/\s+/g, "-")}>{event}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* SUBMIT BUTTON */}
            <Button type="submit" className="w-full hover:bg-blue-950">
              Submit
            </Button>
            <p className="text-xs text-gray-600">
              All questions have been carefully reviewed by mental health professionals to ensure accuracy and relevance.
            </p>
          </form>
        </CardContent>
      </Card>


      {/* Show the tutorial pop-up (carousel) if user submitted successfully */}
      {/* {showTutorial && (
        <TutorialCarousel
          onFinish={handleFinishTutorial}
        />
      )} */}
    </>
  );
}
