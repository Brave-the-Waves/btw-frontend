import { motion } from 'framer-motion'
import PastEventsMilestones from './Milestones'
import PastEventsCarousel from './Carousel'
import PastEventsGallery from './Gallery'

export default function PastEvents() {
  
  return (
    <section id="past-events" className="py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/20 text-[#fc87a7] text-sm font-medium mb-6">Our Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Past <span className="text-[#fc87a7]">Events</span></h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Celebrating years of community, courage, and collective impact</p>
        </motion.div>

        <PastEventsMilestones />
        <PastEventsCarousel />
        <PastEventsGallery />

        </div>
    </section>
  )
}