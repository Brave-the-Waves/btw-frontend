import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/button'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticipantOverlay from '@/components/users/ParticipantOverlay'
import { API_BASE_URL } from '@/config'

export default function Participants() {
  const [searchTerm, setSearchTerm] = useState('')
  const [participants, setParticipants] = useState([])
  const [selectedParticipantId, setSelectedParticipantId] = useState(null)
  const [itemsToShow, setItemsToShow] = useState(20)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/participants/`)
        if (!response.ok) {
          throw new Error('Failed to fetch participants')
        }
        const data = await response.json()
        setParticipants(data.map(u => ({
          id: u._id,
          name: u.name || 'Unknown',
          team: u.team?.name || 'No Team',
          amountRaised: Number(u.amountRaised) || 0,
          role: u.team?.captain === u._id ? 'Captain' : 'Paddler',
          picture: u.picture || null
        })))
      } catch (error) {
        console.error('Error fetching participants:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchParticipants()
  }, [])

  const filteredParticipants = participants.filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.team || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayedParticipants = filteredParticipants.slice(0, itemsToShow)
  const hasMore = filteredParticipants.length > itemsToShow

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-2">All Participants</h1>
            <p className="text-slate-600 text-lg">Meet the paddlers making a difference.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or team..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-[#fc87a7] focus:border-[#fc87a7] outline-none bg-white transition-all"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-200 border-t-[#fc87a7] rounded-full"></motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedParticipants.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#fc87a7]/30 shadow-sm hover:shadow-lg hover:shadow-[#fc87a7]/10 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#fc87a7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fc87a7] to-[#c14a75] flex items-center justify-center text-lg font-bold text-white group-hover:scale-110 transition-transform overflow-hidden flex-shrink-0">
                    {p.picture
                      ? <img src={p.picture} alt={p.name} className="w-full h-full object-cover" />
                      : p.name.charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#fc87a7] transition-colors">{p.name}</h3>
                    {
                      p.team !== "No Team" ? (
                        <p className="text-sm text-slate-500 group-hover:text-slate-600">{p.team}</p>
                      ) : null
                    }
                  </div>
                </div>
                <div className="relative z-10">
                  {
                    p.amountRaised > 0 ? (
                      <p className="text-sm font-semibold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] bg-clip-text text-transparent mb-4">
                        ${p.amountRaised.toLocaleString()} Raised
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500 mb-4">
                        Raised: $0
                      </p>
                    )
                  }
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      p.role === 'Captain' ? 'bg-[#fc87a7]/10 text-[#fc87a7] border border-[#fc87a7]/20' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.role}
                    </span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="text-sm font-semibold text-[#fc87a7] hover:text-[#c14a75] cursor-pointer transition-colors" 
                      onClick={() => setSelectedParticipantId(p.id)}
                    >
                      View Profile →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {hasMore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-8">
            <Button
              onClick={() => setItemsToShow(prev => prev + 20)}
              className="px-6 py-3 bg-[#fc87a7]/10 text-[#fc87a7] hover:bg-[#fc87a7]/20 border-2 border-[#fc87a7]/30 rounded-lg cursor-pointer font-semibold transition-all"
            >
              Load More ({filteredParticipants.length - itemsToShow} remaining)
            </Button>
          </motion.div>
        )}

        {filteredParticipants.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">No participants found matching "{searchTerm}"</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedParticipantId && (
          <ParticipantOverlay 
            participantId={selectedParticipantId} 
            onClose={() => setSelectedParticipantId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

