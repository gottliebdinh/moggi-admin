'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { WifiOff, LogOut } from 'lucide-react'

const navigation = [
  { name: 'Bestellungen', href: '/orders' },
  { name: 'Reservierungen', href: '/reservations' },
  { name: 'Tischplan', href: '/tables' },
  { name: 'Einstellungen', href: '/settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Trotzdem weiterleiten
      router.push('/login')
    }
  }

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#2D2D2D' }}>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="sticky top-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Offline - Daten sind möglicherweise nicht aktuell</span>
        </div>
      )}
      
      {/* Header & Navigation Combined - Responsive */}
      <div className="container mx-auto px-2 sm:px-4 py-2">
        <div 
          className="rounded-2xl p-4 sm:p-6 mb-2"
          style={{ 
            backgroundColor: '#1A1A1A',
            borderWidth: '1px',
            borderColor: '#242424'
          }}
        >
          {/* Header Section - Responsive */}
          <div className="mb-2 flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-1 text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>MOGGI Admin</h1>
              <div className="w-12 sm:w-16 h-1 rounded mb-1" style={{ backgroundColor: '#FF6B00' }}></div>
              <p className="text-white text-xs sm:text-sm">Restaurant Management System</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 hover:opacity-80 text-xs sm:text-sm font-medium"
              style={{ backgroundColor: '#242424', color: '#FF6B00' }}
              title="Abmelden"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>

          {/* Navigation Section - Responsive */}
          <nav className="flex gap-2 sm:gap-3 flex-wrap border-t pt-3" style={{ borderColor: '#242424' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-medium text-xs sm:text-sm ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: pathname === item.href ? '#FF6B00' : '#242424',
                  fontFamily: 'Georgia',
                  fontWeight: pathname === item.href ? '600' : '300',
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <main className="container mx-auto px-2 sm:px-4 py-2">
        {children}
      </main>

      {/* Footer - Responsive */}
      <footer className="mt-8 sm:mt-16" style={{ backgroundColor: '#2D2D2D', borderTop: '1px solid #242424' }}>
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 text-center text-gray-300">
          <p className="text-xs sm:text-sm" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Made with <span style={{ color: '#FF0000' }}>♥</span> by Gottlieb Dinh</p>
        </div>
      </footer>
    </div>
  )
}
