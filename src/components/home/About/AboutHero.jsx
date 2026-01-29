import { motion } from 'framer-motion'
import peoplePaddling from '../../../assets/images/PeoplePaddling1.jpg'

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
        <div className="aspect-[7/5] rounded-4xl overflow-hidden relative z-10">
          <img
            src={peoplePaddling}
            alt="Team paddling together"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/20 rounded-3xl z-0" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#fc87a7]/5 to-[#fc87a7]/10 rounded-2xl z-0" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-6">
          About Us
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Braving the Waves for <span className="text-[#fc87a7]">Breast Cancer</span>
        </h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          The Brave The Waves (BTW) event is an annual collaboration between the Women’s Health Awareness Movement (WHAM), a McGill Medical Student initiative and the Club sportif de bateau-dragon de l’Université de Montréal (CsBUM), a dragon boat team from the University of Montreal. This fundraiser benefits More Than a Cure (MTAC), a non-profit organization led by pediatrician Dr. Tammy Gafoor. Funds go to empowering underprivileged and underserved women battling breast cancer.
        </p>
      </motion.div>
    </div>
  )
}
