import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Trophy, Music, Utensils, Award, MapPin, Calendar, Users, Sparkles } from 'lucide-react'
import Card from '../ui/card'

const schedule = [
  { time: '7:00 AM', event: 'Registration & Check-in', icon: Users, description: 'Team registration and welcome packets' },
  { time: '8:00 AM', event: 'Opening Ceremony', icon: Award, description: 'Welcome address and warm-up session' },
  { time: '9:00 AM', event: 'Heat Races Begin', icon: Trophy, description: 'Preliminary races across all divisions' },
  { time: '12:00 PM', event: 'Lunch & Entertainment', icon: Utensils, description: 'Food vendors and live performances' },
  { time: '2:00 PM', event: 'Semi-Finals', icon: Trophy, description: 'Top teams compete for finals spots' },
  { time: '4:00 PM', event: 'Championship Finals', icon: Trophy, description: 'Final races and spectator favorites' },
  { time: '5:30 PM', event: 'Awards Ceremony', icon: Award, description: 'Recognition and celebration' },
  { time: '6:30 PM', event: 'Closing Celebration', icon: Music, description: 'Live music and community gathering' },
]

const activities = [
  { title: 'Dragon Boat Races', description: 'Multiple divisions including corporate, community, and breast cancer survivor teams', icon: Trophy },
  { title: 'Live Entertainment', description: 'Local bands, cultural performances, and DJ sets throughout the day', icon: Music },
  { title: 'Food Festival', description: 'Diverse food vendors offering cuisines from around the world', icon: Utensils },
  { title: 'Health Fair', description: 'Free screenings, wellness information, and health resources', icon: Award },
]

export default function EventInfo() {
  return (
    <section id="event" className="py-24 md:py-32 bg-gradient-to-b from-white to-pink-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">Event Details</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Race Day <span className="text-pink-500">Experience</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">A full day of racing, entertainment, and community celebration</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid sm:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 bg-white border-0 shadow-lg shadow-slate-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-semibold text-slate-900">June 15, 2025</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-lg shadow-slate-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Time</p>
                <p className="font-semibold text-slate-900">7:00 AM - 7:00 PM</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-lg shadow-slate-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-semibold text-slate-900">Harbor Marina Park</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3"><Clock className="w-6 h-6 text-pink-500" />Race Day Schedule</h3>
            <div className="space-y-1">
              {schedule.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    {index < schedule.length - 1 && <div className="w-0.5 h-full bg-gradient-to-b from-pink-300 to-pink-100 my-1" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-semibold text-pink-600">{item.time}</p>
                    <p className="font-bold text-slate-900">{item.event}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3"><Sparkles className="w-6 h-6 text-pink-500" />Activities & Highlights</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-6 h-6 text-pink-600" />
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
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
          <div className="bg-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Harbor Marina Park, Waterfront Boulevard</span>
            </div>
          </div>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977759013745!2d-122.39568388468185!3d37.78779997975772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807abad77c31%3A0x3f10d205e9ab87f2!2sSan%20Francisco%20Marina!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus" width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Event Location Map" />
        </motion.div>
      </div>
    </section>
  )
}
