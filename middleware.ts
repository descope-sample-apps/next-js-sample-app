import { authMiddleware } from "@descope/nextjs-sdk/server";

export default authMiddleware({
  publicRoutes: ['/sign-in', '/'],
  redirectUrl: '/sign-in',
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};