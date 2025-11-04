import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MOGGI Admin Dashboard',
  description: 'Restaurant Management System',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen text-white" style={{ backgroundColor: '#2D2D2D' }}>
        {children}
      </body>
    </html>
  )
}