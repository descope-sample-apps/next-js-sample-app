import { createSdk, session } from "@descope/nextjs-sdk/server";

const sdk = createSdk({
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
});

export async function GET() {
  const currSession = session();
  if (!currSession) {
    return new Response("Not Validated", { status: 401 });
  }
  return new Response(JSON.stringify({ data: "Result: Request Validated" }), {
    status: 200,
  });
}
