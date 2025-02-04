import Image from "next/image";
import { Users, Clock8, Menu, PersonStanding, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import ClientCountdownButton from "@/app/home/upcoming/ClientCountdownButton";

export default function BasicCourseCard({
  _id,
  image = "/placeholder.svg",
  title,
  organiser,
  category,
  duration,
  sessions = [], 
  isUpcoming = false, 
  sessionDate,   
  sessionLocation,
  course, 
}) {
  const router = useRouter();

  // Handle navigation when the card is clicked
  const handleCardClick = () => {
    router.push(`/home/${_id}`);
  };

  if (isUpcoming) {
    // === UPCOMING WORKSHOP LAYOUT ===
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-lg hover:cursor-pointer flex flex-col"
        onClick={handleCardClick}
      >
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">{title}</h3>
            <p className="text-md mb-4 text-stone-700 font-semibold">
                {new Date(sessionDate).toLocaleDateString("en-SG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })}
            </p>
            <p className="text-stone-600 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-stone-400" /> 
                {sessionLocation}
            </p>
            <p className="text-stone-600 mb-4 flex items-center gap-1">
                <PersonStanding className="w-4 h-4 text-stone-400" /> {organiser}
            </p>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-stone-500 flex gap-1 items-center">
                <Menu className="w-4 h-4 text-stone-400" />
                {category}
                </span>
                <span className="text-sm text-stone-500 flex gap-1 items-center">
                {duration}
                <Clock8 className="w-4 h-4 text-stone-400" />
                </span>
            </div>

            {/* Show this session's date and location */}
            <ClientCountdownButton 
                sessionDate={sessionDate} 
                course={course}
            />     
        </div>
      </div>
    );
  } else {
    // === ORIGINAL LAYOUT (Multiple Sessions) ===
    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-lg hover:cursor-pointer flex flex-col"
        onClick={handleCardClick}
      >
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-stone-800 mb-2">{title}</h3>
          <p className="text-stone-600 mb-4 flex items-center gap-1">
            <PersonStanding className="w-4 h-4 text-stone-400" /> {organiser}
          </p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-stone-500 flex gap-1 items-center">
              <Menu className="w-4 h-4 text-stone-400" />
              {category}
            </span>
            <span className="text-sm text-stone-500 flex gap-1 items-center">
              {duration}
              <Clock8 className="w-4 h-4 text-stone-400" />
            </span>
          </div>

          {/* Display multiple available sessions */}
          <div className="mt-auto">
            <ul className="space-y-2">
              {sessions.map((session, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-stone-50 p-3 rounded-lg shadow-sm"
                >
                  <span className="text-sm text-stone-600">
                    {new Date(session.date).toLocaleDateString("en-SG", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-stone-500">{session.capacity}</span>
                    <Users className="w-4 h-4 text-stone-400 mr-1" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
