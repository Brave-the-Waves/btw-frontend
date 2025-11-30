import React from 'react'

export default function Button({ children, className = '', size, variant, ...props }) {
  const sizes = {
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  }
  const sizeClass = size ? sizes[size] : ''
  return (
    <button {...props} className={`${sizeClass} ${className}`.trim()}>
      {children}
    </button>
  )
}
