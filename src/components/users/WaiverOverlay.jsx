import React, { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase'
import { API_BASE_URL } from '@/config'
import { X, ChevronRight, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

// ─────────────────────────────────────────────────────────────────────────────
// Waiver Text
// ─────────────────────────────────────────────────────────────────────────────

const WAIVER_EN = `WAIVER AND RELEASE OF LIABILITY

Scope of Activities
This Waiver covers my participation in the 2026 edition of Brave The Wave on July 4th 2026.

Assumption of Risk
I acknowledge that participation in the above activities involves risks, dangers, and hazards. These may include, but are not limited to, boats capsizing or colliding in good or bad weather conditions. I am aware that by participating in these activities, I risk personal injury, death, or damage to property. I knowingly accept and assume all such risks. I understand that I must wear a personal flotation device (PFD) at all times during this event.

Release of Liability
I hereby release the following companies and entities (collectively, the "Releasees"):
a) 22Dragons
b) Club Sportif de Bateau Dragon de l'Université de Montréal
c) Women's Health Awareness Movement
d) More Than A Cure
l) The directors, officers, employees, agents, independent contractors, and volunteers of any of the above entities
from any and all liability for loss, damage, injury, or expenses that I may suffer as a result of my participation in the activities described above, howsoever caused, including negligence on the part of any of the Releasees.

No Contribution or Indemnity Claims
If I commence any legal action for negligence, I agree not to seek contribution or indemnity from any of the Releasees. I further release the Releasees from all liability that could arise from such contribution or indemnity claims.

Indemnification
I agree to hold harmless and indemnify the Releasees against any claims, liabilities, or legal expenses incurred directly or indirectly as a result of any claim brought by me against any person or entity for loss, damage, injury, or expenses suffered by me. For example, if I sue a member of another team, a coach, or a steersperson for negligence, and that person seeks contribution or indemnity from 22DRAGONS, CsBUM, WHAM or MTAC, I agree to be responsible for any liability claims and legal expenses incurred by those entities in connection with such claims.

Age of Majority
I confirm that I am at least 18 years of age, or, if under 18, that my parent or legal guardian has signed this Waiver.

Photography and Media Release
I acknowledge that photographs and/or videos may be taken during the activities and that such media may be published on social media or other public platforms.

Binding Agreement
I acknowledge and agree that participation in the above activities is not permitted unless this Waiver is signed. I further agree that this Waiver is binding upon me and my heirs, executors, administrators, and legal representatives.`

const WAIVER_FR = `RENONCIATION ET DÉCHARGE DE RESPONSABILITÉ

Portée des activités
La présente renonciation couvre ma participation à l'édition 2026 de Brave The Wave, qui aura lieu le 4 juillet 2026.

Acceptation des risques
Je reconnais que la participation aux activités mentionnées ci-dessus comporte des risques, des dangers et des aléas. Ceux-ci peuvent inclure, sans s'y limiter, le chavirement d'embarcations ou des collisions, quelles que soient les conditions météorologiques. Je suis conscient(e) qu'en participant à ces activités, je m'expose à des risques de blessures corporelles, de décès ou de dommages matériels. J'accepte et assume volontairement tous ces risques. Je comprends que je dois porter une veste de sauvetage en tout temps durant cet événement.

Décharge de responsabilité
Par la présente, je libère les sociétés et entités suivantes (collectivement, les « Personnes libérées ») :
a) 22Dragons
b) Club Sportif de Bateau Dragon de l'Université de Montréal
c) Women's Health Awareness Movement
d) More Than A Cure
l) ainsi que les administrateurs, dirigeants, employés, agents, contractuels indépendants et bénévoles de toute entité mentionnée ci-dessus,
de toute responsabilité pour toute perte, tout dommage, toute blessure ou toute dépense que je pourrais subir en raison de ma participation aux activités décrites ci-dessus, quelle qu'en soit la cause, y compris en cas de négligence de la part de l'une ou l'autre des Personnes libérées.

Absence de réclamation pour contribution ou indemnisation
Si j'intente une poursuite pour négligence, je m'engage à ne pas réclamer de contribution ou d'indemnisation de la part des Personnes libérées. Je libère également les Personnes libérées de toute responsabilité pouvant découler d'une telle réclamation en contribution ou en indemnisation.

Indemnisation
Je m'engage à tenir indemnes et à indemniser les Personnes libérées à l'égard de toute réclamation, responsabilité ou dépense juridique encourue directement ou indirectement à la suite d'une réclamation intentée par moi contre toute personne ou entité pour une perte, un dommage, une blessure ou des dépenses que j'aurais subis. Par exemple, si je poursuis un membre d'une autre équipe, un entraîneur ou un barreur pour négligence, et que cette personne réclame ensuite une contribution ou une indemnisation de la part de 22DRAGONS, CsBUM, WHAM ou MTAC, j'accepte d'assumer toute responsabilité et tous les frais juridiques engagés par ces entités en lien avec une telle réclamation.

Âge de la majorité
Je confirme que j'ai au moins 18 ans ou, si j'ai moins de 18 ans, que mon parent ou tuteur légal a signé la présente renonciation.

Autorisation de captation et de diffusion d'images
Je reconnais que des photographies et/ou des vidéos peuvent être prises durant les activités et que celles-ci peuvent être diffusées sur les réseaux sociaux ou toute autre plateforme publique.

Caractère contraignant
Je reconnais et accepte que la participation aux activités mentionnées ci-dessus est interdite sans la signature de la présente renonciation. Je reconnais également que cette renonciation est contraignante pour moi ainsi que pour mes héritiers, exécuteurs testamentaires, administrateurs et représentants légaux.`

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function computeAge(dateOfBirth) {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  if (isNaN(dob)) return null
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function WaiverOverlay({ userId, getToken, userEmail, onClose, onSigned }) {
  const [step, setStep] = useState(1)
  const [statusLoading, setStatusLoading] = useState(true)
  const [waiverStatus, setWaiverStatus] = useState(null)
  const [statusError, setStatusError] = useState(null)
  const [language, setLanguage] = useState('en')
  const [hasReadWaiver, setHasReadWaiver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [participantSigDrawn, setParticipantSigDrawn] = useState(false)
  const [guardianSigDrawn, setGuardianSigDrawn] = useState(false)

  const participantSigRef = useRef(null)
  const guardianSigRef = useRef(null)

  const [touched, setTouched] = useState({})
  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const getFieldError = (field) => {
    if (!touched[field]) return null
    const val = (formData[field] || '').trim()
    if (!val) return null
    const nameFields = ['firstName', 'lastName', 'parentGuardianName', 'emergencyContactName']
    const emailFields = ['email', 'parentGuardianEmail']
    const phoneFields = ['phone', 'emergencyContactPhone', 'parentGuardianPhone']
    if (nameFields.includes(field) && !/^[a-zA-Z\u00C0-\u024F\s'\-.]+$/.test(val))
      return 'Name contains invalid characters'
    if (emailFields.includes(field) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return 'Please enter a valid email address'
    if (phoneFields.includes(field) && !/^[\d\s+\-().]+$/.test(val))
      return 'Phone number contains invalid characters'
    return null
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userEmail || '',
    phone: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    paddlingSide: '',
    isExperienced: null,
    yearsOfExperience: '',
    medicalConditions: '',
    parentGuardianName: '',
    parentGuardianPhone: '',
    parentGuardianEmail: '',
  })

  // Derived: minor status
  const age = computeAge(formData.dateOfBirth)
  const isMinor = age !== null && age < 18

  // ── Load waiver status & prefill on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const init = async () => {
      try {
        const token = await getToken()
        const [statusRes, waiverRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/waivers/${userId}/status`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/waivers/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const statusData = await statusRes.json()
        if (!cancelled) setWaiverStatus(statusData)

        if (waiverRes.ok) {
          const w = await waiverRes.json()
          if (!cancelled) {
            setFormData((prev) => ({
              ...prev,
              firstName: w.firstName || '',
              lastName: w.lastName || '',
              email: w.email || userEmail || '',
              phone: w.phone || '',
              dateOfBirth: w.dateOfBirth ? w.dateOfBirth.split('T')[0] : '',
              emergencyContactName: w.emergencyContactName || '',
              emergencyContactPhone: w.emergencyContactPhone || '',
              paddlingSide: w.paddlingSide || '',
              isExperienced: w.isExperienced ?? null,
              yearsOfExperience: w.yearsOfExperience != null ? String(w.yearsOfExperience) : '',
              medicalConditions: w.medicalConditions || '',
              parentGuardianName: w.parentGuardianName || '',
              parentGuardianPhone: w.parentGuardianPhone || '',
              parentGuardianEmail: w.parentGuardianEmail || '',
            }))
          }
        }
      } catch (err) {
        console.error('WaiverOverlay: init error', err)
        if (!cancelled) setStatusError('Failed to load waiver. Please close and try again.')
      } finally {
        if (!cancelled) setStatusLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [userId, userEmail, getToken])

  // ── Field helpers ──────────────────────────────────────────────────────────
  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  // ── Step validation ────────────────────────────────────────────────────────
  const isStep1Valid = () => {
    const { firstName, lastName, email, phone, emergencyContactName, emergencyContactPhone } = formData
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) return false
    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) return false
    if (isMinor) {
      const { parentGuardianName, parentGuardianPhone, parentGuardianEmail } = formData
      if (!parentGuardianName.trim() || !parentGuardianPhone.trim() || !parentGuardianEmail.trim()) return false
    }
    // Format validation
    const nameCheck = ['firstName', 'lastName', 'emergencyContactName', ...(isMinor ? ['parentGuardianName'] : [])]
    if (nameCheck.some((f) => !/^[a-zA-Z\u00C0-\u024F\s'\-.]+$/.test(formData[f].trim()))) return false
    const emailCheck = ['email', ...(isMinor ? ['parentGuardianEmail'] : [])]
    if (emailCheck.some((f) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[f].trim()))) return false
    return true
  }

  const isStep2Valid = () => {
    const { paddlingSide, isExperienced, yearsOfExperience } = formData
    if (!paddlingSide) return false
    if (isExperienced === null) return false
    if (isExperienced === true && (!yearsOfExperience || Number(yearsOfExperience) < 1)) return false
    return true
  }

  const isStep4CanSubmit = () => {
    if (!participantSigDrawn) return false
    if (isMinor && !guardianSigDrawn) return false
    return true
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setApiError(null)
    let token
    try {
      token = await getToken()
    } catch {
      setApiError('Authentication failed. Please refresh and try again.')
      setIsSubmitting(false)
      return
    }

    try {
      // 1. Upload participant signature
      const partSigData = participantSigRef.current.toDataURL('image/png')
      const partStorageRef = ref(storage, `waivers/${userId}/signature.png`)
      await uploadString(partStorageRef, partSigData, 'data_url')
      const signatureUrl = await getDownloadURL(partStorageRef)

      // 2. Upload guardian signature if minor
      let parentGuardianSignatureUrl = null
      if (isMinor) {
        const guardSigData = guardianSigRef.current.toDataURL('image/png')
        const guardStorageRef = ref(storage, `waivers/${userId}/parent-signature.png`)
        await uploadString(guardStorageRef, guardSigData, 'data_url')
        parentGuardianSignatureUrl = await getDownloadURL(guardStorageRef)
      }

      // 3. Build request body
      const body = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth || undefined,
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        paddlingSide: formData.paddlingSide,
        isExperienced: formData.isExperienced === true,
        ...(formData.isExperienced === true && { yearsOfExperience: Number(formData.yearsOfExperience) }),
        medicalConditions: formData.medicalConditions.trim() || undefined,
        isMinor,
        ...(isMinor && {
          parentGuardianName: formData.parentGuardianName.trim(),
          parentGuardianPhone: formData.parentGuardianPhone.trim(),
          parentGuardianEmail: formData.parentGuardianEmail.trim(),
          parentGuardianSignatureUrl,
        }),
        hasReadWaiver: true,
        signatureUrl,
      }

      // 4. Submit
      const res = await fetch(`${API_BASE_URL}/api/waivers/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 403) throw new Error('You are not authorized to submit this waiver.')
        if (res.status === 404) throw new Error('Waiver record not found. Please contact support.')
        throw new Error(data.message || 'Submission failed. Please try again.')
      }

      toast.success('Waiver signed successfully.')
      onSigned()
      onClose()
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred.'
      if (msg.toLowerCase().includes('upload') || msg.toLowerCase().includes('storage')) {
        setApiError('Signature upload failed. Please try again.')
      } else {
        setApiError(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────

  const canClose = !isSubmitting && step < 4

  const InputField = ({ label, type = 'text', field, required = true, placeholder, className = '' }) => {
    const error = getFieldError(field)
    return (
      <div className={className}>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          {label}{required && <span className="text-[#fc87a7] ml-0.5">*</span>}
        </label>
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => { setField(field, e.target.value); markTouched(field) }}
          onBlur={() => markTouched(field)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${
            error ? 'border-red-400 bg-red-50' : 'border-slate-200'
          }`}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────────────────────────────────
  if (statusLoading) {
    return (
      <OverlayShell onClose={onClose} canClose={true} title="Waiver" step={null}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#fc87a7]" />
          <p className="text-slate-500 text-sm">Loading waiver…</p>
        </div>
      </OverlayShell>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Status error
  // ─────────────────────────────────────────────────────────────────────────
  if (statusError) {
    return (
      <OverlayShell onClose={onClose} canClose={true} title="Waiver" step={null}>
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
          <p className="text-red-600 text-sm">{statusError}</p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition-all cursor-pointer">Close</button>
        </div>
      </OverlayShell>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Already signed
  // ─────────────────────────────────────────────────────────────────────────
  if (waiverStatus?.completed) {
    const signedDate = waiverStatus.signedAt
      ? new Date(waiverStatus.signedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Unknown date'
    return (
      <OverlayShell onClose={onClose} canClose={true} title="Waiver" step={null}>
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
          <h3 className="text-xl font-bold text-slate-900">Waiver Already Signed</h3>
          <p className="text-slate-500 text-sm">
            Your waiver was signed on <span className="font-medium text-slate-700">{signedDate}</span>.
          </p>
          <button onClick={onClose} className="mt-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition-all cursor-pointer">Close</button>
        </div>
      </OverlayShell>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Not found
  // ─────────────────────────────────────────────────────────────────────────
  if (waiverStatus && !waiverStatus.exists) {
    return (
      <OverlayShell onClose={onClose} canClose={true} title="Waiver" step={null}>
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
          <p className="text-red-600 text-sm font-medium">
            Your waiver record was not found. Please contact support.
          </p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition-all cursor-pointer">Close</button>
        </div>
      </OverlayShell>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Multi-step form
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <OverlayShell
      onClose={onClose}
      canClose={canClose}
      title={stepTitle(step)}
      step={step}
    >
      {/* Step 1 ─────────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Personal Details */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{ label: 'First Name', field: 'firstName' }, { label: 'Last Name', field: 'lastName' }].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}<span className="text-[#fc87a7] ml-0.5">*</span></label>
                  <input type="text" value={formData[field]} onChange={(e) => { setField(field, e.target.value); markTouched(field) }} onBlur={() => markTouched(field)}
                    className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError(field) ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                  {getFieldError(field) && <p className="mt-1 text-xs text-red-500">{getFieldError(field)}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email<span className="text-[#fc87a7] ml-0.5">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => { setField('email', e.target.value); markTouched('email') }} onBlur={() => markTouched('email')}
                  className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('email') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                {getFieldError('email') && <p className="mt-1 text-xs text-red-500">{getFieldError('email')}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number<span className="text-[#fc87a7] ml-0.5">*</span></label>
                <input type="tel" value={formData.phone} onChange={(e) => { setField('phone', e.target.value); markTouched('phone') }} onBlur={() => markTouched('phone')}
                  placeholder="e.g. 6041234567"
                  className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('phone') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                {getFieldError('phone') && <p className="mt-1 text-xs text-red-500">{getFieldError('phone')}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all" />
                {isMinor && (
                  <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
                    <strong>Minor participant:</strong> As a minor, a parent or legal guardian must complete and sign this waiver on your behalf.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Parent / Guardian — only if minor */}
          {isMinor && (
            <section>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Parent / Guardian</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Parent/Guardian Full Name<span className="text-[#fc87a7] ml-0.5">*</span></label>
                  <input type="text" value={formData.parentGuardianName} onChange={(e) => { setField('parentGuardianName', e.target.value); markTouched('parentGuardianName') }} onBlur={() => markTouched('parentGuardianName')}
                    className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('parentGuardianName') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                  {getFieldError('parentGuardianName') && <p className="mt-1 text-xs text-red-500">{getFieldError('parentGuardianName')}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Parent/Guardian Phone<span className="text-[#fc87a7] ml-0.5">*</span></label>
                  <input type="tel" value={formData.parentGuardianPhone} onChange={(e) => { setField('parentGuardianPhone', e.target.value); markTouched('parentGuardianPhone') }} onBlur={() => markTouched('parentGuardianPhone')}
                    className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('parentGuardianPhone') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                  {getFieldError('parentGuardianPhone') && <p className="mt-1 text-xs text-red-500">{getFieldError('parentGuardianPhone')}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Parent/Guardian Email<span className="text-[#fc87a7] ml-0.5">*</span></label>
                  <input type="email" value={formData.parentGuardianEmail} onChange={(e) => { setField('parentGuardianEmail', e.target.value); markTouched('parentGuardianEmail') }} onBlur={() => markTouched('parentGuardianEmail')}
                    className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('parentGuardianEmail') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                  {getFieldError('parentGuardianEmail') && <p className="mt-1 text-xs text-red-500">{getFieldError('parentGuardianEmail')}</p>}
                </div>
              </div>
            </section>
          )}

          {/* Emergency Contact */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Contact Name<span className="text-[#fc87a7] ml-0.5">*</span></label>
                <input type="text" value={formData.emergencyContactName} onChange={(e) => { setField('emergencyContactName', e.target.value); markTouched('emergencyContactName') }} onBlur={() => markTouched('emergencyContactName')}
                  className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('emergencyContactName') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                {getFieldError('emergencyContactName') && <p className="mt-1 text-xs text-red-500">{getFieldError('emergencyContactName')}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Contact Phone<span className="text-[#fc87a7] ml-0.5">*</span></label>
                <input type="tel" value={formData.emergencyContactPhone} onChange={(e) => { setField('emergencyContactPhone', e.target.value); markTouched('emergencyContactPhone') }} onBlur={() => markTouched('emergencyContactPhone')}
                  className={`w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all ${getFieldError('emergencyContactPhone') ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                {getFieldError('emergencyContactPhone') && <p className="mt-1 text-xs text-red-500">{getFieldError('emergencyContactPhone')}</p>}
              </div>
            </div>
          </section>

          {/* Footer */}
          <StepFooter
            canNext={isStep1Valid()}
            onNext={() => setStep(2)}
            showBack={false}
          />
        </div>
      )}

      {/* Step 2 ─────────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Paddling Experience */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Paddling Experience</h3>

            {/* Preferred side */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Preferred Paddling Side<span className="text-[#fc87a7] ml-0.5">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {['left', 'right', 'ambidextrous', 'unknown'].map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setField('paddlingSide', side)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize cursor-pointer ${
                      formData.paddlingSide === side
                        ? 'bg-gradient-to-r from-[#fc87a7] to-[#c14a75] text-white border-transparent shadow-lg shadow-[#fc87a7]/30'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#fc87a7]/50 hover:bg-[#fc87a7]/5'
                    }`}
                  >
                    {side === 'unknown' ? "I don't know" : side}
                  </button>
                ))}
              </div>
            </div>

            {/* Experienced paddler */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Experienced Paddler?<span className="text-[#fc87a7] ml-0.5">*</span>
              </label>
              <div className="flex gap-2">
                {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(({ label, value }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setField('isExperienced', value)
                      if (!value) setField('yearsOfExperience', '')
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                      formData.isExperienced === value
                        ? 'bg-gradient-to-r from-[#fc87a7] to-[#c14a75] text-white border-transparent shadow-lg shadow-[#fc87a7]/30'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#fc87a7]/50 hover:bg-[#fc87a7]/5'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Years of experience */}
            {formData.isExperienced === true && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Years of Experience<span className="text-[#fc87a7] ml-0.5">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.yearsOfExperience}
                  onChange={(e) => setField('yearsOfExperience', e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white transition-all"
                />
              </div>
            )}
          </section>

          {/* Health & Medical */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Health & Medical</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Medical Conditions / Allergies
                <span className="font-normal text-slate-400 ml-1">(optional)</span>
              </label>
              <textarea
                value={formData.medicalConditions}
                onChange={(e) => setField('medicalConditions', e.target.value)}
                rows={3}
                placeholder="List any relevant medical conditions, medications, or allergies the event organizers should be aware of. Leave blank if none."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#fc87a7] focus:border-transparent outline-none text-sm bg-white resize-none transition-all"
              />
            </div>
          </section>

          <StepFooter
            canNext={isStep2Valid()}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        </div>
      )}

      {/* Step 3 ─────────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Language toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Language:</span>
            {['en', 'fr'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {lang === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>

          {/* Scrollable waiver */}
          <div className="h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {language === 'en' ? WAIVER_EN : WAIVER_FR}
            </pre>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasReadWaiver}
              onChange={(e) => setHasReadWaiver(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#fc87a7] flex-shrink-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 leading-snug">
              {isMinor ? (
                <>
                  <strong>Je, en tant que parent/tuteur du mineur susmentionné, ai lu et compris l'intégralité de la décharge de responsabilité.</strong>
                  <span className="ml-2 text-slate-400 italic text-xs">
                    / I, as the parent/guardian of the above-named minor, have read and understood the waiver and release of liability in its entirety.
                  </span>
                </>
              ) : (
                <>
                  <strong>J'ai lu et compris l'intégralité de la décharge de responsabilité.</strong>
                  <span className="ml-2 text-slate-400 italic text-xs">
                    / I have read and understood the waiver and release of liability in its entirety.
                  </span>
                </>
              )}
            </span>
          </label>

          <StepFooter
            canNext={hasReadWaiver}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        </div>
      )}

      {/* Step 4 ─────────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          {/* Participant signature */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isMinor ? 'Minor Participant Signature' : 'Participant Signature'}
              <span className="text-[#fc87a7] ml-0.5">*</span>
            </label>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <SignatureCanvas
                ref={participantSigRef}
                onEnd={() => setParticipantSigDrawn(true)}
                canvasProps={{ className: 'w-full h-36', style: { touchAction: 'none' } }}
                backgroundColor="rgb(248 250 252)"
              />
            </div>
            <button
              type="button"
              onClick={() => { participantSigRef.current?.clear(); setParticipantSigDrawn(false) }}
              className="mt-1.5 text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear
            </button>
          </section>

          {/* Guardian signature — only if minor */}
          {isMinor && (
            <section>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Parent / Guardian Signature<span className="text-[#fc87a7] ml-0.5">*</span>
              </label>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <SignatureCanvas
                  ref={guardianSigRef}
                  onEnd={() => setGuardianSigDrawn(true)}
                  canvasProps={{ className: 'w-full h-36', style: { touchAction: 'none' } }}
                  backgroundColor="rgb(248 250 252)"
                />
              </div>
              <button
                type="button"
                onClick={() => { guardianSigRef.current?.clear(); setGuardianSigDrawn(false) }}
                className="mt-1.5 text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Clear
              </button>
            </section>
          )}

          {/* API Error */}
          {apiError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {apiError}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setStep(3); setApiError(null) }}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isStep4CanSubmit()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] text-white hover:shadow-lg hover:shadow-[#fc87a7]/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all ml-auto cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Submitting…' : 'Submit Waiver'}
            </button>
          </div>
        </div>
      )}
    </OverlayShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function stepTitle(step) {
  return {
    1: 'Participant Information',
    2: 'Paddling Experience & Health',
    3: 'Read the Waiver',
    4: 'Signature',
  }[step] ?? 'Sign Waiver'
}

function OverlayShell({ children, onClose, canClose, title, step }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={canClose ? onClose : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0 bg-gradient-to-br from-[#fc87a7]/5 to-white">
          <div>
            <p className="text-xs font-semibold text-[#fc87a7] uppercase tracking-wide">Waiver</p>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{title}</h2>
          </div>
          <button
            type="button"
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Step progress indicator */}
        {step && (
          <div className="px-6 pt-4 pb-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      s <= step ? 'bg-gradient-to-r from-[#fc87a7] to-[#c14a75]' : 'bg-slate-200'
                    }`}
                  />
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Step {step} of 4</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

function StepFooter({ canNext, onNext, onBack, showBack = true }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] text-white hover:shadow-lg hover:shadow-[#fc87a7]/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all ml-auto cursor-pointer"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
