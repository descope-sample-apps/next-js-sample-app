// app/api/user-details/route.ts

import { session } from '@descope/nextjs-sdk/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currSession = await session({
      projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
    });

    if (!currSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      session: currSession,
      message: "User is authenticated"
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
