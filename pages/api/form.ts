import type { NextApiRequest, NextApiResponse } from 'next';
import { validateRequestSession } from '../../utils/auth';

type Data = {
  data: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const validated = await validateRequestSession(req.cookies?.['DS']);
  res.status(200).json({ data: validated ? 'Request Validated' : 'Request Not Validated'  })
}
