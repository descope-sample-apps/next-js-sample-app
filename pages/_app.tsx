import { AuthProvider } from "@descope/react-sdk";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import "../styles/globals.css";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children}) => {
  // This is an example for an app layout that is needed for most of the app
  // but not for specific pages such as login page.
  // it can also enrich context with user data and so forth
  return (
    <div style={{ display: "flex" }}>
      {/* side bar */}
      <div style={{ width: 200, height: "100vh", padding: 20, borderRight: '1px solid' }}>
        <h2>Left Sidebar</h2>
      </div>
      {/* content */}
      <div style={{ flex: 1, padding: 20 }}>{children}</div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLayoutNeeded = ![`/login`].includes(router.pathname);

  const LayoutComponent = isLayoutNeeded ? AppLayout : React.Fragment;
  return (
    <AuthProvider
      projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!}
      baseUrl={process.env.NEXT_PUBLIC_DESCOPE_BASE_URL}
      sessionTokenViaCookie
    >
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthProvider>
  );
}
