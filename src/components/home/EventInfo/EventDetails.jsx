import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, MapPin } from 'lucide-react'
import Card from '@/components/ui/card'

export default function EventDetails() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid sm:grid-cols-3 gap-6 mb-16">
      <Card className="p-6 bg-white border-0 shadow-lg shadow-slate-100 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#fc87a7]" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Date</p>
            <p className="font-semibold text-slate-900">June 15, 2025</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-white border-0 shadow-lg shadow-slate-100 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#fc87a7]" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Time</p>
            <p className="font-semibold text-slate-900">7:00 AM - 7:00 PM</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-white border-0 shadow-lg shadow-slate-100 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#fc87a7]" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-semibold text-slate-900">Harbor Marina Park</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
