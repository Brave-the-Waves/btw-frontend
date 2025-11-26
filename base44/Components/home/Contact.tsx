import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Contact{' '}
            <span className="text-pink-500">Us</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Let's Connect</h3>
              <p className="text-slate-600 leading-relaxed">
                Whether you're interested in volunteering, sponsoring, or just want to learn more 
                about our mission, we're here to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="text-slate-600">info@bravethewaves.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Phone</p>
                  <p className="text-slate-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Address</p>
                  <p className="text-slate-600">Harbor Marina Park<br />123 Waterfront Blvd</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="font-semibold text-slate-900 mb-4">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="w-11 h-11 rounded-full bg-slate-200 hover:bg-pink-500 flex items-center justify-center transition-colors group">
                  <Facebook className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-slate-200 hover:bg-pink-500 flex items-center justify-center transition-colors group">
                  <Instagram className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-slate-200 hover:bg-pink-500 flex items-center justify-center transition-colors group">
                  <Twitter className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100 border border-slate-100">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="subject" className="text-slate-700">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="message" className="text-slate-700">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="rounded-xl border-slate-200 focus:border-pink-500 focus:ring-pink-500 resize-none"
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-pink-200 transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
