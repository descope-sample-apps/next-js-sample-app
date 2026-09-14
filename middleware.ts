import { authMiddleware } from "@descope/nextjs-sdk/server";

export default authMiddleware({
  publicRoutes: ['/sign-in', '/'],
  redirectUrl: '/sign-in',
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
  // Only a valid session token (DS) counts as authenticated here. Without this,
  // a request carrying just a valid refresh token (DSR) passes the middleware
  // while session() still sees no session on the server.
  skipRefreshTokenValidation: true,
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};