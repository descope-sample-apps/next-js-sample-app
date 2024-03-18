"use client";

import styles from "../../styles/Login.module.css";
import { Descope } from "@descope/nextjs-sdk";

export default function Login() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.login}>
          <Descope
            flowId={process.env.NEXT_PUBLIC_DESCOPE_FLOW_ID || "sign-up-or-in"}
            redirectAfterSuccess="/"
            redirectAfterError="/"
          />
        </div>
      </main>
    </div>
  );
}
