import React from 'react'
import { motion } from 'framer-motion'
import DonateCards from './DonateCards'
import Partnerships from './Partnerships'

export default function Donate() {
  return (
    <section id="donate" className="py-24 md:py-32 bg-gradient-to-b from-pink-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">Get Involved</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Make a <span className="text-pink-500">Difference</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Whether you paddle, donate, or volunteer – every contribution creates waves of change</p>
        </motion.div>

        <DonateCards />
        <Partnerships />
      
      </div>
    </section>
  )
}
