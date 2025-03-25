import { HelpCircle, Phone } from "lucide-react"

const faqs = [
  {
    question: "What do I have to do to get started on this website?",
    answer:
      "It's simple. You just need to sign up using your Gmail account or your phone, set up your profile and complete a short questionnaire for us to get to know you better!",
  },
  {
    question: "Is the website free to use?",
    answer:
      "Yes, of course! It's free for everyone to use! However, some of the workshops we provide may not be free. We try to keep costs as low as possible or, wherever possible, free to access! If you are feeling satisfied with our services and would like to gain access to a few more features, we have a membership plan for you!",
  },
  {
    question: "Is the website secure? Will my data be shared to anyone without my consent?",
    answer:
      "Fret not, all your data is kept secure in accordance with the PDPA guidelines. It will only be shared with the relevant agencies under our experts' requests and most importantly, your consent.",
  },
  {
    question: "What types of workshops do you provide?",
    answer:
      "We offer a large variety of workshops, catered to meet the varying needs of our users. From personal mindfulness to therapy classes, we make sure to use the latest guidelines to recommend you something relevant!",
  },
  {
    question: "What is the intended function of your website? Who are your target audiences?",
    answer:
      "Our website aims to be a one-stop access portal for youths who are facing mental health related challenges. We have a system in place that recommends the most relevant course of action such as workshops or good practices to empower you to take control of the situation!",
  },
  {
    question: "Where would the proceeds or fees collected go to?",
    answer:
      "It will go to support our partners who are helping out with workshops and events! Extras will go to help other causes that promote mental wellness and advocate for mental health!",
  },
  {
    question: "How can I seek professional help through your website?",
    answer:
      "We have a section for infographics related to helping you find suitable professional services/personnel. A list of subsidies has also been listed for you as cost is one of the main concerns among those seeking help.",
  },
]

const helplines = [
  { name: "Samaritans Of Singapore (SOS) 24hr hotline", number: "1800 221 4444" },
  { name: "SOS Caretext", number: "9151 1767 (WhatsApp)" },
  { name: "SOS Caremail", email: "pat@sos.org.sg" },
  { name: "Singapore Association for Mental Health hotline", number: "1800 283 7019" },
  { name: "Institute of Mental Health hotline", number: "6389 2222" },
]

export const metadata = {
  title: 'FAQs & Helplines | Haven HeartSG',
  description: 'Find answers to common questions about Haven HeartSG and explore mental health helplines available in Singapore.',
}

export default function FAQ() {
  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-16 text-gray-800">Frequently Asked Questions</h1>

        <div className="space-y-12 mb-16">
          {faqs.map((faq, index) => (
            <article key={index}>
              <div className="flex items-start mb-2">
                <HelpCircle className="w-6 h-6 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-700">{faq.question}</h2>
              </div>
              <p className="text-gray-600 ml-9">{faq.answer}</p>
            </article>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-center mb-8">
            <Phone className="w-6 h-6 text-gray-400 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-700">Helplines</h2>
          </div>
          <ul className="space-y-4">
            {helplines.map((helpline, index) => (
              <li key={index} className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800">{helpline.name}</h3>
                {helpline.number && <p className="text-gray-600">{helpline.number}</p>}
                {helpline.email && <p className="text-gray-600">{helpline.email}</p>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

