import React from 'react'
import { motion } from 'framer-motion'
import TeamMembers from './TeamMembers'


export default function Team() {
  return (
    <section id="team" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-6">Our Team</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Meet the <span className="text-[#fc87a7]">Crew</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Dedicated individuals steering Brave the Waves toward greater impact</p>
        </motion.div>
        <TeamMembers />
        </div>
        </section>
    )
}