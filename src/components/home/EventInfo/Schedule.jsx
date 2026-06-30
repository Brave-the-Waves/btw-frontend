import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Trophy, Utensils, Award, Users, Sparkles } from 'lucide-react'

const schedule = [
  {
    time: '7:30-8:00 AM',
    event: 'Check-in for Community',
    icon: Users,
    description: 'Team registration and welcome packets',
  },
  {
    time: '8:00-9:10 AM',
    event: 'Intro to the Waves',
    icon: Sparkles,
    description: 'Guided warmups and practice time for Community teams',
  },
  {
    time: '8:30-9:00 AM',
    event: 'Check-in for Sports',
    icon: Users,
    description: 'Sports teams check in',
  },
  {
    time: '9:30-10:00 AM',
    event: 'Opening Ceremony',
    icon: Award,
    description: 'Welcome remarks and kickoff celebrations for the day',
  },
  {
    time: '10:15-11:35 AM',
    event: 'BLOCK 1 Races',
    icon: Trophy,
    description: 'Sports and Community heats',
    items: [
      { time: '10:15 AM', label: '200 m Sports' },
      { time: '10:25 AM', label: '100 m Community ABCD' },
      { time: '10:45 AM', label: '100 m Community EFGH' },
      { time: '11:00 AM', label: '500 m Sports' },
      { time: '11:20 AM', label: '200 m Community ACEG' },
      { time: '11:40 AM', label: '200 m Community BDFH' },
    ],
  },
  {
    time: '12:00-1:00 PM',
    event: 'Lunch & Entertainment',
    icon: Utensils,
    description: 'Food vendors and live performances',
  },
  {
    time: '1:00 PM',
    event: 'Raffle Closes',
    icon: Sparkles,
    description: 'Stay tuned for the winner announcements at the closing ceremony!',
  },
  {
    time: '1:15-3:00 PM',
    event: 'BLOCK 2 Races',
    icon: Trophy,
    description: 'Final races and spectator favorites',
    items: [
      { time: '1:15 PM', label: 'Big 4 Sports' },
      { time: '1:30 PM', label: 'Spin to Win Sports' },
      { time: '2:00 PM', label: '200 m B Community' },
      { time: '2:20 PM', label: '200 m A Community' },
      { time: '2:35 PM', label: '200 m Sports' },
    ],
  },
  {
    time: '3:00-4:00 PM',
    event: 'Closing Ceremony',
    icon: Award,
    description: 'Podium presentations, raffle prize winners, final fundraising total, and closing remarks',
  },
]

export default function Schedule() {
  return (
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <Clock className="w-6 h-6 text-[#fc87a7]" />
        Race Day Schedule
      </h3>
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: index * 0.05 }} 
            className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100 border border-slate-100 group"
          >
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fc87a7] to-[#fc87a7]/90 flex items-center justify-center shadow-lg shadow-[#fc87a7]/20 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                {index < schedule.length - 1 && <div className="w-0.5 flex-1 min-h-8 bg-gradient-to-b from-[#fc87a7]/30 to-[#fc87a7]/10 my-1" />}
              </div>
              <div className="flex-1 pb-2">
                <p className="text-sm font-semibold text-[#fc87a7] mb-1 whitespace-nowrap">{item.time}</p>
                <p className="font-bold text-slate-900 text-lg">{item.event}</p>
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>

                {item.items && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {item.items.map((race) => (
                      <div key={`${item.time}-${race.time}`} className="flex items-start gap-3 rounded-xl bg-[#fc87a7]/5 px-3 py-2 border border-[#fc87a7]/10">
                        <span className="min-w-[72px] text-sm font-semibold text-[#fc87a7] whitespace-nowrap flex-shrink-0">{race.time}</span>
                        <span className="text-sm text-slate-700">{race.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
