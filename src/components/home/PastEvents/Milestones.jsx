import { motion } from 'framer-motion'
import { DollarSign, Users, Heart, Calendar } from 'lucide-react'
import CountUpNumber from '../../animations/CountUpNumbers'

const milestones = [
  { icon: DollarSign, value: 450, label: 'Total Raised', prefix: '$', suffix: 'K+' },
  { icon: Users, value: 3000, label: 'Participants', prefix: '', suffix: '+' },
  { icon: Heart, value: 150, label: 'Teams', prefix: '', suffix: '+' },
  { icon: Calendar, value: 5, label: 'Years Running', prefix: '', suffix: '' },
]

export default function PastEventsMilestones() {
  return (
    <>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {milestones.map((milestone, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-pink-500/50 transition-colors">
                <milestone.icon className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {milestone.prefix}
                <CountUpNumber end={milestone.value} suffix={milestone.suffix} />  
                </p>
                <p className="text-slate-400 text-sm">{milestone.label}</p>
            </motion.div>
            ))}
        </motion.div>
    </>
  )
}