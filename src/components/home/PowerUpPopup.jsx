import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeDollarSign, Gift, Sparkles, X } from 'lucide-react'

function getEasternDateParts(date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  }
}

function isPowerUpEventActive(now = new Date()) {
  const eastern = getEasternDateParts(now)
  const currentDate = `${eastern.year}-${String(eastern.month).padStart(2, '0')}-${String(eastern.day).padStart(2, '0')}`

  return currentDate >= '2026-06-26' && currentDate <= '2026-06-28'
}

export default function PowerUpPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(isPowerUpEventActive())
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff8a5b] via-[#fc87a7] to-[#ffcf72] opacity-95" />
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <div className="relative p-6 text-white sm:p-8">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Close power up announcement"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Power Up Event
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/20">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">POWER UP!</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/95 sm:text-base">
                  This weekend, June 27th and June 28th EST, every donation will be matched by our organization.
                  Every $1 becomes $2 for MTAC, with WHAM and CsBUM matching every dollar up to $4K.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm ring-1 ring-white/15">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BadgeDollarSign className="h-4 w-4" />
                  Raise it. Match it. Win it.
                </div>
                <p className="mt-2 text-sm text-white/90">
                  The more you donate, the more raffle entries you earn.
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm ring-1 ring-white/15">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Tax receipts
                </div>
                <p className="mt-2 text-sm text-white/90">
                  Tax receipts will be issued after the event.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}