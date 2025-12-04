import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, DollarSign, Heart, Calendar } from 'lucide-react'
import Button from '../../ui/button'

const pastEvents = [
  { year: '2024', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80', teams: 48, raised: 125000, participants: 960, highlight: 'Record-breaking attendance with 48 teams competing' },
  { year: '2023', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', teams: 42, raised: 98000, participants: 840, highlight: 'First year with dedicated survivor team division' },
  { year: '2022', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', teams: 35, raised: 75000, participants: 700, highlight: 'Expanded to include corporate challenge cup' },
  { year: '2021', image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80', teams: 28, raised: 52000, participants: 560, highlight: 'Post-pandemic comeback celebration' },
]


export default function PastEventsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % pastEvents.length)
  }
  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + pastEvents.length) % pastEvents.length)
  }
  
  return (
    <>
      <div className="relative mb-20">
        <div className="overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, x: direction === 1 ? 100 : -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction === 1 ? -100 : 100 }} transition={{ duration: 0.2 }} className="relative">
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
              <button 
                key={index} 
                onClick={() => { 
                  setCurrentIndex(index); 
                  setDirection(index > currentIndex ? 1 : -1); 
                }} 
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-pink-500 w-8' : 'bg-slate-600'}`} 
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  )
}