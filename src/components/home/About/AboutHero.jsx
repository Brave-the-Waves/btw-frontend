import { motion } from 'framer-motion'

export default function AboutHero() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="aspect-[4/5] rounded-4xl overflow-hidden relative z-10">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
            alt="Team paddling together"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl z-0" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl z-0" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
          About Us
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Paddling with Purpose, <span className="text-pink-500">Racing for Hope</span>
        </h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          Brave the Waves brings together passionate paddlers, survivors, and supporters in an annual celebration of strength and solidarity. Our partnership with women's health organizations creates meaningful impact in our community.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          What started as a small gathering of dragon boat enthusiasts has grown into the region's most anticipated charity event. Every stroke of the paddle represents hope, every race a step toward better healthcare access for all women.
        </p>
      </motion.div>
    </div>
  )
}
