import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'

export default function CorporateRegister() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  const [captainFirstName, setCaptainFirstName] = useState('')
  const [captainLastName, setCaptainLastName] = useState('')
  const [captainEmail, setCaptainEmail] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [orgAddress, setOrgAddress] = useState('')
  const [orgPhone, setOrgPhone] = useState('')
  const [members, setMembers] = useState(() => Array.from({ length: 16 }, () => ({ firstName: '', lastName: '', email: '' })))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (isLoading) return null
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addMember = () => setMembers(prev => [...prev, { firstName: '', lastName: '', email: '' }])
  const removeMember = (index) => {
    if (members.length <= 16) return
    setMembers(prev => prev.filter((_, i) => i !== index))
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!captainFirstName || !captainLastName || !captainEmail) {
      setError('Please provide the team captain full name and email.')
      return
    }
    if (!validateEmail(captainEmail)) {
      setError('Captain email is invalid.')
      return
    }
    if (!organizationName || !orgAddress || !orgPhone) {
      setError('Please provide organization name, address, and phone.')
      return
    }
    if (members.length < 16) {
      setError('A minimum of 16 paddlers is required.')
      return
    }
    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      if (!m.firstName || !m.lastName || !m.email) {
        setError(`Please fill all fields for member #${i + 1}.`)
        return
      }
      if (!validateEmail(m.email)) {
        setError(`Member #${i + 1} email is invalid.`)
        return
      }
    }

    setIsSubmitting(true)
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        setError('EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your env.')
        setIsSubmitting(false)
        return
      }

      const templateParams = {
        organizationName,
        orgAddress,
        orgPhone,
        captainFirstName,
        captainLastName,
        captainEmail,
        members: members.map((m, i) => `${i + 1}. ${m.firstName} ${m.lastName} - ${m.email}`).join('\n'),
        note: 'Team captain will receive all competition information by e-mail and is responsible to relay it to the team.'
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      setSubmitted(true)
    } catch (err) {
      console.error('Corporate submit error', err)
      setError(err.message || 'An error occurred preparing the email')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Thank you for registering</h2>
          <p className="text-slate-600 mb-4">We received your corporate registration. You will hear back from us soon.</p>
          <p className="text-sm text-slate-500">Note: The team captain will receive all competition information by e-mail and is responsible for relaying it to the team.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('/')} className="bg-slate-800 text-white">Return Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">Corporate Registration</h1>
        <p className="text-slate-600 text-center mb-8 max-w-lg mx-auto">Please fill the form below. A minimum of 16 paddlers is required.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input placeholder="Captain First Name" value={captainFirstName} onChange={(e) => setCaptainFirstName(e.target.value)} />
            <Input placeholder="Captain Last Name" value={captainLastName} onChange={(e) => setCaptainLastName(e.target.value)} />
            <Input type="email" placeholder="Captain Email" value={captainEmail} onChange={(e) => setCaptainEmail(e.target.value)} />
            <Input placeholder="Organization Name" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Input placeholder="Organization Address" value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} />
            <Input placeholder="Organization Phone" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Team Members (minimum 16)</h4>
            <div className="space-y-3">
              {members.map((m, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-2 items-center">
                  <Input placeholder={`First name #${i + 1}`} value={m.firstName} onChange={(e) => handleMemberChange(i, 'firstName', e.target.value)} />
                  <Input placeholder={`Last name #${i + 1}`} value={m.lastName} onChange={(e) => handleMemberChange(i, 'lastName', e.target.value)} />
                  <div className="flex gap-2 items-center">
                    <Input type="email" placeholder={`Email #${i + 1}`} value={m.email} onChange={(e) => handleMemberChange(i, 'email', e.target.value)} />
                    <button type="button" onClick={() => removeMember(i)} className="text-red-500 px-2">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={addMember} className="px-4 py-2 bg-slate-100 rounded">Add member</button>
              <div className="text-sm text-slate-500 self-center">Members: {members.length}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={isSubmitting} className="bg-slate-800 text-white">
              {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2"/>Submitting</>) : 'Submit Registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
