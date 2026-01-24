import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
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

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/`)
        if (!response.ok) {
          throw new Error('Failed to fetch participants')
        }
        const data = await response.json()
        setParticipants(data.map(u => ({
          id: u._id,
          name: u.name,
          team: u.team?.name || 'No Team',
          amountRaised: Number(u.amountRaised) || 0,
          role: u.team?.captain === u._id ? 'Captain' : 'Paddler'
        })))
      } catch (error) {
        console.error('Error fetching participants:', error)
      }
    }
    fetchParticipants()
  }, [])

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.team.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayedParticipants = filteredParticipants.slice(0, itemsToShow)
  const hasMore = filteredParticipants.length > itemsToShow

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">All Participants</h1>
            <p className="text-slate-600">Meet the paddlers making a difference.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or team..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedParticipants.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{p.name}</h3>
                  {
                    p.team !== "No Team" ? (
                      <p className="text-sm text-slate-500">{p.team}</p>
                    ) : null
                  }
                  {
                    p.amountRaised > 0 ? (
                      <p className="text-sm text-pink-600 font-medium mt-1">
                        Raised: ${p.amountRaised.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500 mt-1">
                        Raised: $0
                      </p>
                    )
                  }
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.role === 'Captain' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {p.role}
                </span>
                <button className="text-sm font-medium text-pink-600 hover:text-pink-700" onClick = { () => setSelectedParticipantId(p.id) }>
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setItemsToShow(prev => prev + 20)}
              className="px-6 py-3 bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200"
            >
              Load More ({filteredParticipants.length - itemsToShow} remaining)
            </Button>
          </div>
        )}

        {filteredParticipants.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No participants found matching "{searchTerm}"
          </div>
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

