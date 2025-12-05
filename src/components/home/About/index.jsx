import React from 'react'
import { Heart, Target, Sparkles } from 'lucide-react'
import AboutHero from './AboutHero'
import ValueCard from './ValueCard'

const values = [
  {
    icon: Heart,
    title: 'Mission',
    description: "To unite communities through the spirit of dragon boat racing while raising vital funds and awareness for women's health initiatives."
  },
  {
    icon: Target,
    title: 'Vision',
    description: "A world where every woman has access to healthcare resources and support, championed by a community that paddles together for change."
  },
  {
    icon: Sparkles,
    title: 'Values',
    description: 'Courage, unity, compassion, and empowerment. We believe in the strength of community and the power of collective action.'
  }
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AboutHero />

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <ValueCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
