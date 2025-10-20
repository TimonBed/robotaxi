"use client"
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { redirect: false, email, password })
    if (res?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/admin')
    }
  }

  return (
    <main className="mx-auto max-w-sm">
      <h1 className="mb-4 text-lg font-semibold">Admin Sign In</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="rounded bg-gray-800 p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="rounded bg-gray-800 p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button className="rounded bg-sky-500 px-3 py-2 text-sm font-medium text-white" type="submit">Sign In</button>
      </form>
    </main>
  )
}


