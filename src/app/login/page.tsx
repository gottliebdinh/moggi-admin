'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Prüfe ob bereits eingeloggt
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        router.push('/orders')
      }
    } catch (error) {
      // Nicht eingeloggt, Login-Seite anzeigen
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Erfolgreich eingeloggt, weiterleiten
        router.push('/orders')
        router.refresh()
      } else {
        setError(data.error || 'Falsches Passwort')
      }
    } catch (error) {
      setError('Fehler beim Anmelden. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2D2D2D' }}>
      <div className="w-full max-w-md p-8">
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#1A1A1A', borderWidth: '1px', borderColor: '#242424' }}>
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#FF6B00' }}>
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>
              MOGGI Admin
            </h1>
            <div className="w-16 h-1 rounded mx-auto mb-2" style={{ backgroundColor: '#FF6B00' }}></div>
            <p className="text-gray-400 text-sm">Bitte melden Sie sich an</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-500 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 transition-all duration-300"
                style={{ backgroundColor: '#242424' }}
                placeholder="Passwort eingeben"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm text-red-400" style={{ backgroundColor: '#3F1F1F', borderWidth: '1px', borderColor: '#EF4444' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FF6B00', fontSize: '16px', fontWeight: '600' }}
            >
              {isLoading ? 'Anmeldung...' : 'Anmelden'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

