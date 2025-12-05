import React from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Mail } from 'lucide-react'

const teamMembers = [
  { name: 'Sarah Chen', role: 'Event Director', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', bio: '10+ years organizing community events. Breast cancer survivor and dragon boat enthusiast.' },
  { name: 'Michael Torres', role: 'Dragon Boat Club Liaison', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', bio: 'Head coach at Harbor Dragon Boat Club. Certified IDBF coach with international racing experience.' },
  { name: 'Dr. Amanda Williams', role: 'Health Partnership Lead', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', bio: "Women's health advocate and practicing oncologist. Connects medical resources with community." },
  { name: 'Jessica Park', role: 'Marketing & Outreach', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', bio: "Digital marketing strategist passionate about amplifying voices in women's health advocacy." },
  { name: 'David Nakamura', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Logistics expert ensuring seamless race day operations. Former event coordinator for city marathons.' },
  { name: 'Lisa Rodriguez', role: 'Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', bio: 'Community organizer who mobilizes 200+ volunteers annually. Builds bridges between teams and causes.' },
]

export default function Team() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-pink-50/50 p-6 border border-slate-100 hover:border-pink-200 transition-all duration-500 hover:shadow-xl hover:shadow-pink-100/50">
            <div className="relative mb-6 mx-auto w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src={member.image} alt={member.name} className="relative w-full h-full object-cover rounded-full ring-4 ring-white shadow-lg" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-pink-600 font-medium text-sm mb-3">{member.role}</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{member.bio}</p>

              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-100 flex items-center justify-center transition-colors group/btn">
                  <Linkedin className="w-4 h-4 text-slate-500 group-hover/btn:text-pink-600 transition-colors" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-100 flex items-center justify-center transition-colors group/btn">
                  <Mail className="w-4 h-4 text-slate-500 group-hover/btn:text-pink-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
