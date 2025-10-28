'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

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
  const [isOnline, setIsOnline] = useState(true)

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
      
      {/* Header & Navigation Combined */}
      <div className="container mx-auto px-4 py-2">
        <div 
          className="rounded-2xl p-6 mb-2"
          style={{ 
            backgroundColor: '#1A1A1A',
            borderWidth: '1px',
            borderColor: '#242424'
          }}
        >
          {/* Header Section */}
          <div className="mb-2">
            <h1 className="text-4xl font-light mb-1 text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>MOGGI Admin</h1>
            <div className="w-16 h-1 rounded mb-1" style={{ backgroundColor: '#FF6B00' }}></div>
            <p className="text-white text-sm">Restaurant Management System</p>
          </div>

          {/* Navigation Section */}
          <nav className="flex gap-3 flex-wrap border-t pt-3" style={{ borderColor: '#242424' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: pathname === item.href ? '#FF6B00' : '#242424',
                  fontFamily: 'Georgia',
                  fontWeight: pathname === item.href ? '600' : '300',
                  fontSize: '16px'
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-2">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2D2D2D', borderTop: '1px solid #242424', marginTop: '64px' }}>
        <div className="container mx-auto px-4 py-6 text-center text-gray-300">
          <p style={{ fontFamily: 'Georgia', fontWeight: '300' }}>Made with ♥ by Gottlieb Dinh</p>
        </div>
      </footer>
    </div>
  )
}
