import React from 'react'

export function Card({ children, className = '', ...props }) {
  return (
    <div {...props} className={`rounded-xl ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Card
