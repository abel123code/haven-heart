import React from 'react'
import Image from "next/image"
import { Heart, Target, BookOpen, Users } from "lucide-react"

const teamMembers = [
  {
    name: "Darryl",
    role: "Leader",
    image: "/members/darryl.jpg",
    description:
      "With numerous experiences in developing projects for social causes, Darryl believes in being the change you want to see in the world and that anyone can overcome whatever struggle that they are going through when they are not alone.",
  },
  {
    name: "Alicia",
    role: "Marketing",
    image: "/members/alicia.jpg",
    description:
      "An extensive background in marketing and design, Alicia utilises her unique sense of creativity to spread the word of our mission to youths in Singapore.",
  },
  {
    name: "Kazumi",
    role: "Marketing",
    image: "/members/kazumi.jpg",
    description:
      "With an extensive background in marketing and design, Kazumi utilises her unique sense of creativity to spread the word of our mission to youths in Singapore.",
  },
  {
    name: "Wen Quan",
    role: "Logistics and Finances",
    image: "/members/wenquan.jpg",
    description:
      "With Wen Quan's meticulousness to detail, he ensures that the operations of our organisation run smoothly and effectively.",
  },
  {
    name: "Japheth",
    role: "Logistics and Finances",
    image: "/members/japheth.jpg",
    description:
      "With Japheth's ability to adapt to different situations, he ensures that the operations of our organisation run smoothly and effectively.",
  },
  {
    name: "Abel",
    role: "Software Engineer",
    image: "/members/abel.jpg",
    description:
      "His background in coding and critical thinking has made him a pivotal group member in making our website accessible and user-friendly.",
  },
]

const AboutUsPage = () => {
  return (
    <div className="bg-muted min-h-screen">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-16 text-gray-800">About HavenHeart</h1>

        <div className="space-y-16 mb-16">
          <section>
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-gray-400 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-700">Our Mission</h2>
            </div>
            <p className="text-gray-600 ml-9">
              To streamline and simplify the mental health journey for youths in Singapore
            </p>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-gray-400 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-700">Our Vision</h2>
            </div>
            <p className="text-gray-600 ml-9">To foster a resilient generation that thrives emotionally and mentally</p>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-gray-400 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-700">Our Story</h2>
            </div>
            <p className="text-gray-600 ml-9">
              Hello! We are HavenHeart, a non-profit organisation that focuses on bridging the gap between youths and
              mental health and social workshops/events in Singapore. We believe that knowledge about their mental
              health and regular social interactions are the key to help youths to destress.
            </p>
          </section>
        </div>

        <section>
          <div className="flex items-center justify-center mb-8">
            <Users className="w-6 h-6 text-gray-400 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-700">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={member.image || "/images/user.png"}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="rounded-full mr-4 w-[64px] h-[64px] object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                    <h4 className="text-md text-gray-600">{member.role}</h4>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AboutUsPage
