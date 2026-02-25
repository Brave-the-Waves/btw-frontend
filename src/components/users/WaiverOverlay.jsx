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

const WAIVER_EN = `RELEASE OF LIABILITY, WAIVER OF CLAIMS, ASSUMPTION OF RISK, AND INDEMNITY AGREEMENT

Beat The Wave Dragon Boat Festival

Please read this entire document carefully before signing.

1. NATURE OF ACTIVITY

Dragon boating is a physically demanding water-based team sport that involves inherent and significant risks. These risks include, but are not limited to: drowning, near-drowning, hypothermia, capsizing, collision with other vessels or fixed objects, overexertion, physical injury (including broken bones, sprains, concussions, and spinal injuries), and death. These risks exist regardless of the precautions taken by the organizers, officials, or other participants.

2. ASSUMPTION OF RISK

I, the undersigned participant (or the parent/legal guardian completing this waiver on behalf of the minor participant named above), freely, voluntarily, and without inducement acknowledge and assume all risks of injury, illness, or death associated with my participation in the Beat The Wave Dragon Boat Festival (the "Event"), including those risks described in Section 1 and any other risks not specifically mentioned herein.

I understand that the Event takes place on open water and that conditions may be unpredictable. I confirm that I am in adequate physical condition to safely participate. I accept full responsibility for my own safety and well-being during the Event.

3. WAIVER AND RELEASE OF LIABILITY

In consideration of being permitted to participate in the Event, I hereby release, waive, discharge, and covenant not to sue Beat The Wave, its directors, officers, employees, volunteers, sponsors, partners, venue owners, and all other associated persons and entities (collectively, the "Released Parties") from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, injury, illness, or death that may be sustained by me during, or arising out of, my participation in the Event, including losses caused by the negligence (including gross negligence) of the Released Parties.

4. INDEMNIFICATION

I agree to indemnify and hold harmless the Released Parties against any and all claims, suits, losses, liabilities, damages, costs, and expenses (including legal fees) brought by third parties arising out of my participation in the Event or my breach of this Agreement.

5. MEDICAL CONDITIONS AND AUTHORITY TO TREAT

I represent that I am in suitable physical and mental condition to participate in the Event. I have not been advised by a physician to refrain from the activities associated with dragon boating. I authorize the Released Parties to seek emergency medical treatment on my behalf if I am unable to do so myself, and I agree to pay all costs associated with such treatment.

6. RULES AND SAFETY

I agree to comply with all Event rules, instructions, and safety directives issued by officials, coaches, and organizers. I understand that failure to comply may result in removal from the Event without refund.

7. PHOTOGRAPHY AND MEDIA CONSENT

I grant the Released Parties an irrevocable, royalty-free, worldwide license to photograph, film, and record me during the Event and to use, reproduce, distribute, and display such materials in any media for promotional, educational, commercial, or any other lawful purpose, without further compensation or notification.

8. COVID-19 AND COMMUNICABLE DISEASE ACKNOWLEDGEMENT

I acknowledge that participation in any group outdoor event carries a risk of exposure to communicable diseases, including COVID-19. I voluntarily assume that risk and agree to comply with all applicable public health guidelines and Event health protocols.

9. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the Province of British Columbia and the applicable laws of Canada. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of British Columbia.

10. SEVERABILITY

If any provision of this Agreement is found to be unenforceable or invalid, the remaining provisions shall continue in full force and effect.

11. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior negotiations, representations, or agreements, whether written or oral.

12. ACKNOWLEDGEMENT OF UNDERSTANDING

I HAVE READ THIS ENTIRE DOCUMENT. I UNDERSTAND ITS CONTENTS AND ACKNOWLEDGE THAT BY SIGNING BELOW I AM GIVING UP SUBSTANTIAL RIGHTS, INCLUDING THE RIGHT TO SUE THE RELEASED PARTIES. I AM SIGNING THIS AGREEMENT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT. I INTEND THIS TO BE A FULL AND FINAL RELEASE OF ALL LIABILITY TO THE GREATEST EXTENT PERMITTED BY LAW.`

const WAIVER_FR = `DÉCHARGE DE RESPONSABILITÉ, RENONCIATION AUX RÉCLAMATIONS, ACCEPTATION DES RISQUES ET ACCORD D'INDEMNISATION

Festival de pirogue Beat The Wave

Veuillez lire l'intégralité de ce document attentivement avant de le signer.

1. NATURE DE L'ACTIVITÉ

La pratique de la pirogue est un sport d'équipe nautique physiquement exigeant comportant des risques inhérents et significatifs. Ces risques comprennent, sans s'y limiter : noyade, quasi-noyade, hypothermie, chavirement, collision avec d'autres embarcations ou obstacles fixes, effort excessif, blessures corporelles (y compris fractures, entorses, commotions cérébrales et blessures rachidiennes) et décès. Ces risques existent indépendamment des précautions prises par les organisateurs, officiels ou autres participants.

2. ACCEPTATION DES RISQUES

Je soussigné(e), participant(e) (ou parent/tuteur légal complétant cette décharge au nom du participant mineur nommé ci-dessus), reconnais librement, volontairement et sans contrainte, et assume tous les risques de blessure, maladie ou décès associés à ma participation au Festival de pirogue Beat The Wave (l'« Événement »), y compris les risques décrits à l'article 1 et tout autre risque non spécifiquement mentionné dans le présent document.

Je comprends que l'Événement se déroule en eau libre et que les conditions peuvent être imprévisibles. Je confirme être en condition physique adéquate pour participer en toute sécurité. J'accepte l'entière responsabilité de ma propre sécurité et de mon bien-être pendant l'Événement.

3. RENONCIATION ET DÉCHARGE DE RESPONSABILITÉ

En contrepartie de ma participation à l'Événement, je décharge, libère, exonère et renonce à tout recours contre Beat The Wave, ses administrateurs, dirigeants, employés, bénévoles, commanditaires, partenaires, propriétaires de lieux et toutes autres personnes et entités associées (collectivement, les « Parties libérées ») de toute responsabilité, réclamation, demande, action ou cause d'action découlant de ou liée à toute perte, dommage, blessure, maladie ou décès que je pourrais subir pendant, ou découlant de, ma participation à l'Événement, y compris les pertes causées par la négligence (y compris la négligence grossière) des Parties libérées.

4. INDEMNISATION

Je m'engage à indemniser et à dégager les Parties libérées de toute réclamation, poursuite, perte, responsabilité, dommage, coût et dépense (y compris les honoraires d'avocat) présentés par des tiers découlant de ma participation à l'Événement ou du non-respect du présent Accord.

5. CONDITIONS MÉDICALES ET AUTORISATION DE TRAITEMENT

Je déclare être en condition physique et mentale appropriée pour participer à l'Événement. Aucun médecin ne m'a déconseillé de pratiquer les activités associées à la pirogue. J'autorise les Parties libérées à chercher un traitement médical d'urgence en mon nom si je suis dans l'incapacité de le faire moi-même, et j'accepte d'assumer tous les coûts associés à ce traitement.

6. RÈGLEMENT ET SÉCURITÉ

J'accepte de me conformer à toutes les règles de l'Événement, instructions et directives de sécurité émises par les officiels, entraîneurs et organisateurs. Je comprends que le non-respect de ces règles peut entraîner mon exclusion de l'Événement sans remboursement.

7. CONSENTEMENT À LA PHOTOGRAPHIE ET AUX MÉDIAS

J'accorde aux Parties libérées une licence irrévocable, libre de redevances et mondiale pour me photographier, me filmer et m'enregistrer pendant l'Événement et pour utiliser, reproduire, distribuer et afficher ces documents dans tout média à des fins promotionnelles, éducatives, commerciales ou à toute autre fin légale, sans compensation supplémentaire ni notification.

8. RECONNAISSANCE CONCERNANT LA COVID-19 ET LES MALADIES TRANSMISSIBLES

Je reconnais que la participation à tout événement de groupe en plein air comporte un risque d'exposition à des maladies transmissibles, y compris la COVID-19. J'assume volontairement ce risque et accepte de me conformer à toutes les directives de santé publique applicables et aux protocoles sanitaires de l'Événement.

9. LOI APPLICABLE

Le présent Accord est régi et interprété conformément aux lois de la province de Colombie-Britannique et aux lois applicables du Canada. Tout litige découlant des présentes sera soumis à la compétence exclusive des tribunaux de la Colombie-Britannique.

10. DIVISIBILITÉ

Si une disposition du présent Accord est jugée inapplicable ou invalide, les dispositions restantes continueront à être pleinement en vigueur.

11. INTÉGRALITÉ DE L'ACCORD

Le présent Accord constitue l'entente intégrale entre les parties concernant son objet et remplace toutes négociations, représentations ou ententes antérieures, qu'elles soient écrites ou verbales.

12. RECONNAISSANCE DE COMPRÉHENSION

J'AI LU L'INTÉGRALITÉ DU PRÉSENT DOCUMENT. J'EN COMPRENDS LE CONTENU ET RECONNAIS QU'EN SIGNANT CI-DESSOUS, JE RENONCE À DES DROITS SUBSTANTIELS, Y COMPRIS LE DROIT DE POURSUIVRE LES PARTIES LIBÉRÉES. JE SIGNE LE PRÉSENT ACCORD LIBREMENT ET VOLONTAIREMENT SANS AUCUNE CONTRAINTE. J'ENTENDS QUE CECI CONSTITUE UNE DÉCHARGE COMPLÈTE ET DÉFINITIVE DE TOUTE RESPONSABILITÉ DANS TOUTE LA MESURE PERMISE PAR LA LOI.`

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

  const InputField = ({ label, type = 'text', field, required = true, placeholder, className = '' }) => (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}{required && <span className="text-pink-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => setField(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm bg-white"
      />
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────────────────────────────────
  if (statusLoading) {
    return (
      <OverlayShell onClose={onClose} canClose={true} title="Waiver" step={null}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
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
          <button onClick={onClose} className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm">Close</button>
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
          <button onClick={onClose} className="mt-2 px-5 py-2 rounded-full bg-slate-900 text-white text-sm">Close</button>
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
          <button onClick={onClose} className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm">Close</button>
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
              <InputField label="First Name" field="firstName" />
              <InputField label="Last Name" field="lastName" />
              <InputField label="Email" type="email" field="email" />
              <InputField label="Phone Number" type="tel" field="phone" placeholder="e.g. 6041234567" />
              <div className="sm:col-span-2">
                <InputField label="Date of Birth" type="date" field="dateOfBirth" required={false} />
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
                <InputField label="Parent/Guardian Full Name" field="parentGuardianName" className="sm:col-span-2" />
                <InputField label="Parent/Guardian Phone" type="tel" field="parentGuardianPhone" />
                <InputField label="Parent/Guardian Email" type="email" field="parentGuardianEmail" />
              </div>
            </section>
          )}

          {/* Emergency Contact */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Emergency Contact Name" field="emergencyContactName" />
              <InputField label="Emergency Contact Phone" type="tel" field="emergencyContactPhone" />
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
                Preferred Paddling Side<span className="text-pink-500 ml-0.5">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {['left', 'right', 'ambidextrous', 'unknown'].map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setField('paddlingSide', side)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors capitalize ${
                      formData.paddlingSide === side
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300'
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
                Experienced Paddler?<span className="text-pink-500 ml-0.5">*</span>
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
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      formData.isExperienced === value
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300'
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
                  Years of Experience<span className="text-pink-500 ml-0.5">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.yearsOfExperience}
                  onChange={(e) => setField('yearsOfExperience', e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm bg-white"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm bg-white resize-none"
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
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  language === lang
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
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
              className="mt-0.5 w-4 h-4 accent-pink-600 flex-shrink-0 cursor-pointer"
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
              <span className="text-pink-500 ml-0.5">*</span>
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
                Parent / Guardian Signature<span className="text-pink-500 ml-0.5">*</span>
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isStep4CanSubmit()}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-auto"
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={canClose ? onClose : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Waiver</p>
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
                      s <= step ? 'bg-pink-500' : 'bg-slate-200'
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-auto"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
