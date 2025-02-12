import { redirect } from "next/dist/server/api-utils"
import Image from "next/image"
import Link from "next/link"

export default function PartnersSection() {
  const partners = [
    {
      name: "Microsoft Silver Partner",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtOv3sBpRijPN15O1iJ9h556pEYCvMd-SYEw&s",
      redirectUrl: "https://www.microsoft.com/",
    },
    {
      name: "Apple",
      logo: "https://graphicsprings.com/wp-content/uploads/2023/07/image-58-1024x512.png",
      redirectUrl: "https://www.apple.com/",
    },
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
      redirectUrl: "https://www.google.com/",
    }
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
        <div className="w-16 h-1 bg-red-500 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-30">
                <Link href={partner.redirectUrl} target="_blank" className="flex items-center justify-center">
                    <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="object-contain w-[90%] h-[90%]"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

