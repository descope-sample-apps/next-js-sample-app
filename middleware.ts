
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validateRequestSession } from './utils/auth';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const validate = validateRequestSession(request.cookies?.get('DS')?.value)
  console.log('@@@ middleware', validate);
  return NextResponse.next()
}


