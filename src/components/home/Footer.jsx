import React from 'react'
import { Heart, Waves, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  event: [
    { label: 'About', href: '#about' },
    { label: 'Event Info', href: '#event' },
    { label: 'Past Events', href: '#past-events' },
    { label: 'Team', href: '#team' },
  ],
  getInvolved: [
    { label: 'Donate', href: '#donate' },
    { label: 'Register Team', href: '#donate' },
    { label: 'Volunteer', href: '#contact' },
    { label: 'Sponsor', href: '#contact' },
  ],
  // resources: [
  //   { label: "Women's Health Info", href: '#' },
  //   { label: 'Dragon Boat Club', href: '#' },
  //   { label: 'FAQs', href: '#' },
  //   { label: 'Privacy Policy', href: '#' },
  // ],
}

export default function Footer() {
  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fc87a7] to-[#fc87a7]/90 flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Brave the Waves</span>
                <p className="text-xs text-slate-400">Dragon Boat for Women's Health</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">An annual dragon boat charity event raising awareness and funds for women's health initiatives. Paddle with purpose.</p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/bravethewaves_/" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#fc87a7] flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.facebook.com/profile.php?id=61584454839823" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#fc87a7] flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Event</h4>
            <ul className="space-y-3">
              {footerLinks.event.map((link) => (
                <li key={link.label}><button onClick={() => scrollToSection(link.href)} className="text-slate-400 hover:text-[#fc87a7] transition-colors cursor-pointer">{link.label}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Get Involved</h4>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.label}><button onClick={() => scrollToSection(link.href)} className="text-slate-400 hover:text-[#fc87a7] transition-colors cursor-pointer">{link.label}</button></li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}><button onClick={() => scrollToSection(link.href)} className="text-slate-400 hover:text-[#fc87a7] transition-colors">{link.label}</button></li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Brave the Waves. All rights reserved.</p>
          <p className="text-slate-500 text-sm flex items-center gap-2">Made with <Heart className="w-4 h-4 text-[#fc87a7]" /> for women's health</p>
        </div>
      </div>
    </footer>
  )
}
