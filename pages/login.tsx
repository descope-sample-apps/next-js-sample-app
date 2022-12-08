import { useAuth } from "@descope/react-sdk";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "../styles/Login.module.css";

// Descope component interacts with browser API and should render only in CSR
const DescopeWC = dynamic(
  async () => {
    const { Descope } = await import("@descope/react-sdk");
    return (props: React.ComponentProps<typeof Descope>) => (
      <Descope {...props} />
    );
  },
  {
    ssr: false,
  }
);

export default function Login() {
  const router = useRouter();
  const { getRefreshToken } = useAuth();
  const onSuccess = useCallback(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // Set refresh token on cookie so it can be used in getServerSideProps
      // This is only requires for when Descope tokens do NOT managed already in cookies.
      // In production, prefer managing Descope tokens in cookies.
      document.cookie = `DSR=${refreshToken}`;
    }
    router.push("/");
  }, [router]);

  const onError = useCallback((e: any) => {
    console.log("Descope got error", e);
    router.push("/");
  }, [router]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.login}>
          <DescopeWC
            flowId={process.env.NEXT_PUBLIC_DESCOPE_FLOW_ID || "sign-up-or-in"}
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>
      </main>
    </div>
  );
}
