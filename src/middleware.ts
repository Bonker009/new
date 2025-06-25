import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user-role')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/about', '/contact', '/faq'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is authenticated and trying to access auth pages
  if (token && (pathname.startsWith('/auth'))) {
    // Redirect to appropriate dashboard based on role
    const dashboardUrl = role === 'OWNER' ? '/owner/dashboard' : '/user/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Role-based route protection
  if (token && role) {
    // Owner trying to access user routes
    if (role === 'OWNER' && pathname.startsWith('/user')) {
      return NextResponse.redirect(new URL('/owner/dashboard', request.url));
    }
    
    // User trying to access owner routes
    if (role === 'USER' && pathname.startsWith('/owner')) {
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }

    // Redirect root to appropriate dashboard
    if (pathname === '/') {
      const dashboardUrl = role === 'OWNER' ? '/owner/dashboard' : '/user/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};