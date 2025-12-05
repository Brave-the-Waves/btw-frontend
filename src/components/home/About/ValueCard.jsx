import React from 'react'
import { motion } from 'framer-motion'

export default function ValueCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group"
    >
      <div className="bg-gradient-to-br from-slate-50 to-pink-50/50 rounded-4xl p-8 h-full border border-slate-100 hover:border-pink-200 transition-all duration-300 hover:shadow-xl hover:shadow-pink-100/50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <item.icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
        <p className="text-slate-600 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  )
}
