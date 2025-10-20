"use client"
import React from 'react'

export default function Legend({ services }: { services: { id: string; name: string; colorHex: string }[] }) {
  return (
    <div className="pointer-events-auto absolute bottom-3 left-3 z-10 rounded bg-gray-900/90 p-2 text-xs shadow">
      <div className="mb-1 text-gray-300">Services</div>
      <div className="grid gap-1">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded" style={{ background: s.colorHex }} />
            <span className="text-gray-200">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


