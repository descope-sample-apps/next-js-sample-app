import DescopeClient from "@descope/node-sdk";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

const descopeSdk = DescopeClient({
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!,
  baseUrl: process.env.NEXT_PUBLIC_DESCOPE_BASE_URL,
  logger: console,
});

export const validateRequestSession = async (req: {
  cookies: NextApiRequestCookies
}) =>  {
  const sessionToken = req.cookies?.['DS'];
  // TODO - need to think how to set DSR in the client side
  const refreshToken = req.cookies?.['DSR'];
  try {
    await descopeSdk.validateAndRefreshSession(sessionToken, refreshToken);
  } catch (error) {
    return false;
  }
  return true;
}

export const getUserDisplayName = (user: any) => user?.name || user?.externalIds?.[0] || '';
