
import DescopeClient from "@descope/node-sdk";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('@@@ middleware is running');
  const descopeSdk = DescopeClient({
    projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!,
    baseUrl: process.env.NEXT_PUBLIC_DESCOPE_BASE_URL,
    logger: console,
  });
  return NextResponse.next()
}


