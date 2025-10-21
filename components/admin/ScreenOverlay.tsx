"use client"
import React from 'react'

type Props = {
  url: string | null
  opacity?: number
  scale?: number
  rotationDeg?: number
}

export default function ScreenOverlay({ url, opacity = 0.5, scale = 1, rotationDeg = 0 }: Props) {
  if (!url) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50
      }}
    >
      <img
        src={url}
        alt="overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${rotationDeg}deg) scale(${scale})`,
          opacity,
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      />
    </div>
  )
}



