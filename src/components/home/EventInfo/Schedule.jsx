import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Trophy, Music, Utensils, Award, Users } from 'lucide-react'

// const schedule = [
//   { time: '7:00 AM', event: 'Registration & Check-in', icon: Users, description: 'Team registration and welcome packets' },
//   { time: '8:00 AM', event: 'Opening Ceremony', icon: Award, description: 'Welcome address and warm-up session' },
//   { time: '9:00 AM', event: 'Heat Races Begin', icon: Trophy, description: 'Preliminary races across all divisions' },
//   { time: '12:00 PM', event: 'Lunch & Entertainment', icon: Utensils, description: 'Food vendors and live performances' },
//   { time: '2:00 PM', event: 'Semi-Finals', icon: Trophy, description: 'Top teams compete for finals spots' },
//   { time: '4:00 PM', event: 'Championship Finals', icon: Trophy, description: 'Final races and spectator favorites' },
//   { time: '5:30 PM', event: 'Awards Ceremony', icon: Award, description: 'Recognition and celebration' },
//   { time: '6:30 PM', event: 'Closing Celebration', icon: Music, description: 'Live music and community gathering' },
// ]

export default function Schedule() {
  return (
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <Clock className="w-6 h-6 text-[#fc87a7]" />
        Race Day Schedule
      </h3>
      {/* <div className="space-y-1">
        {schedule.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: index * 0.05 }} 
            className="flex gap-4 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fc87a7] to-[#fc87a7]/90 flex items-center justify-center shadow-lg shadow-[#fc87a7]/20 group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              {index < schedule.length - 1 && <div className="w-0.5 h-full bg-gradient-to-b from-[#fc87a7]/30 to-[#fc87a7]/10 my-1" />}
            </div>
            <div className="pb-8">
              <p className="text-sm font-semibold text-[#fc87a7]">{item.time}</p>
              <p className="font-bold text-slate-900">{item.event}</p>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div> */}
      <div className="text-xl border-l-2 border-[#fc87a7]/30 ml-4 pl-6 py-8 text-slate-600">
      <p> Detailed schedule coming soon. Stay tuned!</p>
      </div>
    </motion.div>
  )
}
