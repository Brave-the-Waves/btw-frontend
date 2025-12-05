import { motion } from 'framer-motion'

export default function Partnerships() {
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center">
          <p className="text-slate-500 text-sm font-medium mb-8">IN PARTNERSHIP WITH</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Women's Health Foundation</div>
            <div className="text-2xl font-bold text-slate-400">Harbor Dragon Boat Club</div>
            <div className="text-2xl font-bold text-slate-400">City Health Network</div>
          </div>
        </motion.div>
    )
}