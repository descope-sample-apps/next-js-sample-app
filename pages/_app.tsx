import { AuthProvider } from "@descope/react-sdk";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider
      projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!}
      baseUrl={process.env.NEXT_PUBLIC_DESCOPE_BASE_URL}
      // use the bellow option when you need to use session token in the SSR render cycle
      sessionTokenViaCookie 
    >
      <Component {...pageProps} />
    </AuthProvider>
  );
}
