import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, DollarSign, Heart, Calendar } from 'lucide-react'
import Button from '../../ui/button'
import prizeImage from '../../../assets/images/2025/Prize.jpg'

const pastEvents = [
  { year: '2025', image: prizeImage, teams: 29, raised: 18529, participants: 350, highlight: 'Our first-ever fundraiser event marked the beginning of our initiative.' },
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
                <div className="bg-gradient-to-br from-[#fc87a7] to-[#fc87a7]/90 p-8 md:p-12 flex flex-col justify-center">
                  <span className="hidden lg:block text-6xl md:text-8xl font-bold text-white/20 absolute top-4 right-4 md:top-8 md:right-8">{pastEvents[currentIndex].year}</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{pastEvents[currentIndex].year} Event</h3>
                  <p className="text-[#fc87a7]/10 mb-8 text-lg">{pastEvents[currentIndex].highlight}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{pastEvents[currentIndex].teams}</p>
                      <p className="text-white text-sm">Teams</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">${(pastEvents[currentIndex].raised / 1000).toFixed(0)}K</p>
                      <p className="text-white text-sm">Raised</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{pastEvents[currentIndex].participants}</p>
                      <p className="text-white text-sm">Participants</p>
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
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentIndex ? 'bg-[#fc87a7] w-8' : 'bg-slate-600'}`} 
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