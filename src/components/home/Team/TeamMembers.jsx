import React from 'react'
import { motion } from 'framer-motion'

const teamMembers = [
  { name: "Allison Engo", pronouns: "she/her", role: "Co-Director", photo: "https://drive.google.com/uc?export=view&id=1s-ZEVdsDo3D3EqtlmkfqBBl9FADYeB2Q" },
  { name: "Geoffrey Wang", pronouns: "he/him", role: "Co-Director", photo: "https://drive.google.com/uc?export=view&id=1YVkOPDqen95lIKqnAkXzYxk1YHVcLeEs" },
  { name: "Anna Li", pronouns: "she/her", role: "Co-Director", photo: "https://drive.google.com/uc?export=view&id=1sdRDMzdRmF8WYaooCQrSemfSh7iWe49i" },
  { name: "Eric Wang", pronouns: "he/him", role: "Co-Director", photo: "https://drive.google.com/uc?export=view&id=1BDwLeANBi69t8xcL6GOQSLv3DuDGA3bg" },

  { name: "Zhu Kelly", pronouns: "she/her", role: "VP Communications", photo: "https://drive.google.com/uc?export=view&id=1az9cMV11-h0odxTCAS94bouNhBCGb51B" },
  { name: "Kevin Vong", pronouns: "he/him", role: "VP Communications", photo: "https://drive.google.com/uc?export=view&id=1_GhUNWicYp54K_E1x0aHYUhcCx8Ubo4P" },
  { name: "Daphne Fung", pronouns: "she/her", role: "VP Communications", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
  { name: "Zhou, Olivia", pronouns: "she/her", role: "VP Communications", photo: "https://drive.google.com/uc?export=view&id=1YJ7PM4oX4f3VIMcyohAtB3_eJsvyy-Hi" },

  { name: "Andrea Lian", pronouns: "she/her", role: "VP External", photo: "https://drive.google.com/uc?export=view&id=136u59krbodBe-xYxpmOUBQXiC5Ca8sk2" },
  { name: "Alyson Jiang", pronouns: "she/her", role: "VP External", photo: "https://drive.google.com/uc?export=view&id=1FDWIk81i5accx9res77Z67tOzNkAEZHk" },
  { name: "Justine Lin", pronouns: "she/her", role: "VP External", photo: "https://drive.google.com/uc?export=view&id=1cLkH9TrM-n9KFxCvdOSiG2pHKvuh8bAx" },
  { name: "Sabrina Fitz", pronouns: "she/her", role: "VP External", photo: "https://drive.google.com/uc?export=view&id=1d4E-iHIQazgv_nyaWAWMp2u9f196pvy4" },

  { name: "Yuan Yi (Anny) Wang", pronouns: "she/her", role: "VP Logistics", photo: "https://drive.google.com/uc?export=view&id=1GunP6qJueupByogENgP60n8vqIYqBmfs" },
  { name: "Laetitia Leung", pronouns: "she/her", role: "VP Logistics", photo: "https://drive.google.com/uc?export=view&id=11nISIvDigrn7W0ePakYecEKyJt12VRDm" },
  { name: "Claire Hunter", pronouns: "she/her", role: "VP Logistics", photo: "https://drive.google.com/uc?export=view&id=1TICWgcjHLqH8xD9CiHLA33q0EoDFNcAn" },
  { name: "Derek Skolnik", pronouns: "he/him", role: "VP Logistics", photo: "https://drive.google.com/uc?export=view&id=1u184ZVJ2d3B9HXcWS2ijyCNgxi0ryXLV" },
  { name: "Sonny Bigras-Dewan", pronouns: "he/him", role: "VP Logistics", photo: "https://drive.google.com/uc?export=view&id=1xcQV-lVU7RwVt_P-rld16bJ7n2nYJuR4" },

  { name: "Holly Markomanolaki", pronouns: "she/her", role: "VP Volunteers", photo: "https://drive.google.com/uc?export=view&id=167UllScMkYrWghym_aPwv8v5UFHRY8sQ" },
  { name: "Wei Heng Gao", pronouns: "he/him", role: "VP Volunteers", photo: "https://drive.google.com/uc?export=view&id=1sQuYLYMsP270RGXkX19xv7Q42tjVld2B" },
  { name: "Rebecca Li", pronouns: "she/her", role: "VP Volunteers", photo: "https://drive.google.com/uc?export=view&id=1nkS-504oAs_J-1HhNafyY33P6xXnqKO9" },
  { name: "Ba-Khang Nguyen", pronouns: "he/him", role: "VP Volunteers", photo: "https://drive.google.com/uc?export=view&id=1VDecCHTMzic5HMqw2QQ98mEui5kiS_WV" },

  { name: "Anthony Nguyen", pronouns: "he/him", role: "VP Tech", photo: "https://drive.google.com/uc?export=view&id=1CO8QvnvkAOJyeNpW0I1TIlUVkDlUf9Db" },
  { name: "Dory Song", pronouns: "he/him", role: "VP Tech", photo: "https://drive.google.com/uc?export=view&id=1fLiYE1CgwpSjM7YNk42jCatljVhjPrC2" },

  { name: "Lauren Engo", pronouns: "she/her", role: "Secretary", photo: "https://drive.google.com/uc?export=view&id=1yJk6UE6NYqJV__bBadbYTJKgKlgdtvQW" }
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
