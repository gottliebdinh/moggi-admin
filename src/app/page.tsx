import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

export default function HomePage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section - Dunkelgrauer MOGGI Style */}
        <div className="text-center">
          <h1 className="text-3xl font-light mb-4 font-serif text-white">Willkommen im MOGGI Admin</h1>
          <p className="text-lg text-gray-300">Verwalte dein Restaurant effizient</p>
        </div>

        {/* Quick Stats - Dunkelgrauer MOGGI Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg p-6 border border-gray-600 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#666666' }}>Heutige Bestellungen</p>
                <p className="text-2xl font-bold font-serif" style={{ color: '#FF6B00' }}>0</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-gray-600 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#666666' }}>Aktive Reservierungen</p>
                <p className="text-2xl font-bold font-serif" style={{ color: '#FF6B00' }}>0</p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-gray-600 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#666666' }}>Verfügbare Tische</p>
                <p className="text-2xl font-bold font-serif" style={{ color: '#FF6B00' }}>0</p>
              </div>
              <div className="text-3xl">🪑</div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Dunkelgrauer MOGGI Style */}
        <div className="rounded-lg p-6 border border-gray-600 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
          <h2 className="text-xl font-semibold mb-4 font-serif">Schnellzugriff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/orders"
                    className="flex items-center p-4 rounded-lg transition-colors hover:shadow-lg"
                    style={{ backgroundColor: '#F5F5F5' }}
                  >
                    <span className="text-2xl mr-3">📋</span>
                    <div>
                      <h3 className="font-medium">Bestellungen verwalten</h3>
                      <p className="text-sm" style={{ color: '#666666' }}>Neue Bestellungen anzeigen und bearbeiten</p>
                    </div>
                  </Link>

            <Link
              href="/reservations"
              className="flex items-center p-4 rounded-lg transition-colors hover:shadow-lg"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <span className="text-2xl mr-3">📅</span>
              <div>
                <h3 className="font-medium">Reservierungen</h3>
                <p className="text-sm" style={{ color: '#666666' }}>Tischbuchungen verwalten</p>
              </div>
            </Link>

            <Link
              href="/tables"
              className="flex items-center p-4 rounded-lg transition-colors hover:shadow-lg"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <span className="text-2xl mr-3">🪑</span>
              <div>
                <h3 className="font-medium">Tischplan</h3>
                <p className="text-sm" style={{ color: '#666666' }}>Räume und Tische verwalten</p>
              </div>
            </Link>

            <Link
              href="/settings"
              className="flex items-center p-4 rounded-lg transition-colors hover:shadow-lg"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <h3 className="font-medium">Einstellungen</h3>
                <p className="text-sm" style={{ color: '#666666' }}>System-Konfiguration</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}