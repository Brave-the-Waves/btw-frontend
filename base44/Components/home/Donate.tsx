import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Heart, Users, ExternalLink, Waves, Trophy, Shield } from 'lucide-react';

export default function Donate() {
  return (
    <section id="donate" className="py-24 md:py-32 bg-gradient-to-b from-pink-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
            Get Involved
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Make a{' '}
            <span className="text-pink-500">Difference</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you paddle, donate, or volunteer – every contribution creates waves of change
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Donate Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-pink-100/50 border border-pink-100 h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Support the Cause</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your donation directly supports women's health programs, survivor resources, 
                and community education initiatives. Every dollar makes a difference.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <Shield className="w-5 h-5 text-pink-500" />
                  <span>100% goes to women's health charities</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Trophy className="w-5 h-5 text-pink-500" />
                  <span>Tax-deductible contributions</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span>Support survivor programs</span>
                </li>
              </ul>

              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-pink-200 transition-all hover:scale-[1.02]"
                onClick={() => window.open('https://example.com/donate', '_blank')}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Register Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 shadow-xl h-full text-white">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Register Your Team</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Assemble your crew and join the race! Whether corporate teams, community groups, 
                or survivor squads – there's a division for everyone.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <Waves className="w-5 h-5 text-pink-400" />
                  <span>Multiple team divisions available</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Trophy className="w-5 h-5 text-pink-400" />
                  <span>Prizes for top fundraising teams</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span>Training sessions provided</span>
                </li>
              </ul>

              <Button 
                size="lg"
                variant="outline"
                className="w-full border-2 border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white/20 rounded-xl py-6 text-lg transition-all hover:scale-[1.02]"
                onClick={() => window.open('https://example.com/raceroster', '_blank')}
              >
                <Users className="w-5 h-5 mr-2" />
                Register on Race Roster
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 text-sm font-medium mb-8">IN PARTNERSHIP WITH</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Women's Health Foundation</div>
            <div className="text-2xl font-bold text-slate-400">Harbor Dragon Boat Club</div>
            <div className="text-2xl font-bold text-slate-400">City Health Network</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
