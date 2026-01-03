import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth routes that logged-in users shouldn't access
const authRoutes = ['/login', '/sign-up'];

// Protected routes that require authentication
const protectedRoutes = ['/account', '/orders', '/profile', '/checkout'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If user is logged in and tries to access auth pages (login/sign-up)
  // Redirect them to home page
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is NOT logged in and tries to access protected pages
  // Redirect them to login page
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    // Add redirect parameter so after login they can return to intended page
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
