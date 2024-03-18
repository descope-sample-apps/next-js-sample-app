"use client";

import React from "react";
import { AuthProvider } from "@descope/nextjs-sdk";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider
        projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || ""}
        baseUrl={process.env.NEXT_PUBLIC_DESCOPE_BASE_URL || ""}
      >
        <body className={fontSans.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
