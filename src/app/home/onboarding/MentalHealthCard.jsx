"use client"

import { useState } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"


// Reusable card component
export function MentalHealthCard({ title, description }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative">
      <Card 
        className="relative overflow-hidden bg-[#E6E6F2] text-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Accent stripe */}
        <div className="absolute left-0 top-0 h-full w-2 bg-[#40E0D0]" />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </CardHeader>
      </Card>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-2 bg-white border-t-4 border-[#40E0D0]">
              <CardContent className="pt-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

