import React from 'react'

export default function Button({ children, className = '', size, variant, ...props }) {
  const sizes = {
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  }
  const sizeClass = size ? sizes[size] : 'px-4 py-2'
  return (
    <button {...props} className={`flex items-center justify-center ${sizeClass} ${className}`.trim()}>
      {children}
    </button>
  )
}
