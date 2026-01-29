import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Users, Trophy, Target, FileText } from 'lucide-react'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Textarea from '@/components/ui/textarea'

const DIVISIONS = ['Community', 'Student']

export default function CreateTeamOverlay({ onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    teamName: '',
    division: 'Community',
    donationGoal: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Create a New Team</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input 
                id="teamName"
                required
                className="pl-10"
                placeholder="e.g. Wave Runners"
                value={formData.teamName}
                onChange={e => setFormData({...formData, teamName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <div className="relative">
              <Trophy className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select
                id="division"
                className="w-full pl-10 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.division}
                onChange={e => setFormData({...formData, division: e.target.value})}
              >
                {DIVISIONS.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Donation Goal ($)</Label>
            <div className="relative">
              <Target className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input 
                id="goal"
                type="number"
                min="0"
                step="100"
                required
                className="pl-10"
                placeholder="1000"
                value={formData.donationGoal}
                onChange={e => setFormData({...formData, donationGoal: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Textarea 
                id="description"
                className="pl-10 min-h-[100px]"
                placeholder="Tell us about your team..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1 border-2 rounded-md cursor-pointer hover:bg-gray-100" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-md cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
