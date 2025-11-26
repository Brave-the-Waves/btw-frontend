import React from 'react';
import Navbar from '@/base44/Components/Navbar';
import Hero from '@/base44/Components/home/Hero';
import About from '@/base44/Components/home/About';
import EventInfo from '@/base44/Components/home/EventInfo';
import PastEvents from '@/base44/Components/home/PastEvents';
import Team from '@/base44/Components/home/Team';
import Donate from '@/base44/Components/home/Donate';
import Contact from '@/base44/Components/home/Contact';
import Footer from '@/base44/Components/home/Footer';

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
  );
}
