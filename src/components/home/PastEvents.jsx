import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, DollarSign, Heart, Calendar } from 'lucide-react'
import Button from '../ui/button'

const pastEvents = [
  { year: '2024', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80', teams: 48, raised: 125000, participants: 960, highlight: 'Record-breaking attendance with 48 teams competing' },
  { year: '2023', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', teams: 42, raised: 98000, participants: 840, highlight: 'First year with dedicated survivor team division' },
  { year: '2022', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', teams: 35, raised: 75000, participants: 700, highlight: 'Expanded to include corporate challenge cup' },
  { year: '2021', image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80', teams: 28, raised: 52000, participants: 560, highlight: 'Post-pandemic comeback celebration' },
]

const milestones = [
  { icon: DollarSign, value: '$450K+', label: 'Total Raised' },
  { icon: Users, value: '3,000+', label: 'Participants' },
  { icon: Heart, value: '150+', label: 'Teams' },
  { icon: Calendar, value: '5', label: 'Years Running' },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80',
  'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=400&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
]

export default function PastEvents() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % pastEvents.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + pastEvents.length) % pastEvents.length)

  return (
    <section id="past-events" className="py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-6">Our Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Past <span className="text-pink-400">Events</span></h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Celebrating years of community, courage, and collective impact</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {milestones.map((milestone, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-pink-500/50 transition-colors">
              <milestone.icon className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{milestone.value}</p>
              <p className="text-slate-400 text-sm">{milestone.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative mb-20">
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="relative">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto">
                    <img src={pastEvents[currentIndex].image} alt={`Event ${pastEvents[currentIndex].year}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-br from-pink-600 to-pink-700 p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-6xl md:text-8xl font-bold text-white/20 absolute top-4 right-4 md:top-8 md:right-8">{pastEvents[currentIndex].year}</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{pastEvents[currentIndex].year} Event</h3>
                    <p className="text-pink-100 mb-8 text-lg">{pastEvents[currentIndex].highlight}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-3xl font-bold text-white">{pastEvents[currentIndex].teams}</p>
                        <p className="text-pink-200 text-sm">Teams</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">${(pastEvents[currentIndex].raised / 1000).toFixed(0)}K</p>
                        <p className="text-pink-200 text-sm">Raised</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{pastEvents[currentIndex].participants}</p>
                        <p className="text-pink-200 text-sm">Participants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2 items-center">
              {pastEvents.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-pink-500 w-8' : 'bg-slate-600'}`} />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-bold text-center mb-8">Event Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="aspect-square rounded-2xl overflow-hidden group">
                  <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
