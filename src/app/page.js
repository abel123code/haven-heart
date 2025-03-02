import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WorkshopCarousel } from "@/components/WorkshopCarousel";
import PartnersSection from "@/components/PartnersSection";
import Head from "next/head";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Participant",
    image: "/images/f1.jpg",
    quote:
      "These workshops have been transformative for my mental health. I've learned valuable coping strategies and met wonderful people.",
  },
  {
    name: "Michael R.",
    role: "Regular Attendee",
    image: "/images/m4.jpg",
    quote:
      "The quality of instructors and the supportive community here are unmatched. It's been a crucial part of my wellness journey.",
  },
  {
    name: "Emily L.",
    role: "First-time Participant",
    image: "/images/f2.jpg",
    quote: "I was hesitant at first, but the workshops exceeded my expectations. The tools I've gained are invaluable.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Improve your mental health with</span>{" "}
              <span className="block text-red-600 xl:inline">expert-led workshops</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Connect with professional therapists and join workshops designed to enhance your mental well-being. Take
              the first step towards a healthier mind today.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <Link href="/register" passHref>
                <Button size="lg" className="w-full sm:w-auto">
                  Sign up for free
                </Button>
              </Link>
              <p className="mt-3 text-sm text-gray-500 flex flex-col items-center lg:items-start">
                No credit card required. Start your journey to better mental health now.
                <Link href={'/info/terms-and-condition'}>
                  <span className="underline cursor-pointer">Terms of Service</span>
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <Image
              src="/images/participants.avif"
              alt="Mental health workshop illustration"
              width={600}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What Our Participants Say</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    className="h-12 w-12 rounded-full"
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkshopCarousel />
      <PartnersSection />
    </div>
  );
}
