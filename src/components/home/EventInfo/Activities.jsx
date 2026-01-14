import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Music, Utensils, Award, Sparkles } from 'lucide-react'

const activities = [
  { title: 'Dragon Boat Races', description: 'Multiple divisions including corporate, community, and breast cancer survivor teams', icon: Trophy },
  { title: 'Live Entertainment', description: 'Local bands, cultural performances, and DJ sets throughout the day', icon: Music },
  { title: 'Food Festival', description: 'Diverse food vendors offering cuisines from around the world', icon: Utensils },
  { title: 'Health Fair', description: 'Free screenings, wellness information, and health resources', icon: Award },
]

export default function Activities() {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-[#fc87a7]" />
        Activities & Highlights
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: index * 0.1 }} 
            className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 flex items-center justify-center flex-shrink-0">
                <activity.icon className="w-6 h-6 text-[#fc87a7]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{activity.title}</h4>
                <p className="text-slate-600 text-sm">{activity.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
