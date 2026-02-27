import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import emailjs from '@emailjs/browser'
import Media from './Media'
import SubmissionForm from './SubmissionForm'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  const handleClose = async (e) => {
    setIsSuccess(false)
    setIsFailure(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'bravethewaves.braverlesvagues@gmail.com'
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      setIsSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Failed to send email:', error)
      setIsFailure(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-white">
      <AnimatePresence>
        {(isSuccess || isFailure) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center relative"
            >
              <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
                </>
              ) : (
                <>
                  <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Couldn't Send Message</h3>
                  <p className="text-slate-500 text-sm">We're having trouble sending your email right now. Please try again later or reach out to us directly.</p>
                </>
              )}
              <button onClick={handleClose} className="mt-6 px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
                {isSuccess ? 'Done' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#fc87a7]/10 text-[#fc87a7] text-sm font-medium mb-6">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contact <span className="text-[#fc87a7]">Us</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Have questions? We'd love to hear from you</p>
        </motion.div>
        <div className="mb-10">
          <Media />
        </div>
        <SubmissionForm
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  )
}
