import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, Waves, Heart, ChevronDown } from 'lucide-react'

const homeSections = [
  { label: 'Home', href: 'home' },
  { label: 'About', href: 'about' },
  { label: 'Event', href: 'event' },
  { label: 'Past Events', href: 'past-events' },
  { label: 'The Crew', href: 'team' },
  { label: 'Donate', href: 'donate' },
  { label: 'Contact', href: 'contact' },
]

const navLinks = [
  { label: 'Teams', href: '/teams', isRoute: true },
  { label: 'Leaderboard', href: '/leaderboard', isRoute: true },
  { label: 'Participants', href: '/participants', isRoute: true },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWindowScrolled, setIsWindowScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  const isScrolled = isWindowScrolled || location.pathname !== '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsWindowScrolled(window.scrollY > 50)
      // Only check sections if we are on the home page
      if (location.pathname === '/') {
        const sections = homeSections.map((link) => link.href)

        // First try: find the deepest section whose top is <= threshold
        let found = null
        for (const section of sections.slice().reverse()) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= 150) {
              found = section
              break
            }
          }
        }

        // Fallback: if none are above the threshold, pick the first section that exists in the DOM
        if (!found) {
          for (const section of sections) {
            if (document.getElementById(section)) {
              found = section
              break
            }
          }
        }

        if (found){
          setActiveSection(found)
        } else {
          setActiveSection(null)
        }
      } else {
        setActiveSection(null)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const handleNavigation = (link) => {
    if (link.isRoute) {
      navigate(link.href)
    } else {
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: link.href } })
      } else {
        document.getElementById(link.href)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  // Handle scroll after navigation from another page
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100) // Small delay to ensure DOM is ready
        // Clear state
        window.history.replaceState({}, document.title)
      }
    }
  }, [location])

  const navBarClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
  }`

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={navBarClasses}
      >
        <div className="max-w-[95%] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-[#fc87a7] hover:bg-[#c14a75]">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className={`text-lg font-bold transition-colors ${isScrolled ? 'text-slate-900' : 'text-slate-600'}`}>
                Brave the Waves
              </span>
            </button>

            <div className="hidden xl:flex items-center gap-2">
              {/* Home Sections Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    activeSection && location.pathname === '/'
                      ? isScrolled ? 'bg-[#fc87a7]/10 text-[#fc87a7]' : 'bg-white/20 text-slate-600 hover:text-white'
                      : isScrolled ? 'text-slate-600 hover:text-[#fc87a7] hover:bg-[#fc87a7]/5' : 'text-slate-600 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 overflow-hidden"
                    >
                      {homeSections.map((link) => {
                        const isActive = activeSection === link.href
                        return (
                          <button
                            key={link.label}
                            onClick={() => {
                              handleNavigation(link)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                              isActive ? 'bg-[#fc87a7]/10 text-[#fc87a7]' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {link.label}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Navigation Links */}
              {navLinks.map((link) => {
                const inactiveClass = isScrolled ? 'text-slate-600 hover:text-[#fc87a7] hover:bg-[#fc87a7]/5' : 'text-slate-600 hover:text-white hover:bg-white/10'

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavigation(link)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${inactiveClass}`}
                  >
                    {link.label}
                  </button>
                )
              })}
            </div>

            <div className="hidden xl:flex items-center gap-3 ml-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/profile')} className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${isScrolled ? 'text-slate-700 hover:text-[#fc87a7]' : 'text-slate-600 hover:text-[#fc87a7]/80'}`}>
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>{user.name}</span>
                  </button>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/login')}
                  className={`shadow-lg whitespace-nowrap ${isScrolled ? 'bg-slate-600 text-white hover:bg-slate-700 rounded-full px-5' : 'bg-white/10 text-slate-600 hover:bg-white/20 backdrop-blur border border-slate-600/20 rounded-full px-5'}`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              )}
              
              <Button 
                onClick={() => {
                  if (location.pathname !== '/') {
                    navigate('/', { state: { scrollTo: 'donate' } })
                  } else {
                    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-full px-6"
              >
                <Heart className="w-4 h-4 mr-2" />
                Donate or Register
              </Button>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className={`xl:hidden p-2 rounded-xl transition-colors cursor-pointer ${isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-600 hover:bg-black/10'}`}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 xl:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl">
              <div className="p-6 pt-24">
                <div className="space-y-2">
                  {/* Home Sections Group */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">
                      Home Sections
                    </div>
                    {homeSections.map((link) => (
                      <button 
                        key={link.label} 
                        onClick={() => handleNavigation(link)} 
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                          activeSection === link.href 
                            ? 'bg-[#fc87a7]/10 text-[#fc87a7]' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>

                  {/* Other Links */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">
                      Pages
                    </div>
                    {navLinks.map((link) => (
                      <button 
                        key={link.label} 
                        onClick={() => handleNavigation(link)} 
                        className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <button onClick={() => { navigate('/profile'); setIsOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 cursor-pointer">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        My Profile
                      </button>
                    </>
                  ) : (
                    <Button 
                      className="w-full justify-center bg-slate-900 text-white"
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                    ><User className="w-4 h-4 mr-2" />
                      Log In
                    </Button>
                  )}
                  
                  <Button onClick={() => {
                    if (location.pathname !== '/') {
                      navigate('/', { state: { scrollTo: 'donate' } })
                    } else {
                      document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    setIsOpen(false)
                  }} className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-xl py-4">
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
