import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { SyntheticEvent, useCallback } from "react";
import styles from "../styles/Home.module.css";
import { validateRequestSession } from "../utils/auth";

const getUserDisplayName = (user: any) => user?.name || user?.externalIds?.[0] || '';

export default function Home({ data }: { data: string }) {
  const { isAuthenticated } = useSession();
  const { user } = useUser();
  const { logout } = useDescope();

  const onLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const response = await fetch("/api/form", { method: "POST" });

    const result = await response.json();
    alert(`Result: ${result.data}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://github.com/descope-sample-apps/next-js-sample-app">
            Descope Next.js Sample App
          </a>
        </h1>
        {!isAuthenticated && (
          <Link href="/login" passHref>
            <button>Login</button>
          </Link>
        )}
        {isAuthenticated && (
          <>
            <div className={styles.description}>
              Hello {getUserDisplayName(user)}
            </div>
            <button onClick={onLogout}>Logout</button>
            <div className={styles.description}>Submit API Form</div>
            <form onSubmit={handleSubmit}>
              <button type="submit">Submit</button>
            </form>
          </>
        )}

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <div>Server Side Props Data:</div>
          <div className={styles.card}>
            <code className={styles.code}>{data}</code>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const validated = await validateRequestSession(context.req.cookies?.['DS']);

  return {
    props: {
      data: validated ? "Validated" : "Not Validated",
    },
  };
};
