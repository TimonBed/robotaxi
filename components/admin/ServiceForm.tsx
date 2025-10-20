"use client"
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  mode: 'create' | 'edit'
  serviceId?: string
  initial: {
    name: string
    operator: string
    website?: string | null
    colorHex: string
    status: string
    launchedAt?: string | null
    notes?: string | null
  }
}

const STATUS_OPTIONS = ['trial','pilot','limited','full','paused']

export default function ServiceForm({ mode, serviceId, initial }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initial.name)
  const [operator, setOperator] = useState(initial.operator)
  const [website, setWebsite] = useState(initial.website ?? '')
  const [colorHex, setColorHex] = useState(initial.colorHex)
  const [status, setStatus] = useState(initial.status)
  const [launchedAt, setLaunchedAt] = useState(initial.launchedAt ?? '')
  const [notes, setNotes] = useState(initial.notes ?? '')
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  function onSubmit() {
    setMsg(null)
    startTransition(async () => {
      try {
        const url = mode === 'create' ? '/api/services' : `/api/services/${serviceId}`
        const method = mode === 'create' ? 'POST' : 'PATCH'
        const body = {
          name,
          operator,
          website: website || null,
          colorHex,
          status,
          launchedAt: launchedAt || null,
          notes: notes || null
        }
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (!res.ok) {
          const t = await res.text()
          setMsg(`Save failed: ${t || res.status}`)
          return
        }
        setMsg('Saved')
      } catch (e: any) {
        setMsg(`Save failed: ${e?.message ?? 'unknown error'}`)
      }
    })
  }

  function onDelete() {
    if (mode !== 'edit' || !serviceId) return
    const confirmed = window.confirm('Delete this service? This cannot be undone.')
    if (!confirmed) return
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })
        if (!res.ok) {
          const t = await res.text()
          setMsg(`Delete failed: ${t || res.status}`)
          return
        }
        router.push('/admin/services')
      } catch (e: any) {
        setMsg(`Delete failed: ${e?.message ?? 'unknown error'}`)
      }
    })
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-3">
        <input className="rounded bg-gray-800 p-2 text-sm" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="rounded bg-gray-800 p-2 text-sm" placeholder="Operator" value={operator} onChange={e => setOperator(e.target.value)} />
        <input className="rounded bg-gray-800 p-2 text-sm" placeholder="Website (https://...)" value={website} onChange={e => setWebsite(e.target.value)} />
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <input className="h-8 w-16 rounded bg-gray-800 p-1 text-sm" value={colorHex} onChange={e => setColorHex(e.target.value)} />
          <span className="inline-block h-6 w-6 rounded" style={{ background: colorHex }} />
        </div>
        <select className="rounded bg-gray-800 p-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="rounded bg-gray-800 p-2 text-sm" type="date" value={launchedAt ?? ''} onChange={e => setLaunchedAt(e.target.value)} />
      </div>
      <textarea className="h-28 rounded bg-gray-800 p-2 text-sm" placeholder="Notes" value={notes ?? ''} onChange={e => setNotes(e.target.value)} />
      <div className="flex items-center gap-3">
        <button onClick={onSubmit} disabled={isPending} className="rounded bg-sky-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
          {isPending ? 'Saving…' : (mode === 'create' ? 'Create service' : 'Save changes')}
        </button>
        {mode === 'edit' && (
          <button onClick={onDelete} disabled={isPending} className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
            Delete service
          </button>
        )}
        {msg && <span className="text-sm text-gray-300">{msg}</span>}
      </div>
    </div>
  )
}


