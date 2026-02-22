import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import TeamMembers from '@/components/home/Team/TeamMembers'

export default function Crew() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-6">
            Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Meet the <span className="text-[#fc87a7]">Crew</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The passionate people behind Brave the Waves — working year-round to make a difference for women's health.
          </p>
        </motion.div>
        <TeamMembers />
      </div>
    </div>
  )
}
