"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";

export default function PartnersSection() {
  const partners = [
    {
      name: "sunbearartclub",
      logo: "https://images.squarespace-cdn.com/content/v1/64dc7c2dbe364b40dfd78ac7/812a3bce-e342-4d64-96fd-5bfcc39793a7/FOOTER+LOGO.png",
      redirectUrl: "https://www.sunbearartclub.com/",
    },
    {
      name: "Intellect",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTn-riW8uWnQ5Vqo20QRlwdVoRLSlwYq9rtg&s",
      redirectUrl: "https://intellect.co/?fbclid=PAZXh0bgNhZW0CMTEAAaZVGAP9IS0E6wWrvXDWAeRxpdpwGEddHtottKevQ85O2gfcsGReXgPsD-A_aem_azpEkAWleoXN6E_ha2S50Q",
    },
    {
      name: "Dinner with strangers",
      logo: "https://creatorspace.imgix.net/users/clti41y3702gnle014svanbrq/NxvvWKtsb7OPeEbZ-Screenshot%25202024-03-08%2520at%25206.35.43%2520PM.png?w=300&h=300",
      redirectUrl: "https://www.instagram.com/dws.sg/",
    },
    {
      name: "SOAR sg",
      logo: "https://static.wixstatic.com/media/46e747_654cd56e6d3b4a8d8269cdf1423b6b89~mv2.png/v1/crop/x_22,y_0,w_2516,h_2560/fill/w_143,h_145,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SOARLogo-Primary(Web).png",
      redirectUrl: "https://www.soar.sg",
    },
    {
      name: "FriendZone sg",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMgP3CMnmiMAtBi5_HVj0J_u_ckGUxbYNaZg&s",
      redirectUrl: "https://friendzone.sg",
    },
    {
      name: "Singapore Kindness Movement",
      logo: "https://www.kindness.sg/logo.png",
      redirectUrl: "https://www.kindness.sg/",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
        <div className="w-16 h-1 bg-red-500 mx-auto"></div>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative overflow-hidden">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent className="flex gap-4">
            {partners.map((partner) => (
              <CarouselItem
                key={partner.name}
                // Show 2 items (mobile), 3 items (tablet), 4 items (desktop)
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center"
              >
                <Link href={partner.redirectUrl} target="_blank">
                  <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center p-4">
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      width={150}
                      height={150}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Position buttons absolutely so they're inside view */}
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
    </section>
  );
}
