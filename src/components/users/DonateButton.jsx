import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/button'

export default function DonateButton({ donationId, userName, variant = "default", size = "default", className = "" }) {
  const navigate = useNavigate()

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
      className={`bg-[#fa6090] hover:bg-[#f94f85] text-white px-4 py-2 cursor-pointer ${className}`}
    >
      <Heart className="w-4 h-4 mr-2" />
      Donate to {userName ? userName.split(' ')[0] : 'Paddler'}
    </Button>
  )
}
