import React from 'react'
import { motion } from 'framer-motion'
import Allison from '../../../assets/images/headshots/Allison.jpg'
import Geoffrey from '../../../assets/images/headshots/Geoffrey.jpg'
import Anna from '../../../assets/images/headshots/Anna.jpg'
import Eric from '../../../assets/images/headshots/Eric.jpg'
import Kelly from '../../../assets/images/headshots/Kelly.jpg'
import Kevin from '../../../assets/images/headshots/Kevin.jpg'
//import Daphne from '../../../assets/images/headshots/Daphne.jpg'
import Olivia from '../../../assets/images/headshots/Olivia.jpg'
import Andrea from '../../../assets/images/headshots/Andrea.jpg'
import Alyson from '../../../assets/images/headshots/Alyson.jpg'
import Justine from '../../../assets/images/headshots/Justine.jpg'
import Sabrina from '../../../assets/images/headshots/Sabrina.jpg'
import Anny from '../../../assets/images/headshots/Anny.jpg'
import Laetitia from '../../../assets/images/headshots/Laetitia.jpg'
import Claire from '../../../assets/images/headshots/Claire.png'
import Derek from '../../../assets/images/headshots/Derek.jpg'
import Sonny from '../../../assets/images/headshots/Sonny.jpg'
import Holly from '../../../assets/images/headshots/Holly.jpg'
import Wei from '../../../assets/images/headshots/Wei.jpg'
import Rebecca from '../../../assets/images/headshots/Rebecca.jpg'
import BK from '../../../assets/images/headshots/BK.jpg'
import Anthony from '../../../assets/images/headshots/Anthony.jpg'
import Dory from '../../../assets/images/headshots/Dory.webp'
import Lauren from '../../../assets/images/headshots/Lauren.png'


const teamMembers = [
  { name: "Allison Engo", pronouns: "she/her", role: "Co-Director", photo: Allison },
  { name: "Geoffrey Wang", pronouns: "he/him", role: "Co-Director", photo: Geoffrey },
  { name: "Anna Li", pronouns: "she/her", role: "Co-Director", photo: Anna },
  { name: "Eric Wang", pronouns: "he/him", role: "Co-Director", photo: Eric },

  { name: "Kelly Zhu", pronouns: "she/her", role: "VP Communications", photo: Kelly },
  { name: "Kevin Vong", pronouns: "he/him", role: "VP Communications", photo: Kevin },
  { name: "Daphne Fung", pronouns: "she/her", role: "VP Communications", photo: '' },
  { name: "Olivia Zhou", pronouns: "she/her", role: "VP Communications", photo: Olivia },

  { name: "Andrea Lian", pronouns: "she/her", role: "VP External", photo: Andrea },
  { name: "Alyson Jiang", pronouns: "she/her", role: "VP External", photo: Alyson },
  { name: "Justine Lin", pronouns: "she/her", role: "VP External", photo: Justine },
  { name: "Sabrina Fitz", pronouns: "she/her", role: "VP External", photo: Sabrina },
 
  { name: "Yuan Yi (Anny) Wang", pronouns: "she/her", role: "VP Logistics", photo: Anny },
  { name: "Laetitia Leung", pronouns: "she/her", role: "VP Logistics", photo: Laetitia },
  { name: "Claire Hunter", pronouns: "she/her", role: "VP Logistics", photo: Claire },
  { name: "Derek Skolnik", pronouns: "he/him", role: "VP Logistics", photo: Derek },
  { name: "Sonny Bigras-Dewan", pronouns: "he/him", role: "VP Logistics", photo: Sonny },

  { name: "Holly Markomanolaki", pronouns: "she/her", role: "VP Volunteers", photo: Holly },
  { name: "Wei Heng Gao", pronouns: "he/him", role: "VP Volunteers", photo: Wei },
  { name: "Rebecca Li", pronouns: "she/her", role: "VP Volunteers", photo: Rebecca },
  { name: "Ba-Khang Nguyen", pronouns: "he/him", role: "VP Volunteers", photo: BK },
  
  { name: "Anthony Nguyen", pronouns: "he/him", role: "VP Tech", photo: Anthony },
  { name: "Dory Song", pronouns: "he/him", role: "VP Tech", photo: Dory },

  { name: "Lauren Engo", pronouns: "she/her", role: "Secretary", photo: Lauren }
];

export default function Team() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-[#fc87a7]/10 p-6 border border-slate-100 hover:border-[#fc87a7]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#fc87a7]/50">
            <div className="relative mb-6 mx-auto w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fc87a7] to-[#fc87a7]/90 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src={member.photo} alt={member.name} className="relative w-full h-full object-cover rounded-full ring-4 ring-white shadow-lg" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-slate-500 text-sm mb-2">{member.pronouns}</p>
              <p className="text-[#fc87a7] font-medium text-sm mb-3">{member.role}</p>
              {/* <p className="text-slate-600 text-sm leading-relaxed mb-4">{member.bio}</p> */}

              {/* <div className="flex justify-center gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#fc87a7]/10 flex items-center justify-center transition-colors group/btn">
                  <Linkedin className="w-4 h-4 text-slate-500 group-hover/btn:text-[#fc87a7] transition-colors" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#fc87a7]/10 flex items-center justify-center transition-colors group/btn">
                  <Mail className="w-4 h-4 text-slate-500 group-hover/btn:text-[#fc87a7] transition-colors" />
                </button>
              </div> */}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
