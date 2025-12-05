import { motion } from 'framer-motion'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Textarea from '@/components/ui/textarea'
import { Send } from 'lucide-react'

export default function SubmissionForm( { formData, setFormData, isSubmitting, handleSubmit } ) {
    return (
        <>
            <div className="grid lg:grid-cols-5 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-8">
                <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Let's Connect</h3>
                <p className="text-slate-600 leading-relaxed">Whether you're interested in volunteering, sponsoring, or just want to learn more about our mission, we're here to help.</p>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100 border border-slate-100">
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-4">
                    <Label htmlFor="name" className="text-slate-700 whitespace-nowrap">Name</Label>
                    <Input id="name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500 flex-1" />
                    </div>
                    <div className="flex items-center gap-4">
                    <Label htmlFor="email" className="text-slate-700 whitespace-nowrap">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500 flex-1" />
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <Label htmlFor="subject" className="text-slate-700 whitespace-nowrap">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500 flex-1" />
                </div>

                <div className="space-y-2 mb-6">
                    <Label htmlFor="message" className="text-slate-700 mr-2">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500 resize-none" />
                </div>

                <Button type="submit" disabled={isSubmitting} size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl py-3 text-lg shadow-lg shadow-pink-200 transition-all hover:scale-[1.01] cursor-pointer">
                    {isSubmitting ? (
                    <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                    ) : (
                    <span className="flex items-center gap-2"><Send className="w-5 h-5" />Send Message</span>
                    )}
                </Button>
                </form>
            </motion.div>
            </div>
        </>
    )
}