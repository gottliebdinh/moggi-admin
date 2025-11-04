import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth')
  const isAuthenticated = authCookie?.value === 'authenticated'
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Wenn auf Login-Seite und bereits eingeloggt, weiterleiten zu /orders
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/orders', request.url))
  }

  // Wenn nicht auf Login-Seite und nicht eingeloggt, weiterleiten zu Login
  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}

