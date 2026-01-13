import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Trophy, Users, Waves } from 'lucide-react'
import Button from '@/components/ui/button'

export default function DonateCards() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group">
        <div className="absolute inset-0 bg-[#fc87a7] rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#fc87a7]/50 border border-[#fc87a7]/10 h-full flex flex-col">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fc87a7] to-[#fc87a7]/90 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Support the Cause</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">Your donation directly supports women's health programs, survivor resources, and community education initiatives. Every dollar makes a difference.</p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-slate-600"><Shield className="w-5 h-5 text-[#fc87a7]" /><span>100% goes to women's health charities</span></li>
            <li className="flex items-center gap-3 text-slate-600"><Trophy className="w-5 h-5 text-[#fc87a7]" /><span>Tax-deductible contributions</span></li>
            <li className="flex items-center gap-3 text-slate-600"><Heart className="w-5 h-5 text-[#fc87a7]" /><span>Support survivor programs</span></li>
          </ul>

          <Button size="lg" className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-xl py-3 text-lg shadow-lg shadow-[#fc87a7]/20 transition-all hover:scale-[1.02] text-center mt-auto" onClick={() => window.open('https://example.com/donate', '_blank')}>
            <Heart className="w-5 h-5 mr-2" />
            Donate Now
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 shadow-xl h-full text-white flex flex-col">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Register Your Team</h3>
          <p className="text-slate-300 mb-6 leading-relaxed">Assemble your crew and join the race! Whether corporate teams, community groups, or survivor squads – there's a division for everyone.</p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-slate-300"><Waves className="w-5 h-5 text-[#fc87a7]" /><span>Multiple team divisions available</span></li>
            <li className="flex items-center gap-3 text-slate-300"><Trophy className="w-5 h-5 text-[#fc87a7]" /><span>Prizes for top fundraising teams</span></li>
            <li className="flex items-center gap-3 text-slate-300"><Users className="w-5 h-5 text-[#fc87a7]" /><span>Training sessions provided</span></li>
          </ul>

          <Button size="lg" variant="outline" className="w-full border-2 border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white/20 rounded-xl py-3 text-lg transition-all hover:scale-[1.02] mt-auto" onClick={() => window.open('https://example.com/raceroster', '_blank')}>
            <Users className="w-5 h-5 mr-2" />
            Register on Race Roster
          </Button>
        </div>
      </motion.div>
    </div>
  )
}