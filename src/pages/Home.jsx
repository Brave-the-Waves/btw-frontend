import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Hero from '@/components/home/Hero'
import About from '@/components/home/About/index'
import EventInfo from '@/components/home/EventInfo/index'
import PastEvents from '@/components/home/PastEvents/index'
import Team from '@/components/home/Team/index'
import Donate from '@/components/home/Donate/index'
import Contact from '@/components/home/Contact/index'
import Footer from '@/components/home/Footer'

export default function Home() {
  const [searchParams] = useSearchParams()
  const donationId = searchParams.get('donationId')
  const userName = searchParams.get('name')

  useEffect(() => {
    // Scroll to donate section if donationId is present
    if (donationId) {
      setTimeout(() => {
        const donateSection = document.getElementById('donate')
        if (donateSection) {
          donateSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [donationId])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />  
      <Hero />
      <About />
      <EventInfo />
      <PastEvents />
      <Team />
      <Donate preFillDonationId={donationId} preFillName={userName} />
      <Contact />
      <Footer />
    </div>
  )
}
