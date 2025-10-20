"use client"
import React from 'react'
import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false })

export default function WorldMapClient(props: { allowedStatuses?: string[]; allowedServiceIds?: string[] }) {
  return <WorldMap {...props} />
}


