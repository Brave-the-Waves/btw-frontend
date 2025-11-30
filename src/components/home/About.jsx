import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Target, Sparkles } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Mission', description: "To unite communities through the spirit of dragon boat racing while raising vital funds and awareness for women's health initiatives." },
  { icon: Target, title: 'Vision', description: "A world where every woman has access to healthcare resources and support, championed by a community that paddles together for change." },
  { icon: Sparkles, title: 'Values', description: 'Courage, unity, compassion, and empowerment. We believe in the strength of community and the power of collective action.' },
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Team paddling together" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl -z-10" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Paddling with Purpose, <span className="text-pink-500">Racing for Hope</span></h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">Brave the Waves brings together passionate paddlers, survivors, and supporters in an annual celebration of strength and solidarity. Our partnership with women's health organizations creates meaningful impact in our community.</p>
            <p className="text-lg text-slate-600 leading-relaxed">What started as a small gathering of dragon boat enthusiasts has grown into the region's most anticipated charity event. Every stroke of the paddle represents hope, every race a step toward better healthcare access for all women.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group">
              <div className="bg-gradient-to-br from-slate-50 to-pink-50/50 rounded-3xl p-8 h-full border border-slate-100 hover:border-pink-200 transition-all duration-300 hover:shadow-xl hover:shadow-pink-100/50">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
