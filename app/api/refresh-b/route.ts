import { refreshRace } from '@/lib/refreshRace';
import { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => refreshRace(req, 'B');
