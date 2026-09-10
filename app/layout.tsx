import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@descope/nextjs-sdk';
import HeadProbe from './components/HeadProbe';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Sample App",
  description: "Authenticate with Descope",
  icons: {
    icon: "/public/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider
          projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || ''}
          baseUrl={process.env.NEXT_PUBLIC_DESCOPE_BASE_URL}
          baseStaticUrl={process.env.NEXT_PUBLIC_DESCOPE_BASE_STATIC_URL}
        >
          <HeadProbe />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}