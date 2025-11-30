import React from 'react'

export function Label({ children, ...props }) {
  return (
    <label {...props} className={props.className}>
      {children}
    </label>
  )
}

export default Label
