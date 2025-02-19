import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { authRoutes, publicRoutes} from './src/routes'

export default async function middleware(req) {
  //console.log("Middleware triggered:", req.nextUrl.pathname);
  const { nextUrl } = req
  
  // Retrieve the user session token with next-auth/jwt
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  //console.log('middleware logging token:::', token)
  const isLoggedIn = !!token

  //const isPublic = publicRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isPublic = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isOnboarding = nextUrl.pathname === '/home/onboarding'
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Public route: always allow
  if (isPublic) {
    return NextResponse.next()
  }

  // Auth route: if logged in, redirect to home; otherwise allow
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/home', nextUrl))
    }
    return NextResponse.next()
  }


  // If accessing onboarding and not logged in, redirect to login
  if (isOnboarding && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // If user has completed onboarding, prevent access to /home/onboarding
  if (isOnboarding && isLoggedIn && token.firstTimeLogin === false) {
    return NextResponse.redirect(new URL('/home', nextUrl))
  }

  // 5) Check for first-time login
  if (isLoggedIn) {
    if (token.firstTimeLogin && nextUrl.pathname !== '/home/onboarding') {
      return NextResponse.redirect(new URL('/home/onboarding', nextUrl));
    }
  }

  if (isAdminRoute) {
    if (!isLoggedIn || token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  // 4) Protected route: if not logged in, go to /login
  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // 6) Otherwise, just continue
  return NextResponse.next()
}

// 7) Matcher config
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|members).*)'],
}
