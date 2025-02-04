import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 pt-8 flex flex-col">
          <p className="text-base text-gray-400 text-center pb-2">&copy; 2025 Haven Heart. All rights reserved.</p>
          <p className="text-base text-gray-400 text-center pb-2">For collaborations or inquiries, reach us at havenheartsg@gmail.com.</p>
          <p className="text-base text-gray-400 text-center">By using this website, you agree to its Terms and Data Protection Policy. HavenHeart will not be liable for any harm resulting from its use. Recommendations provided by this website do not constitute medical advice.</p>
        </div>
      </div>
    </footer>
  )
}

