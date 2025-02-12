import { AlertTriangle, ExternalLink, Mail, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Terms and Conditions</h1>
        <div className="space-y-8">
          <Section
            icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
            title="General Information"
            content="The content on the HavenHeart website is for general informational purposes only. While the HavenHeart team strives to provide accurate and up-to-date information, we make no representations or warranties, express or implied, regarding the completeness, accuracy, reliability, suitability, or availability of any content on the site. Any reliance on the information provided is strictly at the reader's own risk."
          />

          <Section
            icon={<ExternalLink className="h-6 w-6 text-blue-500" />}
            title="External Links"
            content="The website may contain links to third-party websites managed by external entities. HavenHeart does not investigate, monitor, or guarantee the accuracy of external content and holds no responsibility for actions or decisions based on such information. The inclusion of external links does not imply endorsement of their content or views."
          />

          <Section
            icon={<Shield className="h-6 w-6 text-green-500" />}
            title="Website Availability"
            content="While reasonable efforts are made to keep the site running smoothly, HavenHeart does not warrant that the site will be uninterrupted, error-free, or free of harmful elements. We are not liable for any temporary unavailability due to technical issues beyond our control."
          />

          <Section
            icon={<Users className="h-6 w-6 text-purple-500" />}
            title="Code of Conduct & Access Restrictions"
            content="Participation in HavenHeart workshops and events is restricted to youth between the ages of 18-35. If we determine that a user does not meet this age requirement or engages in harassment during workshops or events, they will be banned from accessing the website."
          />

          <p className="text-sm text-gray-600">
            We reserve the right to update, modify, or restrict access to the site at any time, for any reason, without
            prior notice.
          </p>

          <div className="flex flex-col items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                <p>For queries, please email the HavenHeart team at</p>
            </div>
            <Link href="mailto:HavenHeartsg@gmail.com" className="text-blue-600 hover:underline">
              HavenHeartsg@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, content }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-600">{content}</p>
    </div>
  )
}

