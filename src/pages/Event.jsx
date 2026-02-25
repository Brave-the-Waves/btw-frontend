import React, { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import EventDetails from '@/components/home/EventInfo/EventDetails'
import Schedule from '@/components/home/EventInfo/Schedule'
import Activities from '@/components/home/EventInfo/Activities'
import LocationMap from '@/components/home/EventInfo/LocationMap'
import Donate from '@/components/home/Donate/index'
import { useAuth } from '../contexts/AuthContext'
import { Users, ImagePlus, Heart, CheckCircle2, Building2, Sailboat, Info, Mail } from 'lucide-react'
import Button from '@/components/ui/button'

// Add new events here as they are created
const EVENT_CONFIG = {
  BraveTheWaves2026: {
    displayName: 'Brave The Waves 2026',
    tagline: "Dragon Boat Festival for Women's Health",
    description:
      "Join us for the 2026 Brave the Waves Dragon Boat Festival — a full day of racing, community, and purpose. Every paddle stroke supports MTAC's mission to advance breast cancer patient care in Montreal. Whether you're a seasoned paddler or a first-timer, all are welcome on the water.",
    bannerImage: 'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FCZLF0955.png?alt=media&token=042ba090-14a3-494b-8ead-c4370ff8df57',
    galleryImages: [
      'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FDSC_3910.jpg?alt=media&token=2381628c-5f20-4a9f-a448-64ef11264589',
      'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FDSC_3946.jpg?alt=media&token=afc0789e-b672-4bfc-962b-7f2eb16f6a3e',
      'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FDSC_4125.jpg?alt=media&token=fdca2f69-5578-48cc-9a7d-fd765650d702',
      'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FDSC_4249%20(1).jpg?alt=media&token=3d3b9b96-b975-44e6-8449-7c593fecbc10',
      'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FIMG_1426.jpg?alt=media&token=bd8e6ff0-da5a-4887-b792-5ac7f24ceb34',
      'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/image_gallery%2FIMG_2000.jpg?alt=media&token=c6b6c4ce-e219-478e-ba14-5061f3e01125',
    ], 
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
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
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

      {/* ── General Information ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-4">General Information</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Register for the <span className="text-[#fc87a7]">Event</span>
            </h2>
          </motion.div>

          {/* What's included */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-600 leading-relaxed mb-6">
                By creating an account and registering for the 2026 Brave the Waves competition, you're not only securing your place on the water — you're also directly supporting the fight against breast cancer.
              </p>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Your registration includes:</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Official race entry for the full day of dragon boat races',
                  'Boat, paddles, and a trained drummer/steer person — no experience required',
                  'Access to all on-site activities and entertainment throughout the event',
                  'Refreshments to keep you fueled on race day',
                  'Direct donation to MTAC, helping support breast cancer patient care',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#fc87a7] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 text-sm leading-relaxed italic">
                Whether you're racing to win or paddling for the cause, every registration makes a meaningful impact. Gather your crew, paddle with purpose, and help us turn teamwork into hope.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#fc87a7]/5 border border-[#fc87a7]/20 rounded-2xl p-6"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#fc87a7] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-2">Account & Registration Note</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Creating a Brave The Waves account allows you to track your donations throughout the years. In order to register for our yearly competition, you must pay the competition fee.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Subdivision cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Registration Categories</p>
            <p className="text-slate-500 text-sm">Choose the division that best fits your group</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Sailboat className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Community</p>
                <h3 className="text-lg font-bold text-slate-900">Community Teams</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Open to everyone in the community. Groups are limited to a maximum of 10 members — teams of 20 to 30 paddlers will be formed by the Executive Rostering Committee to ensure balanced and fair competition.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-emerald-700">🎓 Students pay a discounted price!</p>
              </div>
            </motion.div>

            {/* Corporate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Corporate</p>
                <h3 className="text-lg font-bold text-slate-900">Corporate Teams</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Bring your company together for a memorable team-building experience on the water. Full boat allocation is included for your organization.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 space-y-1">
                <p className="text-sm font-semibold text-blue-800">$600 registration fee</p>
                <p className="text-sm text-blue-700">+ $1,900 mandatory donation <span className="font-medium">(tax receipt provided)</span></p>
                <p className="text-xs text-blue-600 mt-1">Includes a full boat of 20–30 paddlers</p>
              </div>
            </motion.div>

            {/* Student */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Sports</p>
                <h3 className="text-lg font-bold text-slate-900">Sports Division</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                A competitive inter-school division for Montreal's top university and college teams.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 space-y-2">
                <p className="text-sm font-semibold text-purple-800">Selected schools</p>
                <p className="text-xs text-purple-700 leading-relaxed">
                  Members from <strong>Marianopolis, McGill, Université de Montréal,</strong> and <strong>Concordia</strong> — captains should contact you if you have been selected with a registration code.
                </p>
                <div className="flex items-start gap-2 pt-1">
                  <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-600">
                    Other schools wanting to compete at this level are welcome to send an inquiry to participate.
                  </p>
                </div>
              </div>
            </motion.div>
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
