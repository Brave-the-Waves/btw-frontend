import React from 'react'

// Controlled checkbox component.
// Props:
// - label: string
// - isChecked: boolean
// - setIsChecked: function(nextChecked)
const Checkbox = ({ label, isChecked, setIsChecked }) => {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />

      <span
        className={`w-5 h-5 flex items-center justify-center rounded-md border transition-colors flex-shrink-0 ${isChecked ? 'bg-pink-500 border-pink-500' : 'bg-white border-slate-300 hover:border-slate-400'}`}
      >
        {isChecked && (
          <span className="text-white text-xs font-bold">✓</span>
        )}
      </span>

      <span className="sm:text-sm text-gray-400">{label}</span>
    </label>
  )
}

export default Checkbox