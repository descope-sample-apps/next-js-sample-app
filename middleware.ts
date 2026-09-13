import { authMiddleware } from "@descope/nextjs-sdk/server";

export default authMiddleware({
  publicRoutes: ['/sign-in', '/', '/probe/*'],
  redirectUrl: '/sign-in',
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
  // a valid refresh token alone is not a session - server code that calls
  // session() needs a valid DS, so gate on that and let the client SDK refresh
  skipRefreshTokenValidation: true,
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};