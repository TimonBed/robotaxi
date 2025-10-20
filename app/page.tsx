import React from 'react'
import Link from 'next/link'
import { GlobeAltIcon, MapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <main className="grid gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">RobotaxiMap — the live map of autonomous ride coverage</h1>
          <p className="text-sm leading-6 text-gray-300 md:text-base">
            Track where robotaxi services operate today. Explore colored geofences, compare operators, and see rollout momentum — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/map" className="rounded bg-sky-500 px-5 py-2 text-sm font-medium text-white hover:bg-sky-400">Open Coverage Map</Link>
            <Link href="/services" className="rounded border border-gray-700 px-5 py-2 text-sm text-gray-200 hover:border-gray-600">Browse Services</Link>
            <Link href="/admin" className="rounded border border-gray-700 px-5 py-2 text-sm text-gray-200 hover:border-gray-600">Admin</Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl md:h-96 md:w-96" />
      </section>

      {/* Feature highlights */}
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Why RobotaxiMap</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-200"><MapIcon className="h-5 w-5" /><span className="text-sm font-medium">Interactive coverage</span></div>
            <p className="text-sm text-gray-400">Explore geofences per service with smooth filters for status and provider.</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-200"><GlobeAltIcon className="h-5 w-5" /><span className="text-sm font-medium">Global overview</span></div>
            <p className="text-sm text-gray-400">See total world coverage and population reach with overlap-aware area math.</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-200"><ShieldCheckIcon className="h-5 w-5" /><span className="text-sm font-medium">Curated & auditable</span></div>
            <p className="text-sm text-gray-400">Built-in admin tools to add services, draw polygons, and review changes.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">How it works</h2>
        <ol className="grid gap-4 text-sm md:grid-cols-3">
          <li className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="mb-1 text-gray-300">1. Pick services</div>
            <p className="text-gray-400">Choose one or more operators and rollout statuses to focus the map.</p>
          </li>
          <li className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="mb-1 text-gray-300">2. Inspect geofences</div>
            <p className="text-gray-400">Hover to see area, click for details, and compare coverage side-by-side.</p>
          </li>
          <li className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="mb-1 text-gray-300">3. Keep current</div>
            <p className="text-gray-400">Admins update polygons and services as deployments evolve.</p>
          </li>
        </ol>
        <div className="mt-4">
          <Link href="/map" className="text-sm text-sky-400 hover:underline">Jump to the live map →</Link>
        </div>
      </section>

      {/* SEO text block */}
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-2 text-lg font-semibold">Robotaxi coverage and rollout tracking</h2>
        <p className="max-w-3xl text-sm leading-6 text-gray-300">
          RobotaxiMap consolidates autonomous ride service coverage into a single, interactive view. Our geofence overlays highlight where services operate today, and our overlap-aware metrics summarize total area and potential reach. Whether you’re a city planner, investor, or enthusiast, RobotaxiMap helps you understand progress at a glance.
        </p>
      </section>

      {/* Footer mini */}
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
          <div>© {new Date().getFullYear()} RobotaxiMap</div>
          <div className="flex items-center gap-4">
            <Link href="/map" className="hover:text-gray-200">Map</Link>
            <Link href="/services" className="hover:text-gray-200">Services</Link>
            <Link href="/admin" className="hover:text-gray-200">Admin</Link>
          </div>
        </div>
      </section>
    </main>
  )
}


