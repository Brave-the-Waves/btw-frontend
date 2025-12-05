import React from 'react'

export function Input({ className, ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-slate-100 rounded-md outline-none transition-colors ${className || ''}`}
      {...props}
    />
  )
}

export default Input
