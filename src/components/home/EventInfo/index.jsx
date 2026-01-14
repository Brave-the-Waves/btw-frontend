import React from 'react'
import { motion } from 'framer-motion'
import EventDetails from './EventDetails'
import Schedule from './Schedule'
import Activities from './Activities'
import LocationMap from './LocationMap'

export default function EventInfo() {
  return (
    <section id="event" className="py-24 md:py-32 bg-gradient-to-b from-white to-[#fc87a7]/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-6">Event Details</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Race Day <span className="text-[#fc87a7]">Experience</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">A full day of racing, entertainment, and community celebration</p>
        </motion.div>

        <EventDetails />

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <Schedule />
          <Activities />
        </div>

        <LocationMap />
      </div>
    </section>
  )
}
