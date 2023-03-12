import DescopeClient from "@descope/node-sdk";

export const validateRequestSession = async (sessionToken: string = '') =>  {
  const descopeSdk = DescopeClient({
    projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!,
    baseUrl: process.env.NEXT_PUBLIC_DESCOPE_BASE_URL,
    logger: console,
  });
  
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
