import React, { useRef, useEffect } from 'react'
import Button from '../ui/button'
import { ChevronDown, Heart, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const HERO_VIDEO_DESKTOP = 'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/videos%2Fbtw%20banner%208.mp4?alt=media&token=3d76b115-7a03-4c40-8fdf-5961a1f831c1'
const HERO_VIDEO_MOBILE = 'https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/videos%2Fbtw%20banner%208%20(mobile)%20(1).mp4?alt=media&token=b57a1051-8162-44a7-b205-422e37980310'
export default function Hero() {
  const videoRef = useRef(null)
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Force restart on end as a fallback for browsers that ignore the loop attribute
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleEnded = () => {
      video.currentTime = 0
      video.play()
    }
    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <section id="home" className="relative overflow-hidden bg-[#fcf2f5] h-[60vh] min-h-[320px] sm:h-[75vh] md:h-screen">
      {/* 
        Responsive video behaviour:
        - Large screens (≥1280px): container is 100vw × 100vh, video covers and scales up to fill
        - Medium screens (768–1279px): same full viewport, video crops via object-cover
        - Small screens (<768px): container shrinks to 75vh min, video crops from center
        - Tiny screens (<480px): container drops to 60vh so the video actually shrinks
      */}
      <div className="absolute inset-0">
        {/* Mobile video — shown below md breakpoint only */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover block md:hidden"
        >
          <source src={HERO_VIDEO_MOBILE} type="video/mp4" />
        </video>
        {/* Desktop video — shown at md and above only */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover hidden md:block"
        >
          <source src={HERO_VIDEO_DESKTOP} type="video/mp4" />
        </video>
        {/* Optional dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <motion.button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white hover:text-[#fc87a7] transition-colors z-20 drop-shadow-lg"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to about"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  )
}
