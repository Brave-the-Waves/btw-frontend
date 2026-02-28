import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Users, Trophy, Target, FileText } from 'lucide-react'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Textarea from '@/components/ui/textarea'

const DIVISIONS = ['Community']
const NAME_REGEX = /^[A-Za-z0-9 .'-]+$/
const MAX_DESCRIPTION_LENGTH = 300

export default function CreateTeamOverlay({ onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    teamName: '',
    division: 'Community',
    donationGoal: '',
    description: ''
  })
  const [touched, setTouched] = useState({
    teamName: false,
    donationGoal: false,
    description: false
  })

  const normalizedTeamName = formData.teamName.replace(/\s+/g, ' ').trim()

  const getTeamNameError = () => {
    if (!normalizedTeamName) return 'Team name is required'
    if (normalizedTeamName.length < 2 || normalizedTeamName.length > 50) return 'Team name must be 2–50 characters'
    if (!NAME_REGEX.test(normalizedTeamName)) return "Use letters, numbers, spaces, hyphen, apostrophe, or period only"
    return ''
  }

  const teamNameError = getTeamNameError()

  const getDescriptionError = () => {
    if (formData.description.length > MAX_DESCRIPTION_LENGTH) return `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`
    return ''
  }

  const descriptionError = getDescriptionError()

  const getDonationGoalError = () => {
    if (formData.donationGoal === '') return 'Donation goal is required'
    const goal = Number(formData.donationGoal)
    if (goal < 0) return 'Donation goal must be greater than or equal to 0'
    return ''
  }

  const donationGoalError = getDonationGoalError()
  const isFormValid = !teamNameError && !donationGoalError && !descriptionError

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    markTouched('teamName')
    markTouched('donationGoal')
    markTouched('description')
    if (!isFormValid) return
    onSubmit({ ...formData, teamName: normalizedTeamName })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100/50">
          <h2 className="text-2xl font-bold text-slate-900">Create a New Team</h2>
          <motion.button whileHover={{ scale: 1.1 }} onClick={onClose} className="text-slate-400 hover:text-[#fc87a7] transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Team Name</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fc87a7]" />
              <Input 
                id="teamName"
                required
                className="pl-10 focus:ring-2 focus:ring-[#fc87a7] border-slate-200 rounded-lg"
                placeholder="e.g. Wave Runners"
                value={formData.teamName}
                onChange={e => setFormData({...formData, teamName: e.target.value})}
                onBlur={() => markTouched('teamName')}
                aria-invalid={touched.teamName && !!teamNameError}
              />
            </div>
            {touched.teamName && teamNameError && (
              <p className="text-xs text-red-600">{teamNameError}</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-2">
            <Label htmlFor="division" className="text-sm font-semibold text-slate-700">Division</Label>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fc87a7]" />
              <select
                id="division"
                className="w-full pl-10 h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc87a7] focus:border-[#fc87a7] transition-all"
                value={formData.division}
                onChange={e => setFormData({...formData, division: e.target.value})}
              >
                {DIVISIONS.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-semibold text-slate-700">Donation Goal ($)</Label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fc87a7]" />
              <Input 
                id="goal"
                type="number"
                min="0"
                step="100"
                required
                className="pl-10 focus:ring-2 focus:ring-[#fc87a7] border-slate-200 rounded-lg"
                placeholder="1000"
                value={formData.donationGoal}
                onChange={e => setFormData({...formData, donationGoal: e.target.value})}
                onBlur={() => markTouched('donationGoal')}
                aria-invalid={touched.donationGoal && !!donationGoalError}
              />
            </div>
            {touched.donationGoal && donationGoalError && (
              <p className="text-xs text-red-600">{donationGoalError}</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-[#fc87a7]" />
              <Textarea 
                id="description"
                className="pl-10 min-h-[100px] focus:ring-2 focus:ring-[#fc87a7] border-slate-200 rounded-lg"
                placeholder="Tell us about your team..."
                value={formData.description}
                onChange={e => {
                  const cleaned = e.target.value.replace(/<[^>]*>/g, '').slice(0, MAX_DESCRIPTION_LENGTH)
                  setFormData({...formData, description: cleaned})
                }}
                onBlur={() => markTouched('description')}
              />
            </div>
            {descriptionError && (
              <p className="text-xs text-red-600">{descriptionError}</p>
            )}
            <p className="text-xs text-slate-400">{formData.description.length}/{MAX_DESCRIPTION_LENGTH} characters</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-4 flex gap-3">
            <Button type="button" className="flex-1 border-2 border-slate-200 bg-white text-slate-600 hover:border-[#fc87a7]/30 hover:bg-slate-50 rounded-lg cursor-pointer font-semibold transition-all" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#fc87a7] text-white rounded-lg cursor-pointer font-semibold hover:shadow-lg hover:shadow-[#fc87a7]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
