import React from 'react'
import Button from '../ui/button'
import { ChevronDown, Heart, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import bannerLogo from '../../assets/images/bannerWHAMxCsBUM.jpg'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundColor: '#fcf2f5' }}>
        <div className="absolute inset-0" />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        <motion.img
          src={bannerLogo}
          alt="Wham x CSBUM banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto pt-6 w-full max-w-4xl md:max-w-5xl h-auto object-contain"
        />
      </div>

      <motion.button onClick={() => scrollToSection('about')} className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  )
}
