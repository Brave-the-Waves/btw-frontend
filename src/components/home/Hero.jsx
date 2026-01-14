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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-visible">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundColor: '#fcf2f5' }}>
        <div className="absolute inset-0" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        <motion.img
          src={bannerLogo}
          alt="Wham x CSBUM banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginLeft: '-15px' }}
          className="mx-auto pt-6 w-full max-w-4xl md:max-w-5xl h-auto object-contain"
        />
      </div>

      <motion.button onClick={() => scrollToSection('about')} className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[#fc87a7] hover:text-[#c14a75] transition-colors z-20" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} aria-label="Scroll to about">
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  )
}
