import React from 'react'
import { motion } from 'framer-motion'

// Paste your Firebase URLs below
const teamMembers = [
  { name: "Allison Engo", pronouns: "she/her", role: "Co-Director", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FAllison.jpg?alt=media&token=1ed4dc83-8ae8-4135-a5a8-7b7fb1d2220c" },
  { name: "Geoffrey Wang", pronouns: "he/him", role: "Co-Director", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FGeoffrey.jpg?alt=media&token=7de232e1-dd92-4cd1-97d7-e450a8d859b4" },
  { name: "Anna Li", pronouns: "she/her", role: "Co-Director", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FAnna.jpg?alt=media&token=3171ae15-61ba-41ea-a20e-a66dbb3e608d" },
  { name: "Eric Wang", pronouns: "he/him", role: "Co-Director", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FEric.jpg?alt=media&token=c7a1ac1f-e62f-43fd-90ef-c031615069e8" },

  { name: "Kelly Zhu", pronouns: "she/her", role: "VP Communications", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FKelly.jpg?alt=media&token=04767ab0-23d9-4912-8cdc-663f4068c787" },
  { name: "Kevin Vong", pronouns: "he/him", role: "VP Communications", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FKevin.jpg?alt=media&token=3c08f8dc-e525-4e4e-9e69-0ff42c5ecb2d" },
  { name: "Daphne Fung", pronouns: "she/her", role: "VP Communications", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FDaphne.jpg?alt=media&token=698989c2-2b80-4040-8c23-eb594d98c8a0" },
  { name: "Olivia Zhou", pronouns: "she/her", role: "VP Communications", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FOlivia.jpg?alt=media&token=8a6c1855-a089-4759-b38d-54882296d6a2" },

  { name: "Andrea Lian", pronouns: "she/her", role: "VP External", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FAndrea.jpg?alt=media&token=61c399ec-2cb7-48e3-bd75-987476f00f31" },
  { name: "Alyson Jiang", pronouns: "she/her", role: "VP External", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FAlyson.jpg?alt=media&token=0a31cb01-b90c-47b9-a13b-761fc767c417" },
  { name: "Justine Lin", pronouns: "she/her", role: "VP External", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FJustine.jpg?alt=media&token=ba357bcb-3268-4410-8937-787a8978150f" },
  { name: "Sabrina Fitz", pronouns: "she/her", role: "VP External", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FSabrina.jpg?alt=media&token=19fd314f-79c8-472f-b59b-89b108f3e81d" },
 
  { name: "Yuan Yi (Anny) Wang", pronouns: "she/her", role: "VP Logistics", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FAnny.jpg?alt=media&token=64b2797d-d1d9-4ee4-9448-4997ba28f6d8" },
  { name: "Laetitia Leung", pronouns: "she/her", role: "VP Logistics", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FLaetitia.jpg?alt=media&token=e902a79f-a656-4496-ac0c-a33d38c6f221" },
  { name: "Claire Hunter", pronouns: "she/her", role: "VP Logistics", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FClaire.png?alt=media&token=9cff4703-462c-4e79-b0e6-cfc033a1166b" },
  { name: "Derek Skolnik", pronouns: "he/him", role: "VP Logistics", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FDerek.jpg?alt=media&token=bfda5208-e781-489a-bb10-e1858c89dde0" },
  { name: "Sonny Bigras-Dewan", pronouns: "he/him", role: "VP Logistics", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FSonny.jpg?alt=media&token=769d8668-27c4-4e2f-bd40-fcbdfb76be3d" },

  { name: "Holly Markomanolaki", pronouns: "she/her", role: "VP Volunteers", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FHolly.jpg?alt=media&token=c38643a5-ae1d-4345-83cb-94c89b076c55" },
  { name: "Wei Heng Gao", pronouns: "he/him", role: "VP Volunteers", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FWei.jpg?alt=media&token=b26b0c2f-9c9d-4679-893a-da1adc5c51c9" },
  { name: "Rebecca Li", pronouns: "she/her", role: "VP Volunteers", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FRebecca.jpg?alt=media&token=fdda7066-83de-4a9e-b05e-493bd4f65384" },
  { name: "Ba-Khang Nguyen", pronouns: "he/him", role: "VP Volunteers", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FBK.jpg?alt=media&token=0e9a983b-89d1-4242-8196-1789481905a1" },
  
  { name: "Anthony Nguyen", pronouns: "he/him", role: "VP Tech", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FAnthony.jpg?alt=media&token=86b537e6-8801-4107-a6b6-b5d128a6e760" },
  { name: "Dory Song", pronouns: "he/him", role: "VP Tech", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FDory.webp?alt=media&token=d54bd712-85d6-4c93-9a6a-b2cc2beaa383" },

  { name: "Lauren Engo", pronouns: "she/her", role: "Secretary", photo: "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/meet-the-crew_gallery%2FLauren.png?alt=media&token=da0360fa-69c7-47c4-bf9a-421c41b735e2" }
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
