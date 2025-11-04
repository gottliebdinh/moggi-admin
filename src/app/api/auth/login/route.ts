import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Passwort aus Environment-Variable (Standard: 'moggi2024')
// Kann in .env.local überschrieben werden: ADMIN_PASSWORD=dein-passwort
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'moggi2024'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Passwort erforderlich' },
        { status: 400 }
      )
    }

    // Passwort prüfen
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Falsches Passwort' },
        { status: 401 }
      )
    }

    // Session-Cookie setzen (30 Tage gültig)
    const cookieStore = await cookies()
    cookieStore.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Anmelden' },
      { status: 500 }
    )
  }
}

