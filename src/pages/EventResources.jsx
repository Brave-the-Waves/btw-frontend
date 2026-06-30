import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, PlayCircle, Waves, CalendarDays, Users } from 'lucide-react'
import Schedule from '@/components/home/EventInfo/Schedule'

const HOW_TO_PADDLE_VIDEO = 'https://youtube.com/embed/tn4EiHVxUrI'
const RAIN_AND_SAFETY_MANUAL = 'https://storage.googleapis.com/brave-the-waves-backend.firebasestorage.app/resources/Rain%20and%20Safety%20Manual%20(for%20Tech)%20Bilingual.pdf'
const RACE_ROSTER_PDF = 'https://storage.googleapis.com/brave-the-waves-backend.firebasestorage.app/resources/Official%20Brave%20The%20Waves%202026%20Schedule%2C%20Lineups%20and%20Boats%20-%20Schedule.pdf'

const tabs = [
  {
    id: 'schedule',
    label: 'Schedule',
    icon: CalendarDays,
  },
  {
    id: 'roster',
    label: 'Roster',
    icon: Users,
  },
  {
    id: 'paddle',
    label: 'How to Paddle',
    icon: PlayCircle,
  },
  {
    id: 'manual',
    label: 'Safety Manual',
    icon: FileText,
  },
]

export default function EventResources() {
  const [activeTab, setActiveTab] = useState('schedule')

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-36 pb-6 bg-gradient-to-b from-[#fcf2f5] to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-5">
              <Waves className="w-4 h-4" />
              Race Day Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5">
              Everything You Need for <span className="text-[#fc87a7]">Race Day</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get familiar with the schedule, watch the paddle video, and read up on safety before you arrive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-6">

          {/* Tab Bar */}
          <div className="flex gap-2 bg-white border border-slate-200 shadow-sm p-1.5 rounded-2xl mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#fc87a7] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Schedule />
              </motion.div>
            )}

            {activeTab === 'roster' && (
              <motion.div
                key="roster"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#fc87a7]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Race Roster</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      The full race-by-race schedule, lineups, and lane assignments.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg shadow-slate-200/50">
                  <iframe
                    src={RACE_ROSTER_PDF}
                    title="Race Roster"
                    className="w-full h-[900px]"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'paddle' && (
              <motion.div
                key="paddle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="w-6 h-6 text-[#fc87a7]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">How to Paddle</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Get comfortable with stroke timing, boat rhythm, and on-water basics before the event.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200">
                  <iframe
                    src={HOW_TO_PADDLE_VIDEO}
                    title="How to Paddle"
                    className="w-full max-w-xs mx-auto aspect-[9/16] block rounded-2xl"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'manual' && (
              <motion.div
                key="manual"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#fc87a7]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Rain and Safety Manual</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Review the Rain and Safety manual for weather guidance, safety expectations, and race-day procedures.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg shadow-slate-200/50">
                  <iframe
                    src={RAIN_AND_SAFETY_MANUAL}
                    title="Rain and Safety Manual"
                    className="w-full h-[900px]"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </div>
  )
}