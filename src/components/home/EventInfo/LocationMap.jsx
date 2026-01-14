import React from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export default function LocationMap() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
      <div className="bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-5 h-5 text-[#fc87a7]" />
          <span className="font-medium">22Dragons, Rue Saint-Patrick, Montreal </span>
        </div>
      </div>
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2410.891917572161!2d-73.59740026844669!3d45.46463458466725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc910937d665c11%3A0xbaae25ab15b6d06e!2s22Dragons!5e0!3m2!1sen!2sca!4v1764889670422!5m2!1sen!2sca" 
        width="100%" 
        height="400" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade" 
        title="Event Location Map" 
      />
    </motion.div>
  )
}
