import React from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/home/Hero'
import About from '@/components/home/About/index'
import EventInfo from '@/components/home/EventInfo/index'
import PastEvents from '@/components/home/PastEvents/index'
import Team from '@/components/home/Team'
import Donate from '@/components/home/Donate/index'
import Contact from '@/components/home/Contact/index'
import Footer from '@/components/home/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />  
      <Hero />
      <About />
      <EventInfo />
      <PastEvents />
      <Team />
      <Donate />
      <Contact />
      <Footer />
    </div>
  )
}
