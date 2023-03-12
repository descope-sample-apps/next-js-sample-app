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
  if (!sessionToken) {
    return false;
  }
  try {
    await descopeSdk.validateSession(sessionToken);
  } catch (error) {
    return false;
  }
  return true;
}