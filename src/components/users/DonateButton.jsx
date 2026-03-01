import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/button'

export default function DonateButton({ donationId, userName, variant = "default", size = "default", className = "" }) {
  const navigate = useNavigate()
  const firstName = userName ? userName.split(' ')[0] : 'Paddler'
  const compactName = firstName.length > 14 ? `${firstName.slice(0, 14)}…` : firstName

  const handleDonateClick = () => {
    if (!donationId) return
    
    // Navigate to home page with donation ID as URL parameter
    navigate(`/?donationId=${encodeURIComponent(donationId)}&name=${encodeURIComponent(userName || '')}#donate`)
    
    // Scroll to donate section after navigation
    setTimeout(() => {
      const donateSection = document.getElementById('donate')
      if (donateSection) {
        donateSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  if (!donationId) return null

  return (
    <Button
      onClick={handleDonateClick}
      variant={variant}
      size={size}
      className={`w-full sm:w-auto inline-flex items-center justify-center bg-[#fc87a7] hover:bg-[#c14a75] text-white px-3 sm:px-4 py-2.5 text-sm sm:text-base cursor-pointer font-semibold transition-all hover:shadow-lg hover:shadow-[#fc87a7]/30 ${className}`}
    >
      <Heart className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className="sm:hidden">Donate</span>
      <span className="hidden sm:inline truncate">Donate to {compactName}</span>
    </Button>
  )
}
