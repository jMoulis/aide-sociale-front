import { routing } from './i18n/routing';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { COOKIE_SERVER_AUTH } from './lib/utils/auth/utils';
import token from '@/lib/auth/JWTToken';

const intlMiddleware = createMiddleware(routing);
const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/:locale/admin(.*)', '/dashboard(.*)', '/:locale/dashboard(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId && isProtectedRoute(request)) {
    return redirectToSignIn();
  }
  const response = intlMiddleware(request);

  response.cookies.set(COOKIE_SERVER_AUTH, token);
  return response;
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // Root path
    '/(fr|en)/:path*', // Localized paths for supported locales
    // Exclude _next, static files, and all /api/* routes from localization
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};