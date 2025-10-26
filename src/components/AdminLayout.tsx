'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#2D2D2D' }}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div 
          className="rounded-2xl p-8 mb-2"
          style={{ 
            backgroundColor: '#1A1A1A',
            borderWidth: '1px',
            borderColor: '#242424'
          }}
        >
          <h1 className="text-4xl font-light mb-2 text-white" style={{ fontFamily: 'Georgia', fontWeight: '300' }}>MOGGI Admin</h1>
          <div className="w-16 h-1 rounded mb-4" style={{ backgroundColor: '#FF6B00' }}></div>
          <p className="text-white">Restaurant Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-1">
        <div 
          className="rounded-2xl p-5 mb-2"
          style={{ 
            backgroundColor: '#1A1A1A',
            borderWidth: '1px',
            borderColor: '#242424'
          }}
        >
          <nav className="flex gap-3 flex-wrap">
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
      <main className="container mx-auto px-4 py-8">
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
