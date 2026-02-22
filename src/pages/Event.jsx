import React, { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import EventDetails from '@/components/home/EventInfo/EventDetails'
import Schedule from '@/components/home/EventInfo/Schedule'
import Activities from '@/components/home/EventInfo/Activities'
import LocationMap from '@/components/home/EventInfo/LocationMap'
import Donate from '@/components/home/Donate/index'
import { useAuth } from '../contexts/AuthContext'
import { Users, ImagePlus, Heart } from 'lucide-react'
import Button from '@/components/ui/button'

// Add new events here as they are created
const EVENT_CONFIG = {
  BraveTheWaves2026: {
    displayName: 'Brave The Waves 2026',
    tagline: "Dragon Boat Festival for Women's Health",
    description:
      "Join us for the 2026 Brave the Waves Dragon Boat Festival — a full day of racing, community, and purpose. Every paddle stroke supports MTAC's mission to advance breast cancer patient care in Montreal. Whether you're a seasoned paddler or a first-timer, all are welcome on the water.",
    bannerImage: null, // Replace with imported image path when available
    galleryImages: [],  // Replace with imported image paths when available
  },
}

export default function Event() {
  const { eventName } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Handle scroll-to after navigating from sidebar on a sub-page
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState({}, document.title)
      }, 100)
    }
  }, [location.state])

  const config = EVENT_CONFIG[eventName] ?? {
    displayName: eventName,
    tagline: '',
    description: '',
    bannerImage: null,
    galleryImages: [],
  }

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="pt-24 bg-gradient-to-b from-[#fcf2f5] to-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-6">
              Dragon Boat Festival
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              {config.displayName}
            </h1>
            {config.tagline && (
              <p className="text-xl text-[#fc87a7] font-medium mb-6">{config.tagline}</p>
            )}
            {config.description && (
              <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                {config.description}
              </p>
            )}

            {/* ── Hero CTA buttons ── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-xl px-8 py-4 text-lg shadow-lg shadow-[#fc87a7]/30 transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/register')
                  } else {
                    navigate('/login', { state: { from: '/register' } })
                  }
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'Register Now' : 'Sign Up & Register'}
              </Button>
              <Button
                size="lg"
                className="border-2 border-[#fc87a7] bg-white text-[#fc87a7] hover:bg-[#fc87a7]/5 rounded-xl px-8 py-4 text-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
            </div>
          </motion.div>

          {/* Banner image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-slate-200"
          >
            {config.bannerImage ? (
              <img
                src={config.bannerImage}
                alt={config.displayName}
                className="w-full h-80 md:h-[480px] object-cover"
              />
            ) : (
              <div className="w-full h-80 md:h-[480px] bg-gradient-to-br from-[#fc87a7]/20 to-[#fc87a7]/5 flex flex-col items-center justify-center border-2 border-dashed border-[#fc87a7]/30">
                <ImagePlus className="w-12 h-12 text-[#fc87a7]/40 mb-3" />
                <p className="text-slate-400 text-sm">Event banner image coming soon</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Event Details (date / time / location cards) ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <EventDetails />
        </div>
      </section>

      {/* ── Schedule & Activities ── */}
      <section className="py-16 bg-gradient-to-b from-white to-[#fc87a7]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <Schedule />
            <Activities />
          </div>
        </div>
      </section>

           {/* ── Registration CTA ── */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Race?</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Secure your spot for {config.displayName}. Every registration supports MTAC's mission for women's breast cancer care.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="border-2 border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white/20 rounded-xl px-10 py-4 text-lg transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/register')
                  } else {
                    navigate('/login', { state: { from: '/register' } })
                  }
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'Register for the Event' : 'Create an Account & Register'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Event <span className="text-[#fc87a7]">Gallery</span>
            </h2>
            <p className="text-slate-500">A glimpse of what awaits you on race day</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {config.galleryImages.length > 0
              ? config.galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden aspect-square shadow-sm"
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[#fc87a7]/20"
                  >
                    <ImagePlus className="w-8 h-8 text-[#fc87a7]/30 mb-2" />
                    <p className="text-xs text-slate-400">Photo coming soon</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Donate ── */}
      <Donate />

      {/* ── Map ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <LocationMap />
        </div>
      </section>
    </div>
  )
}
