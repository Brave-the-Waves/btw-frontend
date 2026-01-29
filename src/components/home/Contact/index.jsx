import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import emailjs from '@emailjs/browser'
import Media from './Media'
import SubmissionForm from './SubmissionForm'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace these with your actual EmailJS credentials
      const serviceId = 'YOUR_SERVICE_ID'
      const templateId = 'YOUR_TEMPLATE_ID'
      const publicKey = 'YOUR_PUBLIC_KEY'

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'bravethewaves.braverlesvagues@gmail.com'
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      
      toast.success("Message sent! We'll get back to you soon.")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-white">
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
